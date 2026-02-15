package com.ecommerce.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO nhận Token ID từ Google gửi về từ Frontend.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GoogleLoginRequest {
    @NotBlank(message = "Google Token không được để trống")
    private String token;
}
