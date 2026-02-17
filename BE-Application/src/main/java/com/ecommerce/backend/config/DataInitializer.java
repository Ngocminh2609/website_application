package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            // Mã hóa mật khẩu chuẩn BCrypt cho 'password123'
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setEmail("admin@technova.com");
            admin.setFullName("Quản Trị Hệ Thống");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println(">>> Đã khởi tạo tài khoản Admin mặc định: admin / password123");
        } else {
            // Nếu đã tồn tại nhưng bạn vẫn không đăng nhập được, hãy ép lại mật khẩu mới
            User existingAdmin = userRepository.findByUsername("admin").get();
            existingAdmin.setPassword(passwordEncoder.encode("password123"));
            existingAdmin.setRole("ADMIN");
            userRepository.save(existingAdmin);
            System.out.println(">>> Đã cập nhật lại mật khẩu mã hóa cho Admin");
        }
    }
}
