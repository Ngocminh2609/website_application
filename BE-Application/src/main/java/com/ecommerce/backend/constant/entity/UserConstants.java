package com.ecommerce.backend.constant.entity;

/**
 * Hằng số cấu hình User Entity.
 */
public final class UserConstants {

    private UserConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Validation Rules
    public static final int PASSWORD_MIN_LENGTH = 6;

    // Validation Messages
    public static final String ERROR_USERNAME_REQUIRED = "Tên đăng nhập không được để trống";
    public static final String ERROR_PASSWORD_REQUIRED = "Mật khẩu không được để trống";
    public static final String ERROR_PASSWORD_SIZE = "Mật khẩu phải có ít nhất 6 ký tự";
    public static final String ERROR_EMAIL_INVALID = "Email không hợp lệ";

    // Default Values
    public static final String DEFAULT_THEME = "light";

    // Security Prefix
    public static final String ROLE_PREFIX = "ROLE_";
}
