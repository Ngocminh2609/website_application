package com.ecommerce.backend.util.security;

import com.ecommerce.backend.util.text.StringUtil;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import static com.ecommerce.backend.constant.domain.RoleConstants.ROLE_ADMIN;
import static com.ecommerce.backend.constant.domain.RoleConstants.ROLE_USER;
import static com.ecommerce.backend.constant.security.JwtClaimConstants.*;

/**
 * Tiện ích parse claim JWT Keycloak dùng chung cho resolver / converter / sync.
 */
public final class JwtClaimUtil {

    private JwtClaimUtil() {
    }

    public static String resolveUsername(Jwt jwt) {
        String username = jwt.getClaimAsString(CLAIM_PREFERRED_USERNAME);
        if (username == null) {
            username = jwt.getClaimAsString(CLAIM_SUB);
        }
        return username;
    }

    public static String resolveEmail(Jwt jwt) {
        return jwt.getClaimAsString(CLAIM_EMAIL);
    }

    public static String resolveFullName(Jwt jwt, String fallbackUsername) {
        return StringUtil.defaultIfBlank(jwt.getClaimAsString(CLAIM_NAME), fallbackUsername);
    }

    /**
     * Đọc realm_access.roles; trả về collection rỗng nếu thiếu.
     */
    @SuppressWarnings("unchecked")
    public static Collection<String> extractRealmRoles(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaim(CLAIM_REALM_ACCESS);
        if (realmAccess == null || realmAccess.isEmpty()) {
            return Collections.emptyList();
        }
        Object roles = realmAccess.get(CLAIM_ROLES);
        if (!(roles instanceof Collection<?> collection)) {
            return Collections.emptyList();
        }
        return (Collection<String>) collection;
    }

    /**
     * Map role ứng dụng: ADMIN nếu có trong realm roles, ngược lại USER.
     */
    public static String resolveAppRole(Jwt jwt) {
        return extractRealmRoles(jwt).contains(ROLE_ADMIN) ? ROLE_ADMIN : ROLE_USER;
    }
}
