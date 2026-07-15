package com.ecommerce.backend.constant.dto;

/**
 * Hằng số cấu hình ReviewRequest DTO.
 */
public final class ReviewRequestConstants {

    private ReviewRequestConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Validation Rules
    public static final int RATING_MIN = 1;
    public static final int RATING_MAX = 5;

    // Validation Messages
    public static final String ERROR_RATING_REQUIRED = "Số sao không được để trống";
    public static final String ERROR_RATING_MIN = "Số sao tối thiểu là 1";
    public static final String ERROR_RATING_MAX = "Số sao tối đa là 5";
}
