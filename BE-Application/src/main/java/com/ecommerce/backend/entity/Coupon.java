package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mã code duy nhất người dùng nhập, dùng UPPER để tránh phân biệt hoa thường khi tra cứu
    @Column(unique = true, nullable = false, length = 50)
    private String code;

    // Tách biệt 2 loại giảm giá để tính toán rõ ràng, không nhập nhằng khi đọc code
    @Column(name = "discount_type", nullable = false, length = 10)
    private String discountType; // PERCENT hoặc FIXED

    @Column(name = "discount_value", nullable = false)
    private BigDecimal discountValue;

    // Ngưỡng đơn hàng tối thiểu giúp bảo vệ doanh thu, tránh coupon bị apply vào mọi đơn nhỏ
    @Column(name = "min_order_amount")
    private BigDecimal minOrderAmount = BigDecimal.ZERO;

    // Giới hạn số tiền giảm tối đa khi dùng loại PERCENT, tránh giảm quá nhiều trên đơn lớn
    @Column(name = "max_discount_amount")
    private BigDecimal maxDiscountAmount;

    // Kiểm soát số lần coupon được sử dụng trên toàn hệ thống
    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // Quản lý vòng đời coupon theo thời gian mà không cần can thiệp thủ công
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
