package com.ecommerce.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(length = 20, nullable = false)
    private String status = "PENDING"; // PENDING, PAID, FAILED, SHIPPING, DELIVERED, CANCELLED

    private String paymentMethod = "VNPAY";

    @Column(columnDefinition = "TEXT")
    private String shippingAddress;

    private String phoneNumber;

    @Column(name = "order_date", updatable = false)
    private LocalDateTime orderDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("order")
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        // Chỉ gán orderDate khi tạo mới
        this.orderDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        // Gán updatedAt khi có cập nhật
        this.updatedAt = LocalDateTime.now();
    }
}
