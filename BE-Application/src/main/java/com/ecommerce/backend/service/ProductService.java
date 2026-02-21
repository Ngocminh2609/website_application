package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final MinioService minioService;

    @Value("${minio.bucket.product}")
    private String productBucket;

    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, MinioService minioService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.minioService = minioService;
    }

    public List<Product> getAllProducts() {
        return productRepository.findByIsActiveTrue();
    }

    public List<Product> getAllProductsPublic() {
        return productRepository.findByIsActiveTrue();
    }

    public List<Product> getAllProductsAdmin() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(query);
    }

    public Product saveProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        Product product = new Product();
        mapRequestToEntity(request, product, category);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        return productRepository.findById(id).map(product -> {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

            // Xoa anh chinh cu neu admin thay the bang anh moi de tranh de lai file rac
            String oldImageUrl = product.getImageUrl();
            String newImageUrl = request.getImageUrl();
            if (oldImageUrl != null && newImageUrl != null && !oldImageUrl.equals(newImageUrl)) {
                minioService.deleteFile(oldImageUrl, productBucket);
            }

            // Xoa nhung anh phu bi loai khoi danh sach khi admin cap nhat
            deleteRemovedMoreImages(product.getMoreImages(), request.getMoreImages());

            mapRequestToEntity(request, product, category);
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    private void mapRequestToEntity(ProductRequest request, Product product, Category category) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setDiscountPercent(request.getDiscountPercent());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setMoreImages(request.getMoreImages());
        product.setBrand(request.getBrand());
        product.setSpecifications(request.getSpecifications());
        product.setBestSeller(request.isBestSeller());
        product.setIsActive(request.isActive());
        product.setCategory(category);
    }

    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrandAndIsActiveTrue(brand);
    }

    public List<Product> getBestSellers() {
        return productRepository.findByIsBestSellerTrueAndIsActiveTrue();
    }

    public List<Product> getFlashSales() {
        return productRepository.findByDiscountPriceNotNullAndIsActiveTrue();
    }

    public void deleteProduct(Long id) {
        // Xoa tat ca anh tren storage truoc de tranh de lai file rac khi san pham bi xoa
        productRepository.findById(id).ifPresent(this::deleteAllProductImages);
        productRepository.deleteById(id);
    }

    /**
     * Xoa toan bo anh cua san pham (ca imageUrl chinh lan toan bo moreImages)
     * gop chung vao 1 ham de tai su dung, tranh lap lai logic o deleteProduct va updateProduct.
     */
    private void deleteAllProductImages(Product product) {
        if (product.getImageUrl() != null) {
            minioService.deleteFile(product.getImageUrl(), productBucket);
        }
        parseMoreImages(product.getMoreImages()).forEach(url -> minioService.deleteFile(url, productBucket));
    }

    /**
     * Xoa nhung anh phu bi loai khoi danh sach moi khi admin cap nhat.
     * So sanh 2 danh sach de chi xoa anh thuc su khong con duoc dung.
     */
    private void deleteRemovedMoreImages(String oldMoreImages, String newMoreImages) {
        List<String> oldList = parseMoreImages(oldMoreImages);
        List<String> newList = parseMoreImages(newMoreImages);
        oldList.stream()
                .filter(url -> !newList.contains(url))
                .forEach(url -> minioService.deleteFile(url, productBucket));
    }

    /**
     * Tach chuoi moreImages phan cach bang dau phay thanh danh sach URL.
     * Tra ve danh sach rong neu moreImages null hoac trong de tranh NullPointerException o cac ham goi.
     */
    private List<String> parseMoreImages(String moreImages) {
        if (moreImages == null || moreImages.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(moreImages.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
