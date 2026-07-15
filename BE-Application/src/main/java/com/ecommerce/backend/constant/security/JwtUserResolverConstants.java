package com.ecommerce.backend.constant.security;

/**
 * Hằng số cấu hình JwtUserResolver.
 */
public final class JwtUserResolverConstants {

    private JwtUserResolverConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Realm Roles
    public static final String ROLE_USER = "USER";
    public static final String ROLE_ADMIN = "ADMIN";

    // JWT Claim Keys
    public static final String CLAIM_PREFERRED_USERNAME = "preferred_username";
    public static final String CLAIM_SUB = "sub";
    public static final String CLAIM_EMAIL = "email";
    public static final String CLAIM_NAME = "name";
    public static final String CLAIM_REALM_ACCESS = "realm_access";
    public static final String CLAIM_ROLES = "roles";

    // Placeholder cho user OAuth2 (không có mật khẩu thật)
    public static final String PLACEHOLDER_PASSWORD = "OAUTH2_USER_NO_PASSWORD";

    // Error Messages
    public static final String ERROR_AUTH_MISSING = "Không tìm thấy thông tin xác thực. Vui lòng đăng nhập lại.";
    public static final String ERROR_USER_SYNC_FAILED = "Lỗi đồng bộ hóa dữ liệu người dùng";

    // Log Messages
    public static final String LOG_AUTO_SYNC = "Auto-sync user '{}' vào DB từ JWT token.";
    public static final String LOG_CONCURRENT_CREATE = "User '{}' was concurrently created. Fetching the existing record.";
}
