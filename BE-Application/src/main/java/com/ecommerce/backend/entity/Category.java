package com.ecommerce.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Category {
    // Sử dụng IDENTITY để MySQL tự động tăng giá trị ID theo cơ chế riêng của DB
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Đảm bảo tên danh mục không được để trống để giữ tính nhất quán của dữ liệu
    @NotBlank(message = "Tên danh mục không được để trống")
    @Column(nullable = false)
    private String name;

    // Mô tả thêm về danh mục sản phẩm
    private String description;

    // Quan hệ một danh mục có nhiều sản phẩm
    // mappedBy trỏ tới field 'category' trong class Product để Hibernate biết đây là quan hệ hai chiều
    // CascadeType.ALL đảm bảo khi xóa danh mục thì các logic liên quan cũng được xử lý (tùy nghiệp vụ)
    // @JsonIgnoreProperties giúp tránh lỗi lặp vô hạn (Infinite Recursion) khi Jackson serialize object sang JSON
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("category")
    private List<Product> products;
}
