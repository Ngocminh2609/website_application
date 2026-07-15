package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.CurrentUser;
import com.ecommerce.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@CurrentUser User user) {
        return ResponseEntity.ok(cartService.getCartByUser(user));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@CurrentUser User user, @RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());
        return ResponseEntity.ok(cartService.addItemToCart(user, productId, quantity));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<Cart> updateQuantity(
            @CurrentUser User user,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> payload
    ) {
        Integer quantity = payload.get("quantity");
        return ResponseEntity.ok(cartService.updateItemQuantity(user, itemId, quantity));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Cart> removeItem(@CurrentUser User user, @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(user, itemId));
    }
}
