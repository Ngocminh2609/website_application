package com.ecommerce.backend.constant.controller;

/**
 * Hằng số cấu hình UserController.
 */
public final class UserConstants {

    private UserConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Response Messages
    public static final String SUCCESS_PASSWORD_CHANGE = "Đổi mật khẩu thành công";
    public static final String SUCCESS_THEME_UPDATE = "Cập nhật giao diện thành công";

    // JSON Keys
    public static final String RESPONSE_KEY_MESSAGE = "message";
    public static final String REQUEST_KEY_THEME = "theme";
}
