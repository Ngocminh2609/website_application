package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsActiveTrue();
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    List<Product> findByBrandAndIsActiveTrue(String brand);
    List<Product> findByIsBestSellerTrueAndIsActiveTrue();
    List<Product> findByDiscountPriceNotNullAndIsActiveTrue();
    List<Product> findByBrandAndCategoryIdAndIsActiveTrue(String brand, Long categoryId);
    
    // Hỗ trợ gợi ý cá nhân hóa
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p WHERE p.category.name IN :names AND p.isActive = true")
    List<Product> findByCategoryNameIn(@org.springframework.data.repository.query.Param("names") List<String> names, org.springframework.data.domain.Pageable pageable);
    
    List<Product> findByIsBestSellerTrue(org.springframework.data.domain.Pageable pageable);

    // --- ADMIN (QUẢN TRỊ) ---
    List<Product> findAllByOrderByCreatedAtDesc();
}
