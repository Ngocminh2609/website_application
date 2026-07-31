package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.UserProductView;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserProductViewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_PRODUCT_NOT_FOUND;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private UserProductViewRepository viewRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductService productService;

    @InjectMocks
    private RecommendationService recommendationService;

    private User user;
    private Product product;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        product = new Product();
        product.setId(10L);
        product.setName("Keyboard");
    }

    @Test
    void trackProductView_createsNewView() {
        when(productService.requireProduct(10L)).thenReturn(product);
        when(viewRepository.findByUserAndProduct(user, product)).thenReturn(Optional.empty());
        when(viewRepository.save(any(UserProductView.class))).thenAnswer(inv -> inv.getArgument(0));

        recommendationService.trackProductView(user, 10L);

        ArgumentCaptor<UserProductView> captor = ArgumentCaptor.forClass(UserProductView.class);
        verify(viewRepository).save(captor.capture());
        assertThat(captor.getValue().getViewCount()).isEqualTo(1);
        assertThat(captor.getValue().getProduct()).isEqualTo(product);
        assertThat(captor.getValue().getLastViewedAt()).isNotNull();
    }

    @Test
    void trackProductView_incrementsExistingView() {
        UserProductView existing = UserProductView.builder()
                .user(user)
                .product(product)
                .viewCount(2)
                .build();
        when(productService.requireProduct(10L)).thenReturn(product);
        when(viewRepository.findByUserAndProduct(user, product)).thenReturn(Optional.of(existing));
        when(viewRepository.save(any(UserProductView.class))).thenAnswer(inv -> inv.getArgument(0));

        recommendationService.trackProductView(user, 10L);

        assertThat(existing.getViewCount()).isEqualTo(3);
        verify(viewRepository).save(existing);
    }

    @Test
    void trackProductView_throwsWhenProductMissing() {
        when(productService.requireProduct(99L)).thenThrow(new ResourceNotFoundException(ERROR_PRODUCT_NOT_FOUND));

        assertThatThrownBy(() -> recommendationService.trackProductView(user, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage(ERROR_PRODUCT_NOT_FOUND);
    }

    @Test
    void getPersonalizedRecommendations_fillsFromBestSellersWhenNeeded() {
        Product viewed = new Product();
        viewed.setId(1L);
        Product bestSeller = new Product();
        bestSeller.setId(2L);

        when(viewRepository.findRecentlyViewedProductsByUser(eq(user), any(Pageable.class)))
                .thenReturn(List.of(viewed));
        when(viewRepository.findTopInterestedCategoriesByUser(eq(user), any(Pageable.class)))
                .thenReturn(List.of());
        when(productRepository.findByIsBestSellerTrue(any(Pageable.class)))
                .thenReturn(List.of(bestSeller));

        List<Product> result = recommendationService.getPersonalizedRecommendations(user, 4);

        assertThat(result).containsExactly(viewed, bestSeller);
    }
}
