package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.UserAddress;
import com.ecommerce.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {

    /**
     * Lấy danh sách địa chỉ của một người dùng cụ thể.
     */
    List<UserAddress> findByUserOrderByIsDefaultDescCreatedAtDesc(User user);

    /**
     * Tìm địa chỉ mặc định của người dùng.
     */
    Optional<UserAddress> findByUserAndIsDefault(User user, Boolean isDefault);
}
