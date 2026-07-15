package com.ecommerce.backend.exception;

/**
 * Lỗi nghiệp vụ / request không hợp lệ — map sang HTTP 400.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
