package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        // Áp dụng tính đóng gói bằng cách cập nhật từng trường cụ thể của Entity hiện có
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setStockQuantity(productDetails.getStockQuantity());
            product.setImageUrl(productDetails.getImageUrl());
            product.setBrand(productDetails.getBrand());
            product.setBestSeller(productDetails.isBestSeller());
            product.setOriginalPrice(productDetails.getOriginalPrice());
            product.setDiscountPrice(productDetails.getDiscountPrice());
            product.setRating(productDetails.getRating());
            product.setReviewCount(productDetails.getReviewCount());

            if (productDetails.getCategory() != null) {
                product.setCategory(productDetails.getCategory());
            }
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    public List<Product> getBestSellers() {
        return productRepository.findByIsBestSellerTrue();
    }

    public List<Product> getFlashSales() {
        return productRepository.findByDiscountPriceNotNull();
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
