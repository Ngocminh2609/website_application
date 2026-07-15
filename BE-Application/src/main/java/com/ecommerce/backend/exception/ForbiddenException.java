package com.ecommerce.backend.exception;

/**
 * Không đủ quyền truy cập tài nguyên — map sang HTTP 403.
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }
}
