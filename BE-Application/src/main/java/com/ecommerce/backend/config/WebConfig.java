package com.ecommerce.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Cấu hình CORS tập trung cho toàn bộ ứng dụng.
 * Expose CorsConfigurationSource bean để cả Spring MVC lẫn Spring Security
 * dùng chung — tránh xung đột giữa 2 tầng CORS filter.
 *
 * Tham chiếu Spring Security 6.x best practice:
 * https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html
 */
@Configuration
public class WebConfig {

    /**
     * Danh sách origins được phép, phân cách bằng dấu phẩy.
     * Local dev default: http://localhost:5173,http://localhost:3000
     * Production: set biến môi trường CORS_ALLOWED_ORIGINS=https://yourdomain.com
     */
    @Value("${cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOriginsConfig;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Parse danh sách origins từ config — không bao giờ dùng wildcard "*"
        List<String> allowedOrigins = Arrays.asList(allowedOriginsConfig.split(","));
        config.setAllowedOrigins(allowedOrigins);

        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"
        ));

        config.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "Accept",
                "X-Requested-With", "Cache-Control"
        ));

        // Bật credentials để hỗ trợ Authorization header / cookie
        // LƯU Ý: Khi allowCredentials=true, allowedOrigins KHÔNG được chứa "*"
        config.setAllowCredentials(true);

        // Cache preflight request trong 1 giờ
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Áp dụng cho toàn bộ API và WebSocket
        source.registerCorsConfiguration("/api/**", config);
        source.registerCorsConfiguration("/ws-chat/**", config);

        return source;
    }
}
