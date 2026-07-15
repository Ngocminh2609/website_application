package com.ecommerce.backend.constant.security;

/**
 * Hằng số cấu hình JwtUserResolver.
 */
public final class JwtUserResolverConstants {

    private JwtUserResolverConstants() {
    }

    public static final String PLACEHOLDER_PASSWORD = "OAUTH2_USER_NO_PASSWORD";

    public static final String ERROR_AUTH_MISSING = "Không tìm thấy thông tin xác thực. Vui lòng đăng nhập lại.";
    public static final String ERROR_USER_SYNC_FAILED = "Lỗi đồng bộ hóa dữ liệu người dùng";

    public static final String LOG_AUTO_SYNC = "Auto-sync user '{}' vào DB từ JWT token.";
    public static final String LOG_CONCURRENT_CREATE = "User '{}' was concurrently created. Fetching the existing record.";
}
