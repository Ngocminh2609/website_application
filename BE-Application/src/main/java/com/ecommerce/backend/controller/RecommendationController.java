package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.JwtUserResolver;
import com.ecommerce.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final JwtUserResolver jwtUserResolver;

    /**
     * Ghi nhận lượt xem sản phẩm của người dùng từ FE.
     */
    @PostMapping("/track/{productId}")
    public ResponseEntity<Void> trackView(@PathVariable Long productId, Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            User user = jwtUserResolver.getCurrentUser();
            recommendationService.trackProductView(user, productId);
        }
        return ResponseEntity.ok().build();
    }

    /**
     * Lấy gợi ý sản phẩm cá nhân hóa cho người dùng hiện tại.
     */
    @GetMapping("/personal")
    public ResponseEntity<List<Product>> getPersonalized(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            User user = jwtUserResolver.getCurrentUser();
            return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations(user, limit));
        }
        return ResponseEntity.ok(List.of()); // Trả về rỗng nếu chưa đăng nhập
    }
}
