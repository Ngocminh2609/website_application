package com.ecommerce.backend.security;

import lombok.RequiredArgsConstructor;
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

import static com.ecommerce.backend.constant.domain.RoleConstants.ROLE_ADMIN;

/**
 * Cấu hình bảo mật chính (FilterChain).
 * Kết hợp CORS, Keycloak Resource Server và phân quyền Endpoint chi tiết cho USER/ADMIN.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtUserResolver jwtUserResolver;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/files/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/banners").permitAll()
                        .requestMatchers("/api/banners/admin", "/api/banners/admin/**").hasRole(ROLE_ADMIN)

                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole(ROLE_ADMIN)

                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole(ROLE_ADMIN)

                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/reviews/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/coupons/validate").authenticated()
                        .requestMatchers("/api/coupons/admin", "/api/coupons/admin/**").hasRole(ROLE_ADMIN)

                        .requestMatchers("/api/notifications/broadcast").hasRole(ROLE_ADMIN)
                        .requestMatchers("/api/admin/**").hasRole(ROLE_ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/chat/ai").permitAll()
                        .requestMatchers("/api/chat/**").authenticated()

                        .requestMatchers("/ws-chat/**").permitAll()

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
            jwtUserResolver.syncUserQuietly(jwt);
            return token;
        };
    }
}
