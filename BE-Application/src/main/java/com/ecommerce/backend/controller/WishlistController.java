package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;

    // Lấy danh sách yêu thích của người dùng hiện tại
    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(user));
    }

    // Thêm sản phẩm vào danh sách yêu thích
    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(@AuthenticationPrincipal User user, @PathVariable Long productId) {
        wishlistService.addToWishlist(user, productId);
        return ResponseEntity.ok(Map.of("message", "Đã thêm vào danh sách yêu thích"));
    }

    // Xóa sản phẩm khỏi danh sách yêu thích
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@AuthenticationPrincipal User user, @PathVariable Long productId) {
        wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa khỏi danh sách yêu thích"));
    }

    // Kiểm tra trạng thái yêu thích của một sản phẩm
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(@AuthenticationPrincipal User user, @PathVariable Long productId) {
        boolean isInWishlist = wishlistService.isInWishlist(user, productId);
        return ResponseEntity.ok(Map.of("isInWishlist", isInWishlist));
    }
}
