package com.ecommerce.backend.util.http;

import java.util.Map;

import static com.ecommerce.backend.constant.exception.GlobalExceptionHandlerConstants.RESPONSE_KEY_MESSAGE;

/**
 * Tạo body JSON dạng {@code {"message": "..."}} dùng chung cho API response.
 */
public final class ResponseMessageUtil {

    private ResponseMessageUtil() {
    }

    public static Map<String, String> message(String message) {
        return Map.of(RESPONSE_KEY_MESSAGE, message);
    }
}
