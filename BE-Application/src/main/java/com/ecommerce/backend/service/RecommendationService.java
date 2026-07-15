package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.UserProductView;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserProductViewRepository;
import com.ecommerce.backend.util.persistence.EntityLookupUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_PRODUCT_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserProductViewRepository viewRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void trackProductView(User user, Long productId) {
        Product product = EntityLookupUtil.require(productRepository.findById(productId), ERROR_PRODUCT_NOT_FOUND);

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

    public List<Product> getPersonalizedRecommendations(User user, int limit) {
        List<Product> recentlyViewed = viewRepository.findRecentlyViewedProductsByUser(user, PageRequest.of(0, limit / 2));
        List<String> topCategories = viewRepository.findTopInterestedCategoriesByUser(user, PageRequest.of(0, 2));

        List<Product> recommendations = new ArrayList<>(recentlyViewed);

        if (!topCategories.isEmpty()) {
            List<Long> viewedIds = recentlyViewed.stream().map(Product::getId).toList();
            List<Product> similarProducts = productRepository.findByCategoryNameIn(topCategories, PageRequest.of(0, limit));
            for (Product p : similarProducts) {
                if (!viewedIds.contains(p.getId()) && recommendations.size() < limit) {
                    recommendations.add(p);
                }
            }
        }

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
