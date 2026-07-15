package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.ecommerce.backend.constant.service.CategoryServiceConstants.*;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Sử dụng Constructor Injection để đảm bảo tính bất biến (Immutability) và dễ dàng viết Unit Test
    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        // Kiểm tra sự tồn tại trước khi cập nhật để tránh tạo mới dữ liệu không mong muốn
        return categoryRepository.findById(id).map(category -> {
            category.setName(categoryDetails.getName());
            category.setDescription(categoryDetails.getDescription());
            return categoryRepository.save(category);
        }).orElseThrow(() -> new RuntimeException(ERROR_CATEGORY_NOT_FOUND + id));
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
