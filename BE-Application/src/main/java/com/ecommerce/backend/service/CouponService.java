package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CouponValidateResponse;
import com.ecommerce.backend.entity.Coupon;
import com.ecommerce.backend.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import static com.ecommerce.backend.constant.service.CouponServiceConstants.*;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    /**
     * Validate coupon và tính số tiền giảm thực tế dựa trên tổng đơn hàng.
     * Không tăng used_count ở đây vì chỉ tăng khi đơn hàng được xác nhận thanh toán thành công.
     */
    public CouponValidateResponse validateCoupon(String code, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new RuntimeException(ERROR_COUPON_NOT_FOUND));

        // Kiểm tra trạng thái hoạt động
        if (coupon.getIsActive() == null || !coupon.getIsActive()) {
            throw new RuntimeException(ERROR_COUPON_INACTIVE);
        }

        // Kiểm tra hết hạn
        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException(ERROR_COUPON_EXPIRED);
        }

        // Kiểm tra đã dùng hết lượt chưa
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException(ERROR_COUPON_LIMIT_REACHED);
        }

        // Kiểm tra ngưỡng đơn hàng tối thiểu
        if (orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new RuntimeException(
                    ERROR_MIN_ORDER_PREFIX + coupon.getMinOrderAmount().toPlainString() + ERROR_MIN_ORDER_SUFFIX
            );
        }

        BigDecimal discountAmount = calculateDiscountAmount(coupon, orderAmount);
        BigDecimal finalAmount = orderAmount.subtract(discountAmount).max(BigDecimal.ZERO);

        return new CouponValidateResponse(
                coupon.getCode(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                discountAmount,
                coupon.getMaxDiscountAmount(),
                finalAmount,
                SUCCESS_COUPON_APPLIED
        );
    }

    /**
     * Tăng used_count khi đơn hàng thanh toán thành công.
     * Phương án tách biệt validate và consume để đảm bảo không tăng lượt dùng khi thanh toán thất bại.
     */
    @Transactional
    public void consumeCoupon(String code) {
        couponRepository.findByCodeIgnoreCase(code).ifPresent(coupon -> {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        });
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Transactional
    public Coupon createCoupon(Coupon coupon) {
        coupon.setCode(coupon.getCode().toUpperCase());
        return couponRepository.save(coupon);
    }

    @Transactional
    public void updateCouponStatus(Long id, boolean active) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(ERROR_COUPON_ID_NOT_FOUND));
        coupon.setIsActive(active);
        couponRepository.save(coupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }

    /**
     * Tính số tiền giảm thực tế dựa trên loại: PERCENT hoặc FIXED.
     * Đặt trong method riêng để dễ test độc lập, tránh logic rải rộng trong validateCoupon.
     */
    private BigDecimal calculateDiscountAmount(Coupon coupon, BigDecimal orderAmount) {
        BigDecimal discountAmount;

        if (DISCOUNT_TYPE_PERCENT.equals(coupon.getDiscountType())) {
            discountAmount = orderAmount
                    .multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);

            // Áp dụng giới hạn giảm tối đa khi có cấu hình maxDiscountAmount
            if (coupon.getMaxDiscountAmount() != null) {
                discountAmount = discountAmount.min(coupon.getMaxDiscountAmount());
            }
        } else {
            // FIXED: giảm cố định, không vượt quá tổng đơn
            discountAmount = coupon.getDiscountValue().min(orderAmount);
        }

        return discountAmount;
    }
}
