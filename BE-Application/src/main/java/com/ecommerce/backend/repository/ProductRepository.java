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

    // --- ADMIN (QUẢN TRỊ) ---
    List<Product> findAllByOrderByCreatedAtDesc();
}
