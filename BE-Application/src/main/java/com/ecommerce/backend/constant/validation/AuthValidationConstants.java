package com.ecommerce.backend.constant.validation;

/**
 * Quy tắc / message validation auth dùng chung cho User entity và auth DTOs.
 */
public final class AuthValidationConstants {

    private AuthValidationConstants() {
    }

    public static final int PASSWORD_MIN_LENGTH = 6;

    public static final String ERROR_USERNAME_REQUIRED = "Tên đăng nhập không được để trống";
    public static final String ERROR_PASSWORD_REQUIRED = "Mật khẩu không được để trống";
    public static final String ERROR_PASSWORD_SIZE = "Mật khẩu phải có ít nhất 6 ký tự";
}
