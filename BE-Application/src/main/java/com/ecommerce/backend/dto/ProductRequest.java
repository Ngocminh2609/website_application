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

    @NotNull(message = "Giá sản phẩm không được để trống")
    @Min(value = 0, message = "Giá sản phẩm phải lớn hơn hoặc bằng 0")
    private BigDecimal price;

    @Min(value = 0, message = "Số lượng kho không được âm")
    private Integer stockQuantity;

    private String imageUrl;

    private String moreImages;

    private String brand;

    private String specifications;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;
}
