package com.ecommerce.backend.constant.service;

/**
 * Hằng số cấu hình CouponService.
 */
public final class CouponServiceConstants {

    private CouponServiceConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Discount Types
    public static final String DISCOUNT_TYPE_PERCENT = "PERCENT";

    // Exception Messages
    public static final String ERROR_COUPON_NOT_FOUND = "Mã giảm giá không tồn tại";
    public static final String ERROR_COUPON_INACTIVE = "Mã giảm giá đã bị vô hiệu hóa";
    public static final String ERROR_COUPON_EXPIRED = "Mã giảm giá đã hết hạn";
    public static final String ERROR_COUPON_LIMIT_REACHED = "Mã giảm giá đã được sử dụng hết";
    public static final String ERROR_MIN_ORDER_PREFIX = "Đơn hàng tối thiểu ";
    public static final String ERROR_MIN_ORDER_SUFFIX = "đ để dùng mã này";
    public static final String ERROR_COUPON_ID_NOT_FOUND = "Không tìm thấy mã giảm giá";

    // Response Messages
    public static final String SUCCESS_COUPON_APPLIED = "Áp dụng mã giảm giá thành công";
}
