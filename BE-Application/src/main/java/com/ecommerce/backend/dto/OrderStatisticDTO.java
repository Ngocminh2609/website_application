package com.ecommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatisticDTO {
    private String label;
    private java.math.BigDecimal revenue;
    private Long orderCount;
}
