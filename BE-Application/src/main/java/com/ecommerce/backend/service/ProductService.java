package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.util.persistence.EntityLookupUtil;
import com.ecommerce.backend.util.storage.ImageReplaceUtil;
import com.ecommerce.backend.util.text.StringListUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_CATEGORY_NOT_FOUND;
import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_PRODUCT_NOT_FOUND;
import static com.ecommerce.backend.constant.service.ProductServiceConstants.MORE_IMAGES_DELIMITER;

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

    public List<Product> getAllProductsPublic() {
        return productRepository.findByIsActiveTrue();
    }

    public List<Product> getAllProductsAdmin() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    public Product requireProduct(Long id) {
        return EntityLookupUtil.require(productRepository.findById(id), ERROR_PRODUCT_NOT_FOUND);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(query);
    }

    public Product saveProduct(ProductRequest request) {
        Category category = EntityLookupUtil.require(
                categoryRepository.findById(request.getCategoryId()),
                ERROR_CATEGORY_NOT_FOUND
        );

        Product product = new Product();
        mapRequestToEntity(request, product, category);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = requireProduct(id);
        Category category = EntityLookupUtil.require(
                categoryRepository.findById(request.getCategoryId()),
                ERROR_CATEGORY_NOT_FOUND
        );

        ImageReplaceUtil.deleteIfReplaced(
                product.getImageUrl(), request.getImageUrl(), productBucket, minioService::deleteFile
        );
        deleteRemovedMoreImages(product.getMoreImages(), request.getMoreImages());

        mapRequestToEntity(request, product, category);
        return productRepository.save(product);
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
        productRepository.findById(id).ifPresent(this::deleteAllProductImages);
        productRepository.deleteById(id);
    }

    private void deleteAllProductImages(Product product) {
        if (product.getImageUrl() != null) {
            minioService.deleteFile(product.getImageUrl(), productBucket);
        }
        parseMoreImages(product.getMoreImages()).forEach(url -> minioService.deleteFile(url, productBucket));
    }

    private void deleteRemovedMoreImages(String oldMoreImages, String newMoreImages) {
        List<String> oldList = parseMoreImages(oldMoreImages);
        List<String> newList = parseMoreImages(newMoreImages);
        oldList.stream()
                .filter(url -> !newList.contains(url))
                .forEach(url -> minioService.deleteFile(url, productBucket));
    }

    private List<String> parseMoreImages(String moreImages) {
        return StringListUtil.splitAndTrim(moreImages, MORE_IMAGES_DELIMITER);
    }

    public List<Product> getProductsByIds(List<Long> ids) {
        return productRepository.findAllById(ids);
    }
}
