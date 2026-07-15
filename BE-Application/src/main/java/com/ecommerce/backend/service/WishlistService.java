package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.ecommerce.backend.constant.service.WishlistServiceConstants.*;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    // Lấy danh sách sản phẩm yêu thích của người dùng
    public List<Product> getUserWishlist(User user) {
        return wishlistRepository.findByUser(user)
                .stream()
                .map(Wishlist::getProduct)
                .collect(Collectors.toList());
    }

    // Thêm sản phẩm vào danh sách yêu thích
    @Transactional
    public void addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException(ERROR_PRODUCT_NOT_FOUND));

        // Kiểm tra nếu đã tồn tại thì không thêm nữa
        if (wishlistRepository.findByUserAndProduct(user, product).isEmpty()) {
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();
            wishlistRepository.save(wishlist);
        }
    }

    // Xóa sản phẩm khỏi danh sách yêu thích
    @Transactional
    public void removeFromWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException(ERROR_PRODUCT_NOT_FOUND));
        wishlistRepository.deleteByUserAndProduct(user, product);
    }

    // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
    public boolean isInWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return false;
        return wishlistRepository.findByUserAndProduct(user, product).isPresent();
    }
}
