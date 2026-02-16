package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private String vnp_TxnRef;
    private String vnp_TransactionNo;
    private String vnp_ResponseCode;
    private BigDecimal vnp_Amount;
    private String vnp_BankCode;
    private String vnp_PayDate;
    private String vnp_TransactionStatus;
    private String secureHash;

    @Column(columnDefinition = "TEXT")
    private String rawData;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
