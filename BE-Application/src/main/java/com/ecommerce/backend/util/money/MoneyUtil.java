package com.ecommerce.backend.util.money;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Tiện ích tiền tệ / phần trăm dùng chung (đơn hàng, coupon, VNPay).
 */
public final class MoneyUtil {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    private MoneyUtil() {
    }

    /** Không cho phép số âm — clamp về 0. */
    public static BigDecimal clampNonNegative(BigDecimal amount) {
        if (amount == null) {
            return BigDecimal.ZERO;
        }
        return amount.max(BigDecimal.ZERO);
    }

    /** Đổi đơn vị chính (VND) sang đơn vị nhỏest VNPay (×100). */
    public static long toMinorUnits(BigDecimal amount) {
        return amount.multiply(HUNDRED).longValue();
    }

    /** Đổi từ đơn vị nhỏest VNPay về VND (÷100). */
    public static BigDecimal fromMinorUnits(String minorAmount) {
        return new BigDecimal(minorAmount).divide(HUNDRED, RoundingMode.HALF_UP);
    }

    /** Tính percent% của amount, làm tròn HALF_UP về số nguyên. */
    public static BigDecimal percentOf(BigDecimal amount, BigDecimal percent) {
        return amount.multiply(percent).divide(HUNDRED, 0, RoundingMode.HALF_UP);
    }

    /** Giá sau khi giảm percent% (original - percentOf). */
    public static BigDecimal priceAfterPercentOff(BigDecimal originalPrice, BigDecimal percent) {
        return originalPrice.subtract(percentOf(originalPrice, percent));
    }
}
