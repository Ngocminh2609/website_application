package com.ecommerce.backend.constant.config;

import static com.ecommerce.backend.constant.domain.RoleConstants.ROLE_ADMIN;

/**
 * Hằng số cấu hình tài khoản Admin mặc định.
 */
public final class AdminConstants {

    private AdminConstants() {
    }

    public static final String DEFAULT_USERNAME = "admin";
    public static final String DEFAULT_PASSWORD = "admin123";
    public static final String DEFAULT_EMAIL = "admin@technova.com";
    public static final String DEFAULT_FULL_NAME = "Quản Trị Hệ Thống";
    public static final String DEFAULT_ROLE = ROLE_ADMIN;

    public static final String LOG_INITIALIZED = ">>> Đã khởi tạo tài khoản Admin mặc định: admin / admin123";
    public static final String LOG_UPDATED = ">>> Đã cập nhật lại mật khẩu mã hóa cho Admin";
}
