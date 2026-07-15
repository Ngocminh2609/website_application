package com.ecommerce.backend.constant.entity;

/**
 * Hằng số cấu hình Order Entity.
 */
public final class OrderConstants {

    private OrderConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Order Statuses
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_PAID = "PAID";
    public static final String STATUS_FAILED = "FAILED";
    public static final String STATUS_SHIPPING = "SHIPPING";
    public static final String STATUS_DELIVERED = "DELIVERED";
    public static final String STATUS_CANCELLED = "CANCELLED";

    // Default Values
    public static final String DEFAULT_STATUS = STATUS_PENDING;
    public static final String DEFAULT_PAYMENT_METHOD = "VNPAY";
}
