package com.ecommerce.backend.constant.security;

/**
 * JWT claim keys Keycloak dùng chung.
 */
public final class JwtClaimConstants {

    private JwtClaimConstants() {
    }

    public static final String CLAIM_PREFERRED_USERNAME = "preferred_username";
    public static final String CLAIM_SUB = "sub";
    public static final String CLAIM_EMAIL = "email";
    public static final String CLAIM_NAME = "name";
    public static final String CLAIM_REALM_ACCESS = "realm_access";
    public static final String CLAIM_ROLES = "roles";
}
