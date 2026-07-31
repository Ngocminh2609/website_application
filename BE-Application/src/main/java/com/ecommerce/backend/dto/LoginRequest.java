package com.ecommerce.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import static com.ecommerce.backend.constant.validation.AuthValidationConstants.ERROR_PASSWORD_REQUIRED;
import static com.ecommerce.backend.constant.validation.AuthValidationConstants.ERROR_USERNAME_REQUIRED;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = ERROR_USERNAME_REQUIRED)
    private String username;

    @NotBlank(message = ERROR_PASSWORD_REQUIRED)
    private String password;
}
