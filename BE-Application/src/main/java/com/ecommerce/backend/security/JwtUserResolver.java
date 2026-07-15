package com.ecommerce.backend.security;

import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import static com.ecommerce.backend.constant.security.JwtUserResolverConstants.*;

/**
 * Utility để resolve User entity từ JWT Token trong SecurityContext.
 * Dùng thay cho @AuthenticationPrincipal trong các controller.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUserResolver {

    private final UserRepository userRepository;

    /**
     * Lấy User entity từ JWT token hiện tại trong SecurityContext.
     * Nếu user chưa tồn tại trong DB (lần đầu login qua Google),
     * tự động tạo mới và sync vào DB.
     */
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof Jwt jwt)) {
            throw new RuntimeException(ERROR_AUTH_MISSING);
        }

        String username = jwt.getClaimAsString(CLAIM_PREFERRED_USERNAME);
        if (username == null) {
            username = jwt.getClaimAsString(CLAIM_SUB);
        }

        final String finalUsername = username;

        return userRepository.findByUsername(username)
                .orElseGet(() -> {
                    // Auto-sync: tạo user mới nếu chưa có trong DB (vd: Google login)
                    log.info(LOG_AUTO_SYNC, finalUsername);
                    User newUser = new User();
                    newUser.setUsername(finalUsername);
                    newUser.setEmail(jwt.getClaimAsString(CLAIM_EMAIL));

                    String fullName = jwt.getClaimAsString(CLAIM_NAME);
                    newUser.setFullName(fullName != null ? fullName : finalUsername);

                    // Placeholder password cho OAuth2 user
                    newUser.setPassword(PLACEHOLDER_PASSWORD);

                    // Xác định role từ Keycloak token
                    java.util.Map<String, Object> realmAccess = jwt.getClaim(CLAIM_REALM_ACCESS);
                    String role = ROLE_USER;
                    if (realmAccess != null && realmAccess.get(CLAIM_ROLES) instanceof java.util.Collection<?> roles) {
                        if (roles.contains(ROLE_ADMIN)) role = ROLE_ADMIN;
                    }
                    newUser.setRole(role);

                    try {
                        return userRepository.save(newUser);
                    } catch (org.springframework.dao.DataIntegrityViolationException e) {
                        log.warn(LOG_CONCURRENT_CREATE, finalUsername);
                        return userRepository.findByUsername(finalUsername)
                                .orElseThrow(() -> new RuntimeException(ERROR_USER_SYNC_FAILED, e));
                    }
                });
    }
}
