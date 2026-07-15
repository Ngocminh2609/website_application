package com.ecommerce.backend.constant.security;

/**
 * Hằng số cấu hình SecurityConfig.
 */
public final class SecurityConfigConstants {

    private SecurityConfigConstants() {
    }

    public static final String PLACEHOLDER_PASSWORD_PREFIX = "KEYCLOAK_OAUTH2_PLACEHOLDER_";

    public static final String LOG_USER_DUPLICATE = "User '{}' already exists (duplicate key during sync), skipping insert.";
    public static final String LOG_SYNC_ERROR = "Lỗi khi sync user từ JWT token: ";
}
