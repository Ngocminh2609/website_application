package com.ecommerce.backend.security;

import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

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
            throw new RuntimeException("Không tìm thấy thông tin xác thực. Vui lòng đăng nhập lại.");
        }

        String username = jwt.getClaimAsString("preferred_username");
        if (username == null) {
            username = jwt.getClaimAsString("sub");
        }

        final String finalUsername = username;

        return userRepository.findByUsername(username)
                .orElseGet(() -> {
                    // Auto-sync: tạo user mới nếu chưa có trong DB (vd: Google login)
                    log.info("Auto-sync user '{}' vào DB từ JWT token.", finalUsername);
                    User newUser = new User();
                    newUser.setUsername(finalUsername);
                    newUser.setEmail(jwt.getClaimAsString("email"));

                    String fullName = jwt.getClaimAsString("name");
                    newUser.setFullName(fullName != null ? fullName : finalUsername);

                    // Placeholder password cho OAuth2 user
                    newUser.setPassword("OAUTH2_USER_NO_PASSWORD");

                    // Xác định role từ Keycloak token
                    java.util.Map<String, Object> realmAccess = jwt.getClaim("realm_access");
                    String role = "USER";
                    if (realmAccess != null && realmAccess.get("roles") instanceof java.util.Collection<?> roles) {
                        if (roles.contains("ADMIN")) role = "ADMIN";
                    }
                    newUser.setRole(role);

                    return userRepository.save(newUser);
                });
    }
}
