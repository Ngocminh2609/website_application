package com.ecommerce.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Khi sản phẩm bị xóa, review cũng bị xóa theo (CASCADE) để tránh orphan data
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Product product;

    // Eager fetch vì luôn cần thông tin user (avatar, tên) khi hiển thị review
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
    private User user;

    // Số sao 1-5, dùng Byte để tiết kiệm bộ nhớ vì phạm vi nhỏ
    @Column(nullable = false)
    private Byte rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    // Đánh dấu đã mua để tăng độ tin cậy cho review, được set tự động khi tạo
    @Column(name = "is_verified_purchase")
    private boolean isVerifiedPurchase = false;

    // Cho phép admin duyệt trước khi hiển thị công khai nếu cần kiểm soát nội dung
    @Column(name = "is_approved")
    private Boolean isApproved = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
