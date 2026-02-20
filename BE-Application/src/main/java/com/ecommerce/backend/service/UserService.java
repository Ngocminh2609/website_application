package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ChangePasswordRequest;
import com.ecommerce.backend.dto.UpdateProfileRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getProfile(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    public User updateProfile(String username, UpdateProfileRequest request) {
        User user = getProfile(username);

        // Chỉ cập nhật các field được gửi lên, giữ nguyên field null để tránh ghi đè dữ liệu không cần thiết
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        return userRepository.save(user);
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = getProfile(username);

        // Xác minh mật khẩu hiện tại trước khi cho phép đổi để ngăn chặn thay đổi trái phép
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
