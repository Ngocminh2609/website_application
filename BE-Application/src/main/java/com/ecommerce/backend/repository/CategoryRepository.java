package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // JpaRepository cung cấp sẵn các phương thức CRUD cơ bản
    // Việc sử dụng Interface giúp Spring tự động tạo implementation và quản lý giao dịch (Transaction)
}
