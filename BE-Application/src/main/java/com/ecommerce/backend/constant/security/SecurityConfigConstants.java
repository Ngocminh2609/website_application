package com.ecommerce.backend.constant.security;

/**
 * Hằng số cấu hình SecurityConfig.
 */
public final class SecurityConfigConstants {

    private SecurityConfigConstants() {
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

    // Placeholder cho tài khoản OAuth2 (không có mật khẩu thật)
    public static final String PLACEHOLDER_PASSWORD_PREFIX = "KEYCLOAK_OAUTH2_PLACEHOLDER_";

    // Log Messages
    public static final String LOG_USER_DUPLICATE = "User '{}' already exists (duplicate key during sync), skipping insert.";
    public static final String LOG_SYNC_ERROR = "Lỗi khi sync user từ JWT token: ";
}
