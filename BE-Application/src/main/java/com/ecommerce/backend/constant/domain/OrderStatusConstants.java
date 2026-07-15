package com.ecommerce.backend.constant.domain;

/**
 * Trạng thái đơn hàng dùng chung.
 */
public final class OrderStatusConstants {

    private OrderStatusConstants() {
    }

    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_PAID = "PAID";
    public static final String STATUS_FAILED = "FAILED";
    public static final String STATUS_SHIPPING = "SHIPPING";
    public static final String STATUS_DELIVERED = "DELIVERED";
    public static final String STATUS_CANCELLED = "CANCELLED";
}
