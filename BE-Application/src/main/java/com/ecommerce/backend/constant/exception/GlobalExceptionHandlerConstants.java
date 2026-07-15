package com.ecommerce.backend.constant.exception;

/**
 * Hằng số cấu hình GlobalExceptionHandler.
 */
public final class GlobalExceptionHandlerConstants {

    private GlobalExceptionHandlerConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // JSON Keys
    public static final String RESPONSE_KEY_MESSAGE = "message";

    // Response Messages
    public static final String ERROR_BAD_CREDENTIALS = "Tên đăng nhập hoặc mật khẩu không chính xác!";
}
