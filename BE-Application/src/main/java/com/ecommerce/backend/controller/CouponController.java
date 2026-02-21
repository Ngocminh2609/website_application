package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CouponValidateResponse;
import com.ecommerce.backend.entity.Coupon;
import com.ecommerce.backend.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    /**
     * User validate mã giảm giá trước khi thanh toán.
     * Nhận thêm orderAmount để tính số tiền giảm thực tế ngay tại thời điểm kiểm tra.
     */
    @GetMapping("/validate")
    public ResponseEntity<CouponValidateResponse> validate(
            @RequestParam String code,
            @RequestParam BigDecimal orderAmount) {
        return ResponseEntity.ok(couponService.validateCoupon(code, orderAmount));
    }

    /**
     * ADMIN: Lấy danh sách toàn bộ coupon.
     */
    @GetMapping("/admin")
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    /**
     * ADMIN: Tạo mới coupon.
     */
    @PostMapping("/admin")
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponService.createCoupon(coupon));
    }

    /**
     * ADMIN: Bật/tắt trạng thái coupon thay vì xóa để giữ lại lịch sử sử dụng.
     */
    @PutMapping("/admin/{id}/toggle")
    public ResponseEntity<String> toggleStatus(@PathVariable Long id) {
        couponService.toggleCouponStatus(id);
        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }

    /**
     * ADMIN: Xóa coupon.
     */
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok("Xóa mã giảm giá thành công");
    }
}
