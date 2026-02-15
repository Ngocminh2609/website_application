package com.ecommerce.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BackendApplication {

    public static void main(String[] args) {
        // Khởi chạy ứng dụng Spring Boot
        // Việc tách biệt hàm main giúp dễ dàng quản lý vòng đời khởi tạo của toàn bộ hệ thống
        SpringApplication.run(BackendApplication.class, args);
    }

}
