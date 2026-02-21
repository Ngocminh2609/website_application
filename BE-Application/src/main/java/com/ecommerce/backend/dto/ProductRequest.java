package com.ecommerce.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String description;

    @Min(value = 0, message = "Giá sản phẩm phải lớn hơn hoặc bằng 0")
    private BigDecimal price;

    @NotNull(message = "Giá gốc không được để trống")
    @Min(value = 0, message = "Giá gốc không được âm")
    private BigDecimal originalPrice;

    @Min(value = 0, message = "Phần trăm giảm không được âm")
    private Integer discountPercent;

    @Min(value = 0, message = "Số lượng kho không được âm")
    private Integer stockQuantity;

    private String imageUrl;

    private String moreImages;

    private String brand;

    private String specifications;

    private boolean isBestSeller;

    private boolean isActive = true;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;
}
