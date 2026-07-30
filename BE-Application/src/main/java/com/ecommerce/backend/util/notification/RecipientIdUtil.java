package com.ecommerce.backend.util.notification;

import static com.ecommerce.backend.constant.domain.RecipientConstants.RECIPIENT_ADMIN;
import static com.ecommerce.backend.constant.domain.RecipientConstants.RECIPIENT_USER_PREFIX;

/**
 * Tiện ích tạo recipientId cho hệ thống thông báo.
 */
public final class RecipientIdUtil {

    private RecipientIdUtil() {
    }

    public static String forUser(Long userId) {
        return RECIPIENT_USER_PREFIX + userId;
    }

    /**
     * Admin dùng id cố định; user thường dùng prefix + id.
     */
    public static String forUserOrAdmin(Long userId, String role, String adminRole) {
        if (adminRole != null && adminRole.equals(role)) {
            return RECIPIENT_ADMIN;
        }
        return forUser(userId);
    }
}
