package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.JwtUserResolver;
import com.ecommerce.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static com.ecommerce.backend.constant.controller.WishlistConstants.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final JwtUserResolver jwtUserResolver;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist() {
        User user = jwtUserResolver.getCurrentUser();
        return ResponseEntity.ok(wishlistService.getUserWishlist(user));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long productId) {
        User user = jwtUserResolver.getCurrentUser();
        wishlistService.addToWishlist(user, productId);
        return ResponseEntity.ok(Map.of(RESPONSE_KEY_MESSAGE, SUCCESS_ADDED));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId) {
        User user = jwtUserResolver.getCurrentUser();
        wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.ok(Map.of(RESPONSE_KEY_MESSAGE, SUCCESS_REMOVED));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(@PathVariable Long productId) {
        User user = jwtUserResolver.getCurrentUser();
        boolean isInWishlist = wishlistService.isInWishlist(user, productId);
        return ResponseEntity.ok(Map.of(RESPONSE_KEY_IS_IN_WISHLIST, isInWishlist));
    }
}
