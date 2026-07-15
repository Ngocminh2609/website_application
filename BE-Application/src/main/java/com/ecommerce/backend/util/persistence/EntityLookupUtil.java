package com.ecommerce.backend.util.persistence;

import com.ecommerce.backend.exception.ResourceNotFoundException;

import java.util.Optional;

/**
 * Tiện ích lấy entity bắt buộc — không tìm thấy thì ném {@link ResourceNotFoundException}.
 */
public final class EntityLookupUtil {

    private EntityLookupUtil() {
    }

    public static <T> T require(Optional<T> value, String message) {
        return value.orElseThrow(() -> new ResourceNotFoundException(message));
    }
}
