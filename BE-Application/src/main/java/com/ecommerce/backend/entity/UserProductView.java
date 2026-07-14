package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity lưu vết lịch sử xem sản phẩm của người dùng.
 */
@Entity
@Table(name = "user_product_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProductView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "view_count")
    private Integer viewCount;

    @Column(name = "last_viewed_at")
    private LocalDateTime lastViewedAt;

    @PrePersist
    protected void onCreate() {
        // Khởi tạo giá trị mặc định khi tạo mới
        this.lastViewedAt = LocalDateTime.now();
        if (this.viewCount == null) {
            this.viewCount = 1;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        // Cập nhật thời gian khi thay đổi
        this.lastViewedAt = LocalDateTime.now();
    }
}
