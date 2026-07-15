package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ChangePasswordRequest;
import com.ecommerce.backend.dto.UpdateProfileRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.util.persistence.EntityLookupUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_USER_NOT_FOUND;
import static com.ecommerce.backend.constant.service.UserServiceConstants.ERROR_WRONG_CURRENT_PASSWORD;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getProfile(String username) {
        return EntityLookupUtil.require(userRepository.findByUsername(username), ERROR_USER_NOT_FOUND);
    }

    public User updateProfile(String username, UpdateProfileRequest request) {
        User user = getProfile(username);

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        return userRepository.save(user);
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = getProfile(username);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException(ERROR_WRONG_CURRENT_PASSWORD);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void updateTheme(String username, String theme) {
        User user = getProfile(username);
        user.setThemePreference(theme);
        userRepository.save(user);
    }
}
