package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.CurrentUser;
import com.ecommerce.backend.service.WishlistService;
import com.ecommerce.backend.util.http.ResponseMessageUtil;
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

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(@CurrentUser User user) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(user));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(@CurrentUser User user, @PathVariable Long productId) {
        wishlistService.addToWishlist(user, productId);
        return ResponseEntity.ok(ResponseMessageUtil.message(SUCCESS_ADDED));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@CurrentUser User user, @PathVariable Long productId) {
        wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.ok(ResponseMessageUtil.message(SUCCESS_REMOVED));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(@CurrentUser User user, @PathVariable Long productId) {
        boolean isInWishlist = wishlistService.isInWishlist(user, productId);
        return ResponseEntity.ok(Map.of(RESPONSE_KEY_IS_IN_WISHLIST, isInWishlist));
    }
}
