package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm kiếm người dùng theo tên đăng nhập để phục vụ quá trình xác thực
    Optional<User> findByUsername(String username);
    
    // Kiểm tra sự tồn tại của email để tránh đăng ký trùng lặp
    boolean existsByEmail(String email);
    
    // Kiểm tra sự tồn tại của tên đăng nhập
    boolean existsByUsername(String username);
}
