-- ==========================================================
-- Cơ sở dữ liệu cho dự án Website Bán Hàng Full Stack
-- FE: TypeScript | BE: Spring Boot | DB: MySQL
-- ==========================================================

-- Tạo cơ sở dữ liệu nếu chưa tồn tại
-- Việc kiểm tra giúp tránh lỗi khi chạy script nhiều lần trên cùng một server
CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- 1. Bảng Danh mục (Categories)
-- Lưu trữ các nhóm sản phẩm (Ví dụ: Laptop, Điện thoại, Đồng hồ)
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Tên danh mục sản phẩm',
    description TEXT COMMENT 'Mô tả chi tiết về danh mục',
    INDEX (name) -- Index tên để tối ưu tìm kiếm và sắp xếp theo danh mục
) ENGINE=InnoDB;

-- 2. Bảng Sản phẩm (Products)
-- Lưu trữ thông tin chi tiết về từng mặt hàng
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(19, 2) NOT NULL COMMENT 'Sử dụng DECIMAL để đảm bảo chính xác về tiền tệ',
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Ràng buộc khóa ngoại: Đảm bảo tính toàn vẹn dữ liệu
    -- ON DELETE CASCADE: Khi xóa danh mục, các sản phẩm thuộc danh mục đó cũng sẽ bị xóa
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    
    INDEX (name), -- Hỗ trợ tìm kiếm theo tên sản phẩm nhanh hơn
    INDEX (category_id) -- Tối ưu việc lọc sản phẩm theo danh mục
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `full_name` VARCHAR(100) NULL,
  `role` VARCHAR(20) DEFAULT 'USER', -- USER, ADMIN
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- Dữ liệu mẫu (Seed Data) cho mục đích demo và kiểm thử
-- ==========================================================

-- Dữ liệu mẫu cho người dùng (Mật khẩu: password123 đã được mã hóa BCrypt)
INSERT INTO `users` (`username`, `password`, `email`, `full_name`, `role`) VALUES
('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'admin@technova.com', 'Hệ Thống Admin', 'ADMIN'),
('user1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user1@gmail.com', 'Nguyễn Văn A', 'USER');

-- Chèn danh mục
INSERT INTO categories (name, description) VALUES 
('Laptop', 'Các dòng máy tính xách tay cao cấp, mỏng nhẹ'),
('SmartPhone', 'Điện thoại thông minh trải nghiệm AI'),
('SmartWatch', 'Đồng hồ thông minh theo dõi sức khỏe');

-- Chèn sản phẩm mẫu  
-- Lấy ID từ các danh mục vừa tạo (Giả định ID lần lượt là 1, 2, 3)
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id) VALUES 
('UltraBook Pro X1', 'Laptop thế hệ mới với hiệu năng vượt trội và thiết kế siêu mỏng.', 2500.00, 50, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 1),
('SmartPhone S24 Nebula', 'Trải nghiệm màn hình vô cực và camera AI thông minh bậc nhất.', 1200.00, 100, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 2),
('Quantum Watch Series 5', 'Đồng hồ thông minh theo dõi sức khỏe và phong cách sống thượng lưu.', 450.00, 200, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 3);
-- -----------------------------------------------------
-- Table `carts` & `cart_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `carts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `cart_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
