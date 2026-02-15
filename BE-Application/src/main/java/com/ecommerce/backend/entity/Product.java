package com.ecommerce.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên sản phẩm là bắt buộc để hiển thị trên website
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    // Sử dụng TEXT để lưu trữ mô tả dài hơn mức giới hạn của VARCHAR thông thường
    @Column(columnDefinition = "TEXT")
    private String description;

    // Dùng BigDecimal để đảm bảo độ chính xác của giá tiền, tránh sai số float/double trong thương mại
    @NotNull(message = "Giá sản phẩm không được để trống")
    @Min(value = 0, message = "Giá sản phẩm phải lớn hơn hoặc bằng 0")
    private BigDecimal price;

    // Số lượng hàng trong kho để kiểm soát việc bán hàng
    @Min(value = 0, message = "Số lượng kho không được âm")
    private Integer stockQuantity;

    // URL hình ảnh để hiển thị ở phía Frontend
    private String imageUrl;

    // Hãng sản xuất (Apple, Samsung,...)
    private String brand;

    // Sản phẩm bán chạy
    private boolean isBestSeller = false;

    // Giá gốc (để hiển thị gạch ngang khi giảm giá)
    private BigDecimal originalPrice;

    // Giá Flash Sale (nếu có)
    private BigDecimal discountPrice;

    // Đánh giá sản phẩm (0-5 sao)
    private Double rating = 5.0;

    // Số lượng lượt đánh giá
    private Integer reviewCount = 0;

    // Quan hệ nhiều sản phẩm thuộc về một danh mục
    // FetchType.LAZY giúp tối ưu hiệu năng khi không cần tải dữ liệu danh mục ngay lập tức
    // @JsonIgnoreProperties("products") chặn không cho Jackson lấy lại danh sách sản phẩm từ Category, tránh loop
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties("products")
    private Category category;

    // Tự động ghi nhận thời gian tạo để quản lý sản phẩm mới
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Sử dụng PrePersist/PreUpdate để tự động quản lý thời gian mà không cần can thiệp thủ công từ Service
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
