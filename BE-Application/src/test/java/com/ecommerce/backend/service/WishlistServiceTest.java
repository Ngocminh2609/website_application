package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.WishlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_PRODUCT_NOT_FOUND;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WishlistServiceTest {

    @Mock
    private WishlistRepository wishlistRepository;
    @Mock
    private ProductService productService;

    @InjectMocks
    private WishlistService wishlistService;

    private User user;
    private Product product;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        product = new Product();
        product.setId(10L);
        product.setName("Mouse");
    }

    @Test
    void getUserWishlist_mapsProducts() {
        Wishlist entry = Wishlist.builder().user(user).product(product).build();
        when(wishlistRepository.findByUser(user)).thenReturn(List.of(entry));

        assertThat(wishlistService.getUserWishlist(user)).containsExactly(product);
    }

    @Test
    void addToWishlist_savesWhenNotPresent() {
        when(productService.requireProduct(10L)).thenReturn(product);
        when(wishlistRepository.findByUserAndProduct(user, product)).thenReturn(Optional.empty());

        wishlistService.addToWishlist(user, 10L);

        verify(wishlistRepository).save(any(Wishlist.class));
    }

    @Test
    void addToWishlist_skipsWhenAlreadyPresent() {
        when(productService.requireProduct(10L)).thenReturn(product);
        when(wishlistRepository.findByUserAndProduct(user, product))
                .thenReturn(Optional.of(Wishlist.builder().user(user).product(product).build()));

        wishlistService.addToWishlist(user, 10L);

        verify(wishlistRepository, never()).save(any());
    }

    @Test
    void addToWishlist_throwsWhenProductMissing() {
        when(productService.requireProduct(99L)).thenThrow(new ResourceNotFoundException(ERROR_PRODUCT_NOT_FOUND));

        assertThatThrownBy(() -> wishlistService.addToWishlist(user, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage(ERROR_PRODUCT_NOT_FOUND);
    }

    @Test
    void removeFromWishlist_deletesAssociation() {
        when(productService.requireProduct(10L)).thenReturn(product);

        wishlistService.removeFromWishlist(user, 10L);

        verify(wishlistRepository).deleteByUserAndProduct(user, product);
    }

    @Test
    void isInWishlist_returnsFalseWhenProductMissing() {
        when(productService.findProduct(99L)).thenReturn(Optional.empty());

        assertThat(wishlistService.isInWishlist(user, 99L)).isFalse();
    }

    @Test
    void isInWishlist_returnsTrueWhenPresent() {
        when(productService.findProduct(10L)).thenReturn(Optional.of(product));
        when(wishlistRepository.findByUserAndProduct(user, product))
                .thenReturn(Optional.of(Wishlist.builder().user(user).product(product).build()));

        assertThat(wishlistService.isInWishlist(user, 10L)).isTrue();
    }
}
