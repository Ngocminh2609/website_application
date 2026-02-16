-- ==========================================================
-- Cơ sở dữ liệu cho dự án Website Bán Hàng Full Stack
-- FE: TypeScript | BE: Spring Boot | DB: MySQL
-- ==========================================================

-- Tạo cơ sở dữ liệu nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- 1. Bảng Danh mục (Categories)
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Tên danh mục sản phẩm',
    image_url VARCHAR(500) COMMENT 'Đường dẫn ảnh đại diện danh mục',
    description TEXT COMMENT 'Mô tả chi tiết về danh mục',
    INDEX (name)
) ENGINE=InnoDB;

-- 2. Bảng Sản phẩm (Products)
-- Cập nhật: Thêm các cột brand, is_best_seller, price_original, discount_price, rating, review_count
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(19, 2) NOT NULL COMMENT 'Sử dụng DECIMAL để đảm bảo chính xác về tiền tệ',
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    category_id BIGINT,
    brand VARCHAR(255) DEFAULT NULL,
    is_best_seller TINYINT(1) DEFAULT 0,
    original_price DECIMAL(19, 2) DEFAULT NULL,
    discount_price DECIMAL(19, 2) DEFAULT NULL,
    rating DOUBLE DEFAULT 5.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX (name),
    INDEX (category_id),
    INDEX (brand)
) ENGINE=InnoDB;

-- 3. Bảng Người dùng (Users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `full_name` VARCHAR(100) NULL,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `role` VARCHAR(20) DEFAULT 'USER',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- 4. Bảng Giỏ hàng (Carts)
CREATE TABLE IF NOT EXISTS `carts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 5. Bảng Chi tiết giỏ hàng (Cart Items)
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `cart_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ==========================================================
-- Dữ liệu mẫu (Seed Data)
-- ==========================================================

-- Dữ liệu người dùng (Mật khẩu: password123)
INSERT INTO `users` (`username`, `password`, `email`, `full_name`, `role`) VALUES
('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'admin@technova.com', 'Hệ Thống Admin', 'ADMIN'),
('user1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user1@gmail.com', 'Nguyễn Văn A', 'USER')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- Danh mục sản phẩm (image_url mặc định để trống cho mẫu)
INSERT INTO categories (id, name, image_url, description) VALUES 
(1, 'Laptop', '', 'Các dòng máy tính xách tay cao cấp, mỏng nhẹ'),
(2, 'SmartPhone', '', 'Điện thoại thông minh trải nghiệm AI'),
(3, 'SmartWatch', '', 'Đồng hồ thông minh theo dõi sức khỏe')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Sản phẩm phong phú (Sử dụng link chuẩn từ CDN chính thức)
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, brand, is_best_seller, original_price, discount_price, rating, review_count)
VALUES 
('iPhone 15 Pro Max', 'Chip A17 Pro mạnh mẽ, khung viền Titan siêu bền.', 32000000.00, 50, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1692845692711', 2, 'Apple', 1, 35000000.00, 31990000.00, 4.9, 1250),
('MacBook Air M2 13"', 'Thiết kế mỏng nhẹ không tưởng, pin lên đến 18 giờ.', 24500000.00, 30, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-202206?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665', 1, 'Apple', 1, 28000000.00, 23990000.00, 4.8, 850),
('Apple Watch Series 9', 'Cảm biến nhịp tim, đo nồng độ oxy trong máu.', 9500000.00, 100, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTXG3ref_VW_34FR+watch-45-alum-midnight-nc-s9_VW_34FR_WF_CO?wid=750&hei=750&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1694507905569', 3, 'Apple', 0, 10500000.00, 9200000.00, 4.7, 420),
('Samsung Galaxy S24 Ultra', 'Bút S Pen huyền thoại, chip Snapdragon 8 Gen 3 for Galaxy.', 28900000.00, 45, 'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-s928-sm-s928bztqvnn-thumb-539311311', 2, 'Samsung', 1, 33500000.00, 28500000.00, 4.9, 980),
('Galaxy Watch6 Classic', 'Vòng xoay bezel sành điệu, theo dõi giấc ngủ nâng cao.', 7200000.00, 60, 'https://images.samsung.com/is/image/samsung/p6pim/vn/2307/gallery/vn-galaxy-watch6-classic-r960-sm-r965fzsaxvv-thumb-537446146', 3, 'Samsung', 0, 8500000.00, 6990000.00, 4.6, 310),
('Dell XPS 13 Plus', 'Màn hình 3.5K OLED rực rỡ, bàn phím vô cực.', 42000000.00, 15, 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9315/media-gallery/un-9315-nt-sky-notebook-xps13-9315-sky-gallery-3.psd?wid=800&hei=600&qlt=95', 1, 'Dell', 0, 46000000.00, 41000000.00, 4.8, 150),
('ROG Zephyrus G14', 'Màn hình 120Hz, sức mạnh gaming trong thân xác văn phòng.', 38000000.00, 20, 'https://dlcdnwebimgs.asus.com/gain/3DCCBA1D-7C61-464A-A8E2-9E46714E2D30/w800', 1, 'Asus', 1, 41500000.00, 37500000.00, 4.9, 540);
