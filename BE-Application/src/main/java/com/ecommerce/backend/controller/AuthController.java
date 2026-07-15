package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.KeycloakAdminService;
import com.ecommerce.backend.util.http.ResponseMessageUtil;
import com.ecommerce.backend.util.text.StringUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import static com.ecommerce.backend.constant.controller.AuthConstants.*;

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
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException(ERROR_USERNAME_EXISTS);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException(ERROR_EMAIL_EXISTS);
        }

        try {
            keycloakAdminService.createUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getFullName(),
                    request.getPassword()
            );

            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setFullName(StringUtil.defaultIfBlank(request.getFullName(), request.getUsername()));
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(DEFAULT_USER_ROLE);
            userRepository.save(user);

            log.info("Đăng ký thành công cho user '{}'", request.getUsername());
            return ResponseEntity.ok(ResponseMessageUtil.message(SUCCESS_REGISTER));
        } catch (BadRequestException e) {
            throw e;
        } catch (RuntimeException e) {
            log.error("Lỗi đăng ký user '{}': {}", request.getUsername(), e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }
}
