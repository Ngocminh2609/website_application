package com.ecommerce.backend.constant.service;

/**
 * Hằng số cấu hình ProductViewerService.
 */
public final class ProductViewerServiceConstants {

    private ProductViewerServiceConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // WebSocket Destination
    public static final String TOPIC_PRODUCT_PREFIX = "/topic/product/";
    public static final String TOPIC_PRODUCT_SUFFIX = "/viewers";

    // Broadcast Payload Keys
    public static final String KEY_PRODUCT_ID = "productId";
    public static final String KEY_VIEWER_COUNT = "viewerCount";

    // Log Messages
    public static final String LOG_VIEWER_JOIN = "[VIEWER-SYSTEM] +++ Người mới vào xem SP {}. Tổng thực tế: {} (Session: {})";
    public static final String LOG_VIEWER_LEAVE = "[VIEWER-SYSTEM] --- Người rời khỏi SP {}. Còn lại: {} (Session: {})";
}
