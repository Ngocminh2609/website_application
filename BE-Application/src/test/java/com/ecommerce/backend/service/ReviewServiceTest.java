package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ReviewRequest;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductReview;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.ProductReviewRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_PRODUCT_NOT_FOUND;
import static com.ecommerce.backend.constant.service.ReviewServiceConstants.ERROR_ALREADY_REVIEWED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ProductReviewRepository reviewRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProductService productService;

    @InjectMocks
    private ReviewService reviewService;

    private User user;
    private Product product;
    private ReviewRequest request;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        product = new Product();
        product.setId(10L);
        request = new ReviewRequest();
        request.setRating(5);
        request.setComment("Great");
    }

    @Test
    void createReview_throwsWhenAlreadyReviewed() {
        when(reviewRepository.findByProductIdAndUserId(10L, 1L))
                .thenReturn(Optional.of(ProductReview.builder().build()));

        assertThatThrownBy(() -> reviewService.createReview(10L, 1L, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage(ERROR_ALREADY_REVIEWED);
    }

    @Test
    void createReview_throwsWhenProductMissing() {
        when(reviewRepository.findByProductIdAndUserId(10L, 1L)).thenReturn(Optional.empty());
        when(productService.requireProduct(10L)).thenThrow(new ResourceNotFoundException(ERROR_PRODUCT_NOT_FOUND));

        assertThatThrownBy(() -> reviewService.createReview(10L, 1L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage(ERROR_PRODUCT_NOT_FOUND);
    }

    @Test
    void createReview_setsVerifiedPurchaseAndPendingApproval() {
        when(reviewRepository.findByProductIdAndUserId(10L, 1L)).thenReturn(Optional.empty());
        when(productService.requireProduct(10L)).thenReturn(product);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(reviewRepository.hasUserPurchasedProduct(10L, 1L)).thenReturn(true);
        when(reviewRepository.save(any(ProductReview.class))).thenAnswer(inv -> {
            ProductReview review = inv.getArgument(0);
            review.setId(50L);
            return review;
        });
        when(reviewRepository.calculateAverageRating(10L)).thenReturn(5.0);
        when(reviewRepository.countByProductIdAndIsApprovedTrue(10L)).thenReturn(1L);
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        ProductReview saved = reviewService.createReview(10L, 1L, request);

        assertThat(saved.isVerifiedPurchase()).isTrue();
        assertThat(saved.getIsApproved()).isFalse();
        assertThat(saved.getRating()).isEqualTo((byte) 5);

        ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(productCaptor.capture());
        assertThat(productCaptor.getValue().getRating()).isEqualTo(5.0);
        assertThat(productCaptor.getValue().getReviewCount()).isEqualTo(1);
    }

    @Test
    void approveReview_marksApprovedAndUpdatesStats() {
        ProductReview review = ProductReview.builder()
                .id(50L)
                .product(product)
                .user(user)
                .isApproved(false)
                .build();
        when(reviewRepository.findById(50L)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any(ProductReview.class))).thenAnswer(inv -> inv.getArgument(0));
        when(reviewRepository.calculateAverageRating(10L)).thenReturn(4.5);
        when(reviewRepository.countByProductIdAndIsApprovedTrue(10L)).thenReturn(2L);
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        reviewService.approveReview(50L);

        assertThat(review.getIsApproved()).isTrue();
        assertThat(product.getRating()).isEqualTo(4.5);
        assertThat(product.getReviewCount()).isEqualTo(2);
    }
}
