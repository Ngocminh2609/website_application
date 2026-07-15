package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ReviewRequest;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductReview;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.ProductReviewRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.util.persistence.EntityLookupUtil;
import com.ecommerce.backend.util.security.OwnershipUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_PRODUCT_NOT_FOUND;
import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_USER_NOT_FOUND;
import static com.ecommerce.backend.constant.domain.RoleConstants.ROLE_ADMIN;
import static com.ecommerce.backend.constant.service.ReviewServiceConstants.ERROR_ALREADY_REVIEWED;
import static com.ecommerce.backend.constant.service.ReviewServiceConstants.ERROR_NO_PERMISSION_DELETE;
import static com.ecommerce.backend.constant.service.ReviewServiceConstants.ERROR_REVIEW_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ProductReview> getApprovedReviews(Long productId) {
        return reviewRepository.findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(productId);
    }

    @Transactional
    public ProductReview createReview(Long productId, Long userId, ReviewRequest request) {
        reviewRepository.findByProductIdAndUserId(productId, userId).ifPresent(r -> {
            throw new BadRequestException(ERROR_ALREADY_REVIEWED);
        });

        Product product = EntityLookupUtil.require(productRepository.findById(productId), ERROR_PRODUCT_NOT_FOUND);
        User user = EntityLookupUtil.require(userRepository.findById(userId), ERROR_USER_NOT_FOUND);

        boolean isVerified = reviewRepository.hasUserPurchasedProduct(productId, userId);

        ProductReview review = ProductReview.builder()
                .product(product)
                .user(user)
                .rating(request.getRating().byteValue())
                .comment(request.getComment())
                .isVerifiedPurchase(isVerified)
                .isApproved(false)
                .build();

        ProductReview saved = reviewRepository.save(review);
        updateProductRatingStats(productId, product);
        return saved;
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId, String userRole) {
        ProductReview review = EntityLookupUtil.require(reviewRepository.findById(reviewId), ERROR_REVIEW_NOT_FOUND);

        OwnershipUtil.requireOwnerOrAdmin(
                review.getUser().getId(), userId, userRole, ROLE_ADMIN, ERROR_NO_PERMISSION_DELETE
        );

        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);

        productRepository.findById(productId).ifPresent(product ->
                updateProductRatingStats(productId, product)
        );
    }

    private void updateProductRatingStats(Long productId, Product product) {
        Double avgRating = reviewRepository.calculateAverageRating(productId);
        long count = reviewRepository.countByProductIdAndIsApprovedTrue(productId);

        product.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 5.0);
        product.setReviewCount((int) count);
        productRepository.save(product);
    }

    public List<ProductReview> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public void approveReview(Long reviewId) {
        ProductReview review = EntityLookupUtil.require(reviewRepository.findById(reviewId), ERROR_REVIEW_NOT_FOUND);

        review.setIsApproved(true);
        reviewRepository.save(review);
        updateProductRatingStats(review.getProduct().getId(), review.getProduct());
    }
}
