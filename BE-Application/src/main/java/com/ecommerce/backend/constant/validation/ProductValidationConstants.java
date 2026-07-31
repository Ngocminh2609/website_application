package com.ecommerce.backend.constant.validation;

/**
 * Quy tắc / message validation sản phẩm dùng chung cho Entity và DTO.
 */
public final class ProductValidationConstants {

    private ProductValidationConstants() {
    }

    public static final int PRICE_MIN = 0;
    public static final int STOCK_QUANTITY_MIN = 0;

    public static final String ERROR_NAME_REQUIRED = "Tên sản phẩm không được để trống";
    public static final String ERROR_PRICE_MIN = "Giá sản phẩm phải lớn hơn hoặc bằng 0";
    public static final String ERROR_STOCK_QUANTITY_MIN = "Số lượng kho không được âm";
}
