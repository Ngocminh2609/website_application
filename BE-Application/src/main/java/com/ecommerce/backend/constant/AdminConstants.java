package com.ecommerce.backend.constant;

/**
 * Hằng số cấu hình tài khoản Admin mặc định.
 */
public final class AdminConstants {

    private AdminConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    public static final String DEFAULT_USERNAME = "admin";
    public static final String DEFAULT_PASSWORD = "admin123";
    public static final String DEFAULT_EMAIL = "admin@technova.com";
    public static final String DEFAULT_FULL_NAME = "Quản Trị Hệ Thống";
    public static final String DEFAULT_ROLE = "ADMIN";

    public static final String LOG_INITIALIZED = ">>> Đã khởi tạo tài khoản Admin mặc định: admin / admin123";
    public static final String LOG_UPDATED = ">>> Đã cập nhật lại mật khẩu mã hóa cho Admin";
}
