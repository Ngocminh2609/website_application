package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ChangePasswordRequest;
import com.ecommerce.backend.dto.UpdateProfileRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.JwtUserResolver;
import com.ecommerce.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUserResolver jwtUserResolver;

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile() {
        User user = jwtUserResolver.getCurrentUser();
        return ResponseEntity.ok(userService.getProfile(user.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMyProfile(@RequestBody UpdateProfileRequest request) {
        User user = jwtUserResolver.getCurrentUser();
        return ResponseEntity.ok(userService.updateProfile(user.getUsername(), request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody ChangePasswordRequest request) {
        User user = jwtUserResolver.getCurrentUser();
        userService.changePassword(user.getUsername(), request);
        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
    }

    @PutMapping("/me/theme")
    public ResponseEntity<Map<String, String>> updateTheme(@RequestBody Map<String, String> request) {
        User user = jwtUserResolver.getCurrentUser();
        userService.updateTheme(user.getUsername(), request.get("theme"));
        return ResponseEntity.ok(Map.of("message", "Cập nhật giao diện thành công"));
    }
}
