package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.AuthResponse;
import com.ecommerce.backend.dto.LoginRequest;
import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller cho các tác vụ xác thực.
 * Được bảo vệ bởi Spring Security và JWT.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        // Trả về phản hồi chứa JWT thực tế sau khi đăng ký
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // Trả về phản hồi chứa JWT thực tế sau khi kiểm tra thông tin đăng nhập
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Với Stateless JWT, phía Server chỉ cần xác nhận yêu cầu.
        // Frontend sẽ tự hủy bỏ Token trong LocalStorage.
        return ResponseEntity.ok("Đã đăng xuất thành công!");
    }
}
