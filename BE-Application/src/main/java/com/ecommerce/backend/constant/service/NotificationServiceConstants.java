package com.ecommerce.backend.constant.service;

/**
 * Hằng số cấu hình NotificationService.
 */
public final class NotificationServiceConstants {

    private NotificationServiceConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // WebSocket Destination
    public static final String TOPIC_NOTIFICATION_PREFIX = "/topic/notifications/";

    // Recipient Identifiers
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String RECIPIENT_ADMIN = "admin";
    public static final String RECIPIENT_USER_PREFIX = "user-";
}
