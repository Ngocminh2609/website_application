package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    // Tìm coupon theo code (không phân biệt hoa thường) để người dùng nhập linh hoạt
    Optional<Coupon> findByCodeIgnoreCase(String code);
}
