package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ReviewRequest;
import com.ecommerce.backend.entity.ProductReview;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * Lấy danh sách review đã duyệt của sản phẩm - public endpoint.
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReview>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getApprovedReviews(productId));
    }

    /**
     * User đã đăng nhập gửi đánh giá sản phẩm.
     * Lấy userId từ JWT thay vì để FE tự gửi để tránh giả mạo identity.
     */
    @PostMapping("/product/{productId}")
    public ResponseEntity<ProductReview> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(reviewService.createReview(productId, currentUser.getId(), request));
    }

    /**
     * ADMIN: Lấy tất cả review (bao gồm những cái chưa duyệt).
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<ProductReview>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    /**
     * ADMIN: Duyệt review của khách hàng.
     */
    @PutMapping("/admin/{reviewId}/approve")
    public ResponseEntity<Void> approveReview(@PathVariable Long reviewId) {
        reviewService.approveReview(reviewId);
        return ResponseEntity.ok().build();
    }

    /**
     * Xóa review - chủ review hoặc Admin.
     * Role được lấy từ JWT để tránh FE tự khai quyền.
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal User currentUser) {
        reviewService.deleteReview(reviewId, currentUser.getId(), currentUser.getRole());
        return ResponseEntity.ok("Xóa đánh giá thành công");
    }
}
