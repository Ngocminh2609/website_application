package com.ecommerce.backend.exception;

/**
 * Tài nguyên không tồn tại — map sang HTTP 404.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
