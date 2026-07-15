package com.ecommerce.backend.constant.domain;

/**
 * Thông báo lỗi domain dùng chung (tránh wording lệch giữa các lớp).
 */
public final class ErrorMessageConstants {

    private ErrorMessageConstants() {
    }

    public static final String ERROR_PRODUCT_NOT_FOUND = "Không tìm thấy sản phẩm";
    public static final String ERROR_USER_NOT_FOUND = "Không tìm thấy người dùng";
    public static final String ERROR_CATEGORY_NOT_FOUND = "Không tìm thấy danh mục";
    public static final String ERROR_BANNER_NOT_FOUND = "Không tìm thấy banner";
    public static final String ERROR_ORDER_NOT_FOUND = "Không tìm thấy đơn hàng";
}
