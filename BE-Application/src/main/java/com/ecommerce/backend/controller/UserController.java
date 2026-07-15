package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ChangePasswordRequest;
import com.ecommerce.backend.dto.UpdateProfileRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.CurrentUser;
import com.ecommerce.backend.service.UserService;
import com.ecommerce.backend.util.http.ResponseMessageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.ecommerce.backend.constant.controller.UserConstants.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@CurrentUser User user) {
        return ResponseEntity.ok(userService.getProfile(user.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMyProfile(@CurrentUser User user, @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(user.getUsername(), request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @CurrentUser User user,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(user.getUsername(), request);
        return ResponseEntity.ok(ResponseMessageUtil.message(SUCCESS_PASSWORD_CHANGE));
    }

    @PutMapping("/me/theme")
    public ResponseEntity<Map<String, String>> updateTheme(
            @CurrentUser User user,
            @RequestBody Map<String, String> request) {
        userService.updateTheme(user.getUsername(), request.get(REQUEST_KEY_THEME));
        return ResponseEntity.ok(ResponseMessageUtil.message(SUCCESS_THEME_UPDATE));
    }
}
