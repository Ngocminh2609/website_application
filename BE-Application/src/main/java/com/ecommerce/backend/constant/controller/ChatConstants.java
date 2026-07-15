package com.ecommerce.backend.constant.controller;

/**
 * Hằng số cấu hình ChatController.
 */
public final class ChatConstants {

    private ChatConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // WebSocket Destination paths
    public static final String TOPIC_USER_PREFIX = "/topic/user/";
    public static final String TOPIC_ADMIN = "/topic/admin";

    // Session attribute keys
    public static final String SESSION_KEY_USERNAME = "username";
    public static final String SESSION_KEY_SENDER_ID = "senderId";
    public static final String SESSION_KEY_EMAIL = "email";
}
