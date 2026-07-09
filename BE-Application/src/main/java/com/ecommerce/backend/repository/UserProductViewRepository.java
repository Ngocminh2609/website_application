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
    @Query(value = """
            SELECT p.* FROM products p
            JOIN user_product_views v ON p.id = v.product_id
            WHERE v.user_id = :#{#user.id}
            ORDER BY v.last_viewed_at DESC
            """, nativeQuery = true)
    List<Product> findRecentlyViewedProductsByUser(@Param("user") User user, Pageable pageable);
    
    // Lấy các danh mục mà người dùng xem nhiều nhất
    @Query(value = """
            SELECT c.name FROM user_product_views v
            JOIN products p ON v.product_id = p.id
            JOIN categories c ON p.category_id = c.id
            WHERE v.user_id = :#{#user.id}
            GROUP BY c.name
            ORDER BY SUM(v.view_count) DESC
            """, nativeQuery = true)
    List<String> findTopInterestedCategoriesByUser(@Param("user") User user, Pageable pageable);
}
