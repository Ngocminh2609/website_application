package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.UserProductView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProductViewRepository extends JpaRepository<UserProductView, Long> {
    
    // Tìm vết xem sản phẩm cụ thể của người dùng
    Optional<UserProductView> findByUserAndProduct(User user, Product product);
    
    // Lấy danh sách sản phẩm đã xem gần nhất của người dùng
    @Query("SELECT v.product FROM UserProductView v WHERE v.user = :user ORDER BY v.lastViewedAt DESC")
    List<Product> findRecentlyViewedProductsByUser(@Param("user") User user, Pageable pageable);
    
    // Lấy các danh mục mà người dùng xem nhiều nhất
    @Query("SELECT p.category.name FROM UserProductView v JOIN v.product p WHERE v.user = :user GROUP BY p.category.name ORDER BY SUM(v.viewCount) DESC")
    List<String> findTopInterestedCategoriesByUser(@Param("user") User user, Pageable pageable);
}
