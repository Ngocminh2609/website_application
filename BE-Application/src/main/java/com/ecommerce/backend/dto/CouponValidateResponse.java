package com.ecommerce.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Kết quả trả về sau khi áp dụng coupon thành công.
 * Tách ra DTO riêng để FE có đủ thông tin hiển thị chi tiết số tiền giảm.
 */
@Getter
@Setter
public class CouponValidateResponse {
    private String code;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;   // Số tiền thực tế được giảm theo đơn hiện tại
    private BigDecimal maxDiscountAmount; // Giới hạn giảm tối đa
    private BigDecimal finalAmount;      // Số tiền thực tế phải thanh toán
    private String message;

    public CouponValidateResponse(String code, String discountType, BigDecimal discountValue,
                                   BigDecimal discountAmount, BigDecimal maxDiscountAmount,
                                   BigDecimal finalAmount, String message) {
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.discountAmount = discountAmount;
        this.maxDiscountAmount = maxDiscountAmount;
        this.finalAmount = finalAmount;
        this.message = message;
    }
}
