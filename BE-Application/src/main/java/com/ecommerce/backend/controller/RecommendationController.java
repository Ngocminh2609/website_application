package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.CurrentUser;
import com.ecommerce.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping("/track/{productId}")
    public ResponseEntity<Void> trackView(@CurrentUser User user, @PathVariable Long productId) {
        recommendationService.trackProductView(user, productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/personal")
    public ResponseEntity<List<Product>> getPersonalized(
            @CurrentUser User user,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations(user, limit));
    }
}
