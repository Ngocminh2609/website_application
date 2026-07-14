package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.KeycloakAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller xử lý đăng ký tài khoản mới.
 * Quy trình:
 * 1. Tạo user trong Keycloak (Identity Provider)
 * 2. Đồng bộ thông tin user vào DB cục bộ (MySQL)
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final KeycloakAdminService keycloakAdminService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * POST /api/auth/register
     * Đăng ký tài khoản mới: tạo trong Keycloak + đồng bộ vào DB.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // Kiểm tra trùng lặp trong DB cục bộ trước
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Tên đăng nhập đã tồn tại trong hệ thống."));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email đã được sử dụng bởi tài khoản khác."));
        }

        try {
            // 1. Tạo user trong Keycloak (ném exception nếu thất bại)
            keycloakAdminService.createUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getFullName(),
                    request.getPassword()
            );

            // 2. Đồng bộ vào DB cục bộ
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setFullName(request.getFullName() != null ? request.getFullName() : request.getUsername());
            // Lưu hash password để tránh lỗi @NotBlank, nhưng xác thực sẽ qua Keycloak
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole("USER");
            userRepository.save(user);

            log.info("Đăng ký thành công cho user '{}'", request.getUsername());
            return ResponseEntity.ok(Map.of("message", "Đăng ký thành công! Bạn có thể đăng nhập ngay."));

        } catch (RuntimeException e) {
            log.error("Lỗi đăng ký user '{}': {}", request.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
