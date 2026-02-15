package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.AuthResponse;
import com.ecommerce.backend.dto.GoogleLoginRequest;
import com.ecommerce.backend.dto.LoginRequest;
import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.security.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

/**
 * Dịch vụ xử lý Auth đã được bảo mật.
 * Tích hợp mã hóa mật khẩu BCrypt, tạo JWT và đăng nhập Google.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${google.client.id}")
    private String googleClientId;

    /**
     * Xử lý đăng nhập bằng Google Token.
     */
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        try {
            NetHttpTransport transport = new NetHttpTransport();
            GsonFactory jsonFactory = new GsonFactory();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken == null) {
                throw new RuntimeException("Mã xác thực Google không hợp lệ!");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            
            // Kiểm tra email đã tồn tại trong hệ thống chưa
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
            } else {
                // Tạo người dùng mới từ thông tin Google
                user = new User();
                user.setEmail(email);
                // Tạo tên đăng nhập duy nhất dựa trên email hoặc UUID
                user.setUsername(email.split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 5));
                user.setFullName((String) payload.get("name"));
                // Mật khẩu ngẫu nhiên cho tài khoản mạng xã hội (người dùng không dùng mật khẩu này để login)
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                user.setRole("USER");
                userRepository.save(user);
            }

            String jwtToken = jwtService.generateToken(user);
            return new AuthResponse("Đăng nhập bằng Google thành công!", user, jwtToken);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi trong quá trình xác thực Google: " + e.getMessage());
        }
    }

    /**
     * Đăng ký người dùng với mật khẩu đã được băm (Hashed).
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        // Mã hóa mật khẩu trước khi lưu vào DB
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);
        
        // Sau khi đăng ký, tự động tạo Token để người dùng đăng nhập luôn
        String token = jwtService.generateToken(user);
        return new AuthResponse("Đăng ký thành công!", user, token);
    }

    /**
     * Đăng nhập sử dụng AuthenticationManager để xác thực mật khẩu.
     */
    public AuthResponse login(LoginRequest request) {
        // Xác thực người dùng
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        // Tạo JWT thực tế
        String token = jwtService.generateToken(user);
        
        return new AuthResponse("Đăng nhập thành công!", user, token);
    }
}
