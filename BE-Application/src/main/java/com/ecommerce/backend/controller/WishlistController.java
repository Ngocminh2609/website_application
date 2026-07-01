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
        return ResponseEntity.ok(Map.of("message", "Đã thêm vào danh sách yêu thích"));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId) {
        User user = jwtUserResolver.getCurrentUser();
        wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa khỏi danh sách yêu thích"));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(@PathVariable Long productId) {
        User user = jwtUserResolver.getCurrentUser();
        boolean isInWishlist = wishlistService.isInWishlist(user, productId);
        return ResponseEntity.ok(Map.of("isInWishlist", isInWishlist));
    }
}
