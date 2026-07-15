package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CouponValidateResponse;
import com.ecommerce.backend.entity.Coupon;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.repository.CouponRepository;
import com.ecommerce.backend.util.money.MoneyUtil;
import com.ecommerce.backend.util.persistence.EntityLookupUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static com.ecommerce.backend.constant.service.CouponServiceConstants.*;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponValidateResponse validateCoupon(String code, BigDecimal orderAmount) {
        Coupon coupon = EntityLookupUtil.require(
                couponRepository.findByCodeIgnoreCase(code),
                ERROR_COUPON_NOT_FOUND
        );

        if (coupon.getIsActive() == null || !coupon.getIsActive()) {
            throw new BadRequestException(ERROR_COUPON_INACTIVE);
        }

        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException(ERROR_COUPON_EXPIRED);
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new BadRequestException(ERROR_COUPON_LIMIT_REACHED);
        }

        if (orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException(
                    ERROR_MIN_ORDER_PREFIX + coupon.getMinOrderAmount().toPlainString() + ERROR_MIN_ORDER_SUFFIX
            );
        }

        BigDecimal discountAmount = calculateDiscountAmount(coupon, orderAmount);
        BigDecimal finalAmount = MoneyUtil.clampNonNegative(orderAmount.subtract(discountAmount));

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
        Coupon coupon = EntityLookupUtil.require(couponRepository.findById(id), ERROR_COUPON_ID_NOT_FOUND);
        coupon.setIsActive(active);
        couponRepository.save(coupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }

    private BigDecimal calculateDiscountAmount(Coupon coupon, BigDecimal orderAmount) {
        BigDecimal discountAmount;

        if (DISCOUNT_TYPE_PERCENT.equals(coupon.getDiscountType())) {
            discountAmount = MoneyUtil.percentOf(orderAmount, coupon.getDiscountValue());
            if (coupon.getMaxDiscountAmount() != null) {
                discountAmount = discountAmount.min(coupon.getMaxDiscountAmount());
            }
        } else {
            discountAmount = coupon.getDiscountValue().min(orderAmount);
        }

        return discountAmount;
    }
}
