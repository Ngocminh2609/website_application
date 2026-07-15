package com.ecommerce.backend.util.jdbc;

import java.math.BigDecimal;

/**
 * Tiện ích ép kiểu giá trị từ native SQL {@code Object[]} rows.
 */
public final class JdbcValueUtil {

    private JdbcValueUtil() {
    }

    public static BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal;
        }
        if (value instanceof Number) {
            return new BigDecimal(value.toString());
        }
        return BigDecimal.ZERO;
    }

    public static long toLong(Object value) {
        if (value instanceof Long longValue) {
            return longValue;
        }
        if (value instanceof Number number) {
            return number.longValue();
        }
        return 0L;
    }
}
