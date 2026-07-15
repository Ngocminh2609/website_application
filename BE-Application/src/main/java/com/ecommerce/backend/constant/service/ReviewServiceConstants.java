package com.ecommerce.backend.constant.service;

/**
 * Hằng số cấu hình ReviewService.
 */
public final class ReviewServiceConstants {

    private ReviewServiceConstants() {
    }

    public static final String ERROR_ALREADY_REVIEWED = "Bạn đã đánh giá sản phẩm này rồi";
    public static final String ERROR_REVIEW_NOT_FOUND = "Review không tồn tại";
    public static final String ERROR_NO_PERMISSION_DELETE = "Bạn không có quyền xóa review này";
}
