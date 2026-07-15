package com.ecommerce.backend.util.text;

/**
 * Tiện ích xử lý chuỗi null-safe dùng chung toàn ứng dụng.
 */
public final class StringUtil {

    private StringUtil() {
    }

    public static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    public static boolean hasText(String value) {
        return !isBlank(value);
    }

    public static String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    /**
     * Trả về {@code value} nếu có text; ngược lại trả về {@code fallback}.
     */
    public static String defaultIfBlank(String value, String fallback) {
        return hasText(value) ? value : fallback;
    }
}
