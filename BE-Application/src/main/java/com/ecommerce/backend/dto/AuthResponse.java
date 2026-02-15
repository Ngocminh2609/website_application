package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private User user;
    private String token; // Hiện tại có thể là chuỗi giả lập, sau này sẽ nâng cấp lên JWT
}
