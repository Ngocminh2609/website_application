package com.ecommerce.backend.util.persistence;

import com.ecommerce.backend.exception.ResourceNotFoundException;

import java.util.Optional;

/**
 * Tiện ích lấy entity bắt buộc — không tìm thấy thì ném {@link ResourceNotFoundException}.
 */
public final class EntityLookupUtil {

    private EntityLookupUtil() {
    }

    // Optional làm tham số là chủ đích: cho phép gọi trực tiếp repository.findById(...).orElseThrow(...) rút gọn còn 1 dòng.
    @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
    public static <T> T require(Optional<T> value, String message) {
        return value.orElseThrow(() -> new ResourceNotFoundException(message));
    }
}
