package com.ecommerce.backend.constant.dto;

/**
 * Hằng số cấu hình ProductRequest DTO.
 */
public final class ProductRequestConstants {

    private ProductRequestConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Validation Rules
    public static final int PRICE_MIN = 0;
    public static final int ORIGINAL_PRICE_MIN = 0;
    public static final int DISCOUNT_PERCENT_MIN = 0;
    public static final int STOCK_QUANTITY_MIN = 0;

    // Validation Messages
    public static final String ERROR_NAME_REQUIRED = "Tên sản phẩm không được để trống";
    public static final String ERROR_PRICE_MIN = "Giá sản phẩm phải lớn hơn hoặc bằng 0";
    public static final String ERROR_ORIGINAL_PRICE_REQUIRED = "Giá gốc không được để trống";
    public static final String ERROR_ORIGINAL_PRICE_MIN = "Giá gốc không được âm";
    public static final String ERROR_DISCOUNT_PERCENT_MIN = "Phần trăm giảm không được âm";
    public static final String ERROR_STOCK_QUANTITY_MIN = "Số lượng kho không được âm";
    public static final String ERROR_CATEGORY_REQUIRED = "Danh mục không được để trống";
}
