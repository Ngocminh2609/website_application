package com.ecommerce.backend.constant.dto;

/**
 * Hằng số cấu hình LoginRequest DTO.
 */
public final class LoginRequestConstants {

    private LoginRequestConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Validation Messages
    public static final String ERROR_USERNAME_REQUIRED = "Tên đăng nhập không được để trống";
    public static final String ERROR_PASSWORD_REQUIRED = "Mật khẩu không được để trống";
}
