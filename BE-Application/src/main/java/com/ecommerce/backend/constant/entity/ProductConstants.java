package com.ecommerce.backend.constant.entity;

/**
 * Hằng số cấu hình Product Entity.
 */
public final class ProductConstants {

    private ProductConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Validation Rules
    public static final int PRICE_MIN = 0;
    public static final int STOCK_QUANTITY_MIN = 0;

    // Validation Messages
    public static final String ERROR_NAME_REQUIRED = "Tên sản phẩm không được để trống";
    public static final String ERROR_PRICE_REQUIRED = "Giá sản phẩm không được để trống";
    public static final String ERROR_PRICE_MIN = "Giá sản phẩm phải lớn hơn hoặc bằng 0";
    public static final String ERROR_STOCK_QUANTITY_MIN = "Số lượng kho không được âm";
}
