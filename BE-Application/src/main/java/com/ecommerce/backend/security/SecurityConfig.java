package com.ecommerce.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Cấu hình bảo mật chính (FilterChain).
 * Kết hợp CORS, JWT Filter và phân quyền Endpoint chi tiết cho USER/ADMIN.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
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
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
