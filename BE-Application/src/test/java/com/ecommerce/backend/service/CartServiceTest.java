package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.CartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_PRODUCT_NOT_FOUND;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private ProductService productService;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Product product;
    private Cart cart;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        product = new Product();
        product.setId(10L);
        product.setName("Laptop");

        cart = new Cart();
        cart.setId(100L);
        cart.setUser(user);
        cart.setItems(new ArrayList<>());
    }

    @Test
    void getCartByUser_createsCartWhenMissing() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenAnswer(inv -> inv.getArgument(0));

        Cart result = cartService.getCartByUser(user);

        assertThat(result.getUser()).isEqualTo(user);
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void addItemToCart_addsNewItem() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productService.requireProduct(10L)).thenReturn(product);
        when(cartRepository.save(any(Cart.class))).thenAnswer(inv -> inv.getArgument(0));

        Cart result = cartService.addItemToCart(user, 10L, 2);

        assertThat(result.getItems()).hasSize(1);
        assertThat(result.getItems().get(0).getQuantity()).isEqualTo(2);
        assertThat(result.getItems().get(0).getProduct()).isEqualTo(product);
    }

    @Test
    void addItemToCart_incrementsExistingItem() {
        CartItem existing = new CartItem();
        existing.setId(1L);
        existing.setProduct(product);
        existing.setQuantity(1);
        existing.setCart(cart);
        cart.getItems().add(existing);

        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productService.requireProduct(10L)).thenReturn(product);
        when(cartRepository.save(any(Cart.class))).thenAnswer(inv -> inv.getArgument(0));

        Cart result = cartService.addItemToCart(user, 10L, 3);

        assertThat(result.getItems()).hasSize(1);
        assertThat(result.getItems().get(0).getQuantity()).isEqualTo(4);
    }

    @Test
    void addItemToCart_throwsWhenProductMissing() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productService.requireProduct(99L)).thenThrow(new ResourceNotFoundException(ERROR_PRODUCT_NOT_FOUND));

        assertThatThrownBy(() -> cartService.addItemToCart(user, 99L, 1))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage(ERROR_PRODUCT_NOT_FOUND);
    }

    @Test
    void updateItemQuantity_removesWhenQuantityZeroOrLess() {
        CartItem existing = new CartItem();
        existing.setId(5L);
        existing.setProduct(product);
        existing.setQuantity(2);
        existing.setCart(cart);
        cart.getItems().add(existing);

        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenAnswer(inv -> inv.getArgument(0));

        Cart result = cartService.updateItemQuantity(user, 5L, 0);

        assertThat(result.getItems()).isEmpty();
    }

    @Test
    void updateItemQuantity_throwsWhenItemMissing() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        assertThatThrownBy(() -> cartService.updateItemQuantity(user, 999L, 2))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void removeItemFromCart_throwsWhenItemMissing() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        assertThatThrownBy(() -> cartService.removeItemFromCart(user, 999L))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void clearCart_clearsItemsWhenCartExists() {
        CartItem existing = new CartItem();
        existing.setId(5L);
        existing.setProduct(product);
        existing.setQuantity(2);
        cart.getItems().add(existing);

        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenAnswer(inv -> inv.getArgument(0));

        cartService.clearCart(1L);

        ArgumentCaptor<Cart> captor = ArgumentCaptor.forClass(Cart.class);
        verify(cartRepository).save(captor.capture());
        assertThat(captor.getValue().getItems()).isEmpty();
    }
}
