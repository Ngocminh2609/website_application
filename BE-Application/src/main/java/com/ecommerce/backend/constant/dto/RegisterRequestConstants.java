package com.ecommerce.backend.constant.dto;

/**
 * Hằng số cấu hình RegisterRequest DTO.
 */
public final class RegisterRequestConstants {

    private RegisterRequestConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Validation Rules
    public static final int USERNAME_MIN_LENGTH = 3;
    public static final int USERNAME_MAX_LENGTH = 50;
    public static final int PASSWORD_MIN_LENGTH = 6;

    // Validation Messages
    public static final String ERROR_USERNAME_REQUIRED = "Tên đăng nhập không được để trống";
    public static final String ERROR_USERNAME_SIZE = "Tên đăng nhập phải từ 3 đến 50 ký tự";
    public static final String ERROR_PASSWORD_REQUIRED = "Mật khẩu không được để trống";
    public static final String ERROR_PASSWORD_SIZE = "Mật khẩu phải có ít nhất 6 ký tự";
    public static final String ERROR_EMAIL_REQUIRED = "Email không được để trống";
    public static final String ERROR_EMAIL_INVALID = "Email không đúng định dạng";
}
