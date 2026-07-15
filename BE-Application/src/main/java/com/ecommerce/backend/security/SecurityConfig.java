package com.ecommerce.backend.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.entity.User;

import java.util.Collection;

import static com.ecommerce.backend.constant.security.SecurityConfigConstants.*;

/**
 * Cấu hình bảo mật chính (FilterChain).
 * Kết hợp CORS, Keycloak Resource Server và phân quyền Endpoint chi tiết cho USER/ADMIN.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    // Inject bean tường minh từ WebConfig — đảm bảo Spring Security
    // dùng đúng CORS config, không tự sinh ra config mới
    private final CorsConfigurationSource corsConfigurationSource;
    private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Dùng CorsConfigurationSource bean từ WebConfig — tránh xung đột wildcard
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Cho phép mọi người truy cập Auth và xem dữ liệu (GET)
                        .requestMatchers("/api/auth/**").permitAll()
                        // Cho phep browser lay anh qua proxy ma khong can xac thuc
                        .requestMatchers(HttpMethod.GET, "/api/files/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/banners").permitAll()
                        .requestMatchers("/api/banners/admin", "/api/banners/admin/**").hasRole("ADMIN")

                        // Chỉ ADMIN mới có quyền thay đổi dữ liệu (POST, PUT, DELETE)
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")

                        // Review: ai cũng có thể đọc, phải đăng nhập mới được viết/xóa
                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/reviews/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").authenticated()

                        // Coupon: validate cần đăng nhập, các endpoint admin cần ADMIN role
                        .requestMatchers(HttpMethod.GET, "/api/coupons/validate").authenticated()
                        .requestMatchers("/api/coupons/admin", "/api/coupons/admin/**").hasRole("ADMIN")

                        .requestMatchers("/api/notifications/broadcast").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/chat/**").authenticated()

                        // Cho phép WebSocket
                        .requestMatchers("/ws-chat/**").permitAll()

                        // Các yêu cầu khác yêu cầu đăng nhập cơ bản
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(keycloakJwtConverter()))
                );

        return http.build();
    }

    private Converter<Jwt, ? extends AbstractAuthenticationToken> keycloakJwtConverter() {
        JwtAuthenticationConverter delegate = new JwtAuthenticationConverter();
        delegate.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());

        return jwt -> {
            AbstractAuthenticationToken token = delegate.convert(jwt);
            syncUser(jwt);
            return token;
        };
    }

    private void syncUser(Jwt jwt) {
        String username = jwt.getClaimAsString(CLAIM_PREFERRED_USERNAME);
        if (username == null) {
            username = jwt.getClaimAsString(CLAIM_SUB);
        }
        if (username != null) {
            try {
                if (!userRepository.existsByUsername(username)) {
                    User user = new User();
                    user.setUsername(username);
                    user.setEmail(jwt.getClaimAsString(CLAIM_EMAIL));

                    String fullName = jwt.getClaimAsString(CLAIM_NAME);
                    if (fullName == null) {
                        fullName = username;
                    }
                    user.setFullName(fullName);

                    // Mật khẩu placeholder cho tài khoản OAuth2 (JPA yêu cầu @NotBlank)
                    user.setPassword(passwordEncoder().encode(PLACEHOLDER_PASSWORD_PREFIX + java.util.UUID.randomUUID()));

                    // Xác định vai trò từ Keycloak token
                    java.util.Map<String, Object> realmAccess = jwt.getClaim(CLAIM_REALM_ACCESS);
                    String role = ROLE_USER;
                    if (realmAccess != null && realmAccess.get(CLAIM_ROLES) instanceof Collection<?> roles) {
                        if (roles.contains(ROLE_ADMIN)) {
                            role = ROLE_ADMIN;
                        }
                    }
                    user.setRole(role);
                    userRepository.save(user);
                }
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                // Trùng lặp do request đồng thời - bỏ qua vì user đã được tạo ở thread khác
                log.warn(LOG_USER_DUPLICATE, username);
            } catch (Exception e) {
                log.error(LOG_SYNC_ERROR, e);
            }
        }
    }

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }
}
