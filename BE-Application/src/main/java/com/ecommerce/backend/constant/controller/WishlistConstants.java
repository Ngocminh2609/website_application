package com.ecommerce.backend.constant.controller;

/**
 * Hằng số cấu hình WishlistController.
 */
public final class WishlistConstants {

    private WishlistConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Response Messages
    public static final String SUCCESS_ADDED = "Đã thêm vào danh sách yêu thích";
    public static final String SUCCESS_REMOVED = "Đã xóa khỏi danh sách yêu thích";

    // JSON Keys
    public static final String RESPONSE_KEY_MESSAGE = "message";
    public static final String RESPONSE_KEY_IS_IN_WISHLIST = "isInWishlist";
}
