package com.ecommerce.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import static com.ecommerce.backend.constant.dto.RegisterRequestConstants.*;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = ERROR_USERNAME_REQUIRED)
    @Size(min = USERNAME_MIN_LENGTH, max = USERNAME_MAX_LENGTH, message = ERROR_USERNAME_SIZE)
    private String username;

    @NotBlank(message = ERROR_PASSWORD_REQUIRED)
    @Size(min = PASSWORD_MIN_LENGTH, message = ERROR_PASSWORD_SIZE)
    private String password;

    @NotBlank(message = ERROR_EMAIL_REQUIRED)
    @Email(message = ERROR_EMAIL_INVALID)
    private String email;

    private String fullName;
}
