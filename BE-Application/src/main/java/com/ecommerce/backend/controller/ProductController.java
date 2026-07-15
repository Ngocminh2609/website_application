package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsPublic());
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Product>> getAllProductsAdmin() {
        return ResponseEntity.ok(productService.getAllProductsAdmin());
    }

    // --- CÁC ENDPOINT CỤ THỂ PHẢI ĐƯỢC ĐỊNH NGHĨA TRƯỚC {ID} ---

    @GetMapping("/best-sellers")
    public List<Product> getBestSellers() {
        return productService.getBestSellers();
    }

    @GetMapping("/flash-sales")
    public List<Product> getFlashSales() {
        return productService.getFlashSales();
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String query) {
        // Tìm kiếm sản phẩm theo từ khóa để tăng trải nghiệm người dùng
        return productService.searchProducts(query);
    }

    @GetMapping("/brand/{brand}")
    public List<Product> getProductsByBrand(@PathVariable String brand) {
        return productService.getProductsByBrand(brand);
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        // Lọc sản phẩm theo danh mục để phục vụ tính năng danh mục ở phía người dùng
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/compare")
    public ResponseEntity<List<Product>> getProductsByIds(@RequestParam List<Long> ids) {
        // Lấy danh sách sản phẩm theo danh sách ID truyền vào để phục vụ tính năng so sánh sản phẩm.
        return ResponseEntity.ok(productService.getProductsByIds(ids));
    }

    // --- CÁC ENDPOINT DÙNG BIẾN CHUNG {ID} ĐỂ CUỐI CÙNG ---

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.requireProduct(id));
    }

    @PostMapping
    public Product createProduct(@Valid @RequestBody ProductRequest productRequest) {
        return productService.saveProduct(productRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest productRequest) {
        return ResponseEntity.ok(productService.updateProduct(id, productRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
