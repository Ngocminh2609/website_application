package com.ecommerce.backend.constant.entity;

import static com.ecommerce.backend.constant.domain.OrderStatusConstants.STATUS_PENDING;
import static com.ecommerce.backend.constant.domain.PaymentMethodConstants.METHOD_VNPAY;

/**
 * Hằng số cấu hình Order Entity.
 */
public final class OrderConstants {

    private OrderConstants() {
    }

    public static final String DEFAULT_STATUS = STATUS_PENDING;
    public static final String DEFAULT_PAYMENT_METHOD = METHOD_VNPAY;
}
