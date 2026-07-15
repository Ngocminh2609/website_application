package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ReviewRequest;
import com.ecommerce.backend.entity.ProductReview;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.CurrentUser;
import com.ecommerce.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ecommerce.backend.constant.controller.ReviewConstants.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReview>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getApprovedReviews(productId));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ProductReview> createReview(
            @CurrentUser User currentUser,
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(productId, currentUser.getId(), request));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<ProductReview>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @PutMapping("/admin/{reviewId}/approve")
    public ResponseEntity<Void> approveReview(@PathVariable Long reviewId) {
        reviewService.approveReview(reviewId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@CurrentUser User currentUser, @PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId, currentUser.getId(), currentUser.getRole());
        return ResponseEntity.ok(SUCCESS_DELETE);
    }
}
