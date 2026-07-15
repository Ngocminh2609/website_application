package com.ecommerce.backend.constant.security;

/**
 * Hằng số cấu hình KeycloakRoleConverter.
 */
public final class KeycloakRoleConverterConstants {

    private KeycloakRoleConverterConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // JWT Claim Keys
    public static final String CLAIM_REALM_ACCESS = "realm_access";
    public static final String CLAIM_ROLES = "roles";

    // Security Prefix
    public static final String ROLE_PREFIX = "ROLE_";
}
