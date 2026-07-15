package com.ecommerce.backend.constant.controller;

import static com.ecommerce.backend.constant.domain.RoleConstants.ROLE_USER;

/**
 * Hằng số cấu hình xác thực AuthController.
 */
public final class AuthConstants {

    private AuthConstants() {
    }

    public static final String DEFAULT_USER_ROLE = ROLE_USER;

    public static final String ERROR_USERNAME_EXISTS = "Tên đăng nhập đã tồn tại trong hệ thống.";
    public static final String ERROR_EMAIL_EXISTS = "Email đã được sử dụng bởi tài khoản khác.";
    public static final String SUCCESS_REGISTER = "Đăng ký thành công! Bạn có thể đăng nhập ngay.";

    public static final String RESPONSE_KEY_MESSAGE = "message";
}
