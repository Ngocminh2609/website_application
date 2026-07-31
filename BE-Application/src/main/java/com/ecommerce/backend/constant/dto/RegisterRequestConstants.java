package com.ecommerce.backend.constant.dto;

/**
 * Hằng số cấu hình RegisterRequest DTO (chỉ phần riêng DTO).
 */
public final class RegisterRequestConstants {

    private RegisterRequestConstants() {
    }

    public static final int USERNAME_MIN_LENGTH = 3;
    public static final int USERNAME_MAX_LENGTH = 50;

    public static final String ERROR_USERNAME_SIZE = "Tên đăng nhập phải từ 3 đến 50 ký tự";
    public static final String ERROR_EMAIL_REQUIRED = "Email không được để trống";
    public static final String ERROR_EMAIL_INVALID = "Email không đúng định dạng";
}
