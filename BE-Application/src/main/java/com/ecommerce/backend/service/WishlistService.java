package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.WishlistRepository;
import com.ecommerce.backend.util.persistence.EntityLookupUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.ecommerce.backend.constant.domain.ErrorMessageConstants.ERROR_PRODUCT_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    public List<Product> getUserWishlist(User user) {
        return wishlistRepository.findByUser(user)
                .stream()
                .map(Wishlist::getProduct)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addToWishlist(User user, Long productId) {
        Product product = EntityLookupUtil.require(productRepository.findById(productId), ERROR_PRODUCT_NOT_FOUND);

        if (wishlistRepository.findByUserAndProduct(user, product).isEmpty()) {
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();
            wishlistRepository.save(wishlist);
        }
    }

    @Transactional
    public void removeFromWishlist(User user, Long productId) {
        Product product = EntityLookupUtil.require(productRepository.findById(productId), ERROR_PRODUCT_NOT_FOUND);
        wishlistRepository.deleteByUserAndProduct(user, product);
    }

    public boolean isInWishlist(User user, Long productId) {
        return productRepository.findById(productId)
                .map(product -> wishlistRepository.findByUserAndProduct(user, product).isPresent())
                .orElse(false);
    }
}
