package com.ecommerce.backend.constant.dto;

/**
 * Hằng số cấu hình ProductRequest DTO (chỉ phần riêng DTO).
 */
public final class ProductRequestConstants {

    private ProductRequestConstants() {
    }

    public static final int ORIGINAL_PRICE_MIN = 0;
    public static final int DISCOUNT_PERCENT_MIN = 0;

    public static final String ERROR_ORIGINAL_PRICE_REQUIRED = "Giá gốc không được để trống";
    public static final String ERROR_ORIGINAL_PRICE_MIN = "Giá gốc không được âm";
    public static final String ERROR_DISCOUNT_PERCENT_MIN = "Phần trăm giảm không được âm";
    public static final String ERROR_CATEGORY_REQUIRED = "Danh mục không được để trống";
}
