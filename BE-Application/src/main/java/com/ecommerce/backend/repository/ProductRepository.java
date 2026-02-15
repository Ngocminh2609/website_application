package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Tìm kiếm các sản phẩm thuộc một danh mục cụ thể
    // Spring Data JPA sẽ tự động parse tên hàm thành câu truy vấn SQL tương ứng
    List<Product> findByCategoryId(Long categoryId);

    // Tìm kiếm sản phẩm theo tên (hỗ trợ tính năng search cơ bản trên web)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Lọc sản phẩm theo Hãng
    List<Product> findByBrand(String brand);

    // Lấy sản phẩm bán chạy
    List<Product> findByIsBestSellerTrue();

    // Lấy sản phẩm đang Flash Sale (có giá giảm)
    List<Product> findByDiscountPriceNotNull();

    // Lọc theo Brand và Category đồng thời
    List<Product> findByBrandAndCategoryId(String brand, Long categoryId);
}
