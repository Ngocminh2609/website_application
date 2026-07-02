package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.UserProductView;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.UserProductViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserProductViewRepository viewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * Ghi nhận lượt xem sản phẩm của người dùng.
     */
    @Transactional
    public void trackProductView(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        UserProductView view = viewRepository.findByUserAndProduct(user, product)
                .orElseGet(() -> UserProductView.builder()
                        .user(user)
                        .product(product)
                        .viewCount(0)
                        .build());

        view.setViewCount(view.getViewCount() + 1);
        view.setLastViewedAt(LocalDateTime.now());
        viewRepository.save(view);
    }

    /**
     * Lấy danh sách sản phẩm gợi ý cá nhân hóa.
     * Thuật toán: Kết hợp sản phẩm đã xem gần đây và sản phẩm thuộc danh mục quan tâm nhất.
     */
    public List<Product> getPersonalizedRecommendations(User user, int limit) {

        // 1. Lấy sản phẩm đã xem gần nhất (khoảng 1/2 limit)
        List<Product> recentlyViewed = viewRepository.findRecentlyViewedProductsByUser(user, PageRequest.of(0, limit / 2));

        // 2. Lấy danh mục quan tâm nhất
        List<String> topCategories = viewRepository.findTopInterestedCategoriesByUser(user, PageRequest.of(0, 2));

        // 3. Lấy sản phẩm từ các danh mục đó (không trùng với sản phẩm đã xem)
        List<Product> recommendations = new ArrayList<>(recentlyViewed);
        
        if (!topCategories.isEmpty()) {
            List<Long> viewedIds = recentlyViewed.stream().map(Product::getId).toList();
            
            // Tìm sản phẩm cùng danh mục nhưng chưa xem
            List<Product> similarProducts = productRepository.findByCategoryNameIn(topCategories, PageRequest.of(0, limit));
            for (Product p : similarProducts) {
                if (!viewedIds.contains(p.getId()) && recommendations.size() < limit) {
                    recommendations.add(p);
                }
            }
        }

        // 4. Nếu vẫn thiếu, lấy sản phẩm bán chạy bổ sung
        if (recommendations.size() < limit) {
            List<Product> bestSellers = productRepository.findByIsBestSellerTrue(PageRequest.of(0, limit));
            for (Product p : bestSellers) {
                if (!recommendations.contains(p) && recommendations.size() < limit) {
                    recommendations.add(p);
                }
            }
        }

        return recommendations;
    }
}
