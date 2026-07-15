package com.ecommerce.backend.constant.service;

/**
 * Hằng số cấu hình ReviewService.
 */
public final class ReviewServiceConstants {

    private ReviewServiceConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Realm Role
    public static final String ROLE_ADMIN = "ADMIN";

    // Exception Messages
    public static final String ERROR_ALREADY_REVIEWED = "Bạn đã đánh giá sản phẩm này rồi";
    public static final String ERROR_PRODUCT_NOT_FOUND = "Sản phẩm không tồn tại";
    public static final String ERROR_USER_NOT_FOUND = "Người dùng không tồn tại";
    public static final String ERROR_REVIEW_NOT_FOUND = "Review không tồn tại";
    public static final String ERROR_NO_PERMISSION_DELETE = "Bạn không có quyền xóa review này";
}
