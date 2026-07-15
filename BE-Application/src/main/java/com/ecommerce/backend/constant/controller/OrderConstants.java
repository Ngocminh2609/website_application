package com.ecommerce.backend.constant.controller;

/**
 * Hằng số cấu hình OrderController.
 */
public final class OrderConstants {

    private OrderConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Response messages
    public static final String SUCCESS_STATUS_UPDATE = "Cập nhật trạng thái thành công";
    public static final String SUCCESS_ORDER_DELETE = "Xóa đơn hàng thành công";

    // Exception messages
    public static final String ERROR_USER_NOT_FOUND = "Người dùng không tồn tại";
}
