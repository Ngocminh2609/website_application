package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import static com.ecommerce.backend.constant.AdminConstants.*;

/**
 * Lớp khởi tạo dữ liệu mặc định.
 * Đảm bảo hệ thống luôn có tài khoản Admin hợp lệ với mật khẩu được mã hóa chuẩn BCrypt.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Kiểm tra và khởi tạo tài khoản Admin nếu chưa có hoặc cập nhật lại mật khẩu chuẩn
        if (userRepository.findByUsername(DEFAULT_USERNAME).isEmpty()) {
            User admin = new User();
            admin.setUsername(DEFAULT_USERNAME);
            // Mã hóa mật khẩu chuẩn BCrypt
            admin.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
            admin.setEmail(DEFAULT_EMAIL);
            admin.setFullName(DEFAULT_FULL_NAME);
            admin.setRole(DEFAULT_ROLE);
            userRepository.save(admin);
            System.out.println(LOG_INITIALIZED);
        } else {
            // Nếu đã tồn tại nhưng bạn vẫn không đăng nhập được, hãy ép lại mật khẩu mới
            User existingAdmin = userRepository.findByUsername(DEFAULT_USERNAME).get();
            existingAdmin.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
            existingAdmin.setRole(DEFAULT_ROLE);
            userRepository.save(existingAdmin);
            System.out.println(LOG_UPDATED);
        }
    }
}
