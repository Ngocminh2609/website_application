package com.ecommerce.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

import static com.ecommerce.backend.constant.dto.ProductRequestConstants.*;

@Data
public class ProductRequest {
    @NotBlank(message = ERROR_NAME_REQUIRED)
    private String name;

    private String description;

    @Min(value = PRICE_MIN, message = ERROR_PRICE_MIN)
    private BigDecimal price;

    @NotNull(message = ERROR_ORIGINAL_PRICE_REQUIRED)
    @Min(value = ORIGINAL_PRICE_MIN, message = ERROR_ORIGINAL_PRICE_MIN)
    private BigDecimal originalPrice;

    @Min(value = DISCOUNT_PERCENT_MIN, message = ERROR_DISCOUNT_PERCENT_MIN)
    private Integer discountPercent;

    @Min(value = STOCK_QUANTITY_MIN, message = ERROR_STOCK_QUANTITY_MIN)
    private Integer stockQuantity;

    private String imageUrl;

    private String moreImages;

    private String brand;

    private String specifications;

    private boolean isBestSeller;

    private boolean isActive = true;

    @NotNull(message = ERROR_CATEGORY_REQUIRED)
    private Long categoryId;
}
