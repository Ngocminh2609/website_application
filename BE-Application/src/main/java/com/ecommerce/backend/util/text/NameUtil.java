package com.ecommerce.backend.util.text;

/**
 * Tiện ích xử lý họ tên (tách first/last, fallback).
 */
public final class NameUtil {

    private static final String DELIMITER = " ";
    private static final String EMPTY_LAST = "";

    private NameUtil() {
    }

    /**
     * Tách fullName thành firstName / lastName.
     * Nếu fullName trống thì firstName = fallbackFirst, lastName = "".
     */
    public static NameParts splitFirstLast(String fullName, String fallbackFirst) {
        if (StringUtil.isBlank(fullName)) {
            return new NameParts(fallbackFirst, EMPTY_LAST);
        }
        String[] parts = fullName.trim().split(DELIMITER, 2);
        String first = parts[0];
        String last = parts.length > 1 ? parts[1] : EMPTY_LAST;
        return new NameParts(first, last);
    }

    public record NameParts(String firstName, String lastName) {
    }
}
