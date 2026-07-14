package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    // Tìm danh sách yêu thích của một người dùng cụ thể
    List<Wishlist> findByUser(User user);

    // Kiểm tra xem một sản phẩm đã có trong danh sách yêu thích của người dùng chưa
    Optional<Wishlist> findByUserAndProduct(User user, Product product);

    // Xóa sản phẩm khỏi danh sách yêu thích
    void deleteByUserAndProduct(User user, Product product);

    // Đếm số lượng sản phẩm trong danh sách yêu thích của người dùng
    long countByUser(User user);
}
