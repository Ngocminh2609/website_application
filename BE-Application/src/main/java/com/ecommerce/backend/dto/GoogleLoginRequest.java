package com.ecommerce.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.ecommerce.backend.constant.dto.GoogleLoginRequestConstants.*;

/**
 * DTO nhận Token ID từ Google gửi về từ Frontend.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GoogleLoginRequest {
    @NotBlank(message = ERROR_TOKEN_REQUIRED)
    private String token;
}
