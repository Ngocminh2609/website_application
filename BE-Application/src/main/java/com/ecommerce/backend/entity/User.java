package com.ecommerce.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import static com.ecommerce.backend.constant.entity.UserConstants.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User implements UserDetails {
    @java.io.Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @NotBlank(message = ERROR_USERNAME_REQUIRED)
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank(message = ERROR_PASSWORD_REQUIRED)
    @Size(min = PASSWORD_MIN_LENGTH, message = ERROR_PASSWORD_SIZE)
    @JsonIgnore // Không bao giờ gửi mật khẩu về phía hiển thị (Frontend) để đảm bảo an toàn
    private String password;

    @Email(message = ERROR_EMAIL_INVALID)
    @Column(unique = true)
    private String email;

    private String fullName;

    private String avatarUrl;

    private String phone;

    private String role; // Mặc định là 'USER'

    private String themePreference = DEFAULT_THEME; // Mặc định là giao diện sáng

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        // Chỉ gán createdAt khi tạo mới
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        // Gán updatedAt khi có cập nhật
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(ROLE_PREFIX + role));
    }


}
