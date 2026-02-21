package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ReviewRequest;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductReview;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.ProductReviewRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * Lấy danh sách review đã được duyệt của sản phẩm để hiển thị ra ngoài.
     */
    public List<ProductReview> getApprovedReviews(Long productId) {
        return reviewRepository.findByProductIdAndIsApprovedTrueOrderByCreatedAtDesc(productId);
    }

    /**
     * Tạo review mới.
     * Sau khi tạo, cập nhật lại rating và reviewCount trên Product để FE không cần tính lại.
     */
    @Transactional
    public ProductReview createReview(Long productId, Long userId, ReviewRequest request) {
        // Kiểm tra user đã review sản phẩm này chưa (unique constraint ở DB cũng bắt, nhưng check sớm để trả message rõ hơn)
        reviewRepository.findByProductIdAndUserId(productId, userId).ifPresent(r -> {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi");
        });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Tự động xác nhận mua hàng bằng cách truy vấn lịch sử đơn hàng thay vì để user tự khai
        boolean isVerified = reviewRepository.hasUserPurchasedProduct(productId, userId);

        ProductReview review = ProductReview.builder()
                .product(product)
                .user(user)
                .rating(request.getRating().byteValue())
                .comment(request.getComment())
                .isVerifiedPurchase(isVerified)
                .isApproved(false) // Mặc định review mới phải chờ Admin duyệt để đảm bảo chất lượng nội dung
                .build();

        ProductReview saved = reviewRepository.save(review);

        // Cập nhật ngay rating và reviewCount trên Product để phản ánh kết quả mới nhất
        updateProductRatingStats(productId, product);

        return saved;
    }

    /**
     * Xóa review (Admin hoặc chủ review).
     * Sau khi xóa cập nhật lại stats của Product.
     */
    @Transactional
    public void deleteReview(Long reviewId, Long userId, String userRole) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review không tồn tại"));

        // Chỉ chủ review hoặc Admin mới được xóa
        if (!review.getUser().getId().equals(userId) && !"ADMIN".equals(userRole)) {
            throw new RuntimeException("Bạn không có quyền xóa review này");
        }

        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);

        // Tái tính stats sau khi xóa để tránh hiển thị số liệu sai
        productRepository.findById(productId).ifPresent(product ->
                updateProductRatingStats(productId, product)
        );
    }

    /**
     * Tính lại và lưu rating trung bình + tổng số review vào bảng products.
     * Dùng cách này thay vì tính realtime ở FE để đảm bảo nhất quán dữ liệu.
     */
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
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review không tồn tại"));
        
        review.setIsApproved(true);
        reviewRepository.save(review);

        // Sau khi duyệt xong mới tính lại rating cho Product để công khai chỉ số mới
        updateProductRatingStats(review.getProduct().getId(), review.getProduct());
    }
}
