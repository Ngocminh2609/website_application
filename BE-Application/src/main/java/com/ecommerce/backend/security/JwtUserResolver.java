package com.ecommerce.backend.security;

import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.util.security.JwtClaimUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.UUID;

import static com.ecommerce.backend.constant.security.JwtUserResolverConstants.*;
import static com.ecommerce.backend.constant.security.SecurityConfigConstants.LOG_SYNC_ERROR;
import static com.ecommerce.backend.constant.security.SecurityConfigConstants.LOG_USER_DUPLICATE;
import static com.ecommerce.backend.constant.security.SecurityConfigConstants.PLACEHOLDER_PASSWORD_PREFIX;

/**
 * Resolve User từ JWT trong SecurityContext, đồng thời sync user OAuth2 vào DB.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUserResolver {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Lấy User hiện tại; nếu chưa có trong DB thì auto-sync từ JWT.
     */
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof Jwt jwt)) {
            throw new RuntimeException(ERROR_AUTH_MISSING);
        }

        return ensureUserSynced(jwt);
    }

    /**
     * Đồng bộ user từ JWT vào DB nếu chưa tồn tại.
     * Dùng chung bởi SecurityFilterChain và getCurrentUser().
     */
    public User ensureUserSynced(Jwt jwt) {
        String username = JwtClaimUtil.resolveUsername(jwt);
        if (username == null) {
            throw new RuntimeException(ERROR_AUTH_MISSING);
        }

        return userRepository.findByUsername(username)
                .orElseGet(() -> createFromJwt(jwt, username));
    }

    /**
     * Best-effort sync khi authenticate (không ném lỗi ra ngoài filter chain).
     */
    public void syncUserQuietly(Jwt jwt) {
        try {
            String username = JwtClaimUtil.resolveUsername(jwt);
            if (username == null) {
                return;
            }
            if (!userRepository.existsByUsername(username)) {
                createFromJwt(jwt, username);
            }
        } catch (DataIntegrityViolationException e) {
            String username = JwtClaimUtil.resolveUsername(jwt);
            log.warn(LOG_USER_DUPLICATE, username);
        } catch (Exception e) {
            log.error(LOG_SYNC_ERROR, e);
        }
    }

    private User createFromJwt(Jwt jwt, String username) {
        log.info(LOG_AUTO_SYNC, username);

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(JwtClaimUtil.resolveEmail(jwt));
        newUser.setFullName(JwtClaimUtil.resolveFullName(jwt, username));
        newUser.setPassword(passwordEncoder.encode(PLACEHOLDER_PASSWORD_PREFIX + UUID.randomUUID()));
        newUser.setRole(JwtClaimUtil.resolveAppRole(jwt));

        try {
            return userRepository.save(newUser);
        } catch (DataIntegrityViolationException e) {
            log.warn(LOG_CONCURRENT_CREATE, username);
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException(ERROR_USER_SYNC_FAILED, e));
        }
    }
}
