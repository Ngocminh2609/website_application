package com.ecommerce.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Cấu hình Web tập trung cho toàn bộ ứng dụng.
 * Việc thiết lập CORS toàn cục giúp đảm bảo mọi Endpoint (bao gồm cả các trang lỗi) 
 * đều có thể giao tiếp mượt mà với Frontend TypeScript.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Áp dụng cho toàn bộ các API bắt đầu bằng /api/
        registry.addMapping("/api/**")
                // Trong thực tế nên giới hạn Domain cụ thể (ví dụ: http://localhost:5173)
                // Hiện tại đặt "*" để thuận tiện cho việc phát triển Local
                .allowedOrigins("*")
                // Cho phép đầy đủ các phương thức HTTP cần thiết
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                // Cho phép các Headers phổ biến
                .allowedHeaders("*")
                // Không yêu cầu gửi Credentials (Cookies/Auth Headers) trong giai đoạn này
                .allowCredentials(false)
                // Cache kết quả Preflight request trong 1 giờ để tăng hiệu năng
                .maxAge(3600);
    }
}
