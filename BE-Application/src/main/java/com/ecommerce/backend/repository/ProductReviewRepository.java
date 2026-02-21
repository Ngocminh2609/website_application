package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    // Chỉ lấy review đã được duyệt để hiển thị ra ngoài, tránh lộ nội dung chưa kiểm duyệt
    List<ProductReview> findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(Long productId);

    // Lấy toàn bộ danh sách cho Admin quản lý
    List<ProductReview> findAllByOrderByCreatedAtDesc();

    // Kiểm tra user đã review sản phẩm này chưa, tránh duplicate review
    Optional<ProductReview> findByProductIdAndUserId(Long productId, Long userId);

    // Tính rating trung bình từ các review đã duyệt để cập nhật lại trường rating của Product
    @Query("SELECT AVG(r.rating) FROM ProductReview r WHERE r.product.id = :productId AND r.isApproved = true")
    Double calculateAverageRating(@Param("productId") Long productId);

    // Đếm số lượng review đã duyệt để cập nhật lại reviewCount của Product
    long countByProductIdAndIsApprovedTrue(Long productId);

    // Kiểm tra user đã mua sản phẩm này chưa (xác nhận đơn hàng PAID) để cấp nhãn verified
    @Query("""
            SELECT COUNT(oi) > 0 FROM OrderItem oi
            WHERE oi.product.id = :productId
            AND oi.order.user.id = :userId
            AND oi.order.status IN ('PAID', 'SHIPPING', 'DELIVERED')
            """)
    boolean hasUserPurchasedProduct(@Param("productId") Long productId, @Param("userId") Long userId);
}
