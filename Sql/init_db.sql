-- ==========================================================
-- Cơ sở dữ liệu cho dự án Website Bán Hàng Full Stack
-- FE: TypeScript | BE: Spring Boot | DB: MySQL
-- ==========================================================

-- I. KHỞI TẠO CƠ SỞ DỮ LIỆU
CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- Disable foreign key checks to drop and create tables cleanly
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `banners`;
DROP TABLE IF EXISTS `user_product_views`;
DROP TABLE IF EXISTS `wishlists`;
DROP TABLE IF EXISTS `product_reviews`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `user_addresses`;
DROP TABLE IF EXISTS `chat_messages`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `payment_transactions`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `categories`;
SET FOREIGN_KEY_CHECKS = 1;

-- II. ĐỊNH NGHĨA CẤU TRÚC BẢNG (DDL - CREATE)

-- 1. Bảng Danh mục (Categories)
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Tên danh mục sản phẩm',
    image_url VARCHAR(500) COMMENT 'Đường dẫn ảnh đại diện danh mục',
    description TEXT COMMENT 'Mô tả chi tiết về danh mục',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (name)
) ENGINE=InnoDB;

-- 2. Bảng Sản phẩm (Products)
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(19, 2) NOT NULL COMMENT 'Sử dụng DECIMAL để đảm bảo chính xác về tiền tệ',
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    more_images TEXT COMMENT 'Danh sách ảnh bổ sung, cách nhau bằng dấu phẩy',
    category_id BIGINT,
    brand VARCHAR(255) DEFAULT NULL,
    is_best_seller TINYINT(1) DEFAULT 0,
    original_price DECIMAL(19, 2) DEFAULT NULL,
    discount_price DECIMAL(19, 2) DEFAULT NULL,
    discount_percent INT DEFAULT 0,
    rating DOUBLE DEFAULT 5.0,
    review_count INT DEFAULT 0,
    specifications TEXT COMMENT 'Thông số kỹ thuật của sản phẩm',
    is_active TINYINT(1) DEFAULT 1 COMMENT '1: đang kinh doanh, 0: tạm ẩn',
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
  `phone` VARCHAR(20) DEFAULT NULL COMMENT 'Số điện thoại liên hệ',
  `role` VARCHAR(20) DEFAULT 'USER',
  `theme_preference` VARCHAR(10) DEFAULT 'light' COMMENT 'Thiết lập giao diện: light hoặc dark',
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
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 6. Bảng Đơn hàng (Orders)
CREATE TABLE IF NOT EXISTS `orders` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `total_amount` DECIMAL(19, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, PAID, FAILED, SHIPPING, DELIVERED, CANCELLED',
    `payment_method` VARCHAR(50) DEFAULT 'VNPAY',
    `shipping_address` TEXT,
    `phone_number` VARCHAR(20),
    `applied_coupon_code` VARCHAR(50),
    `coupon_discount` DECIMAL(19, 2) DEFAULT 0.00,
    `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 7. Bảng Chi tiết đơn hàng (Order Items)
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `quantity` INT NOT NULL,
    `price` DECIMAL(19, 2) NOT NULL COMMENT 'Giá tại thời điểm mua',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 8. Bảng Ghi nhận giao dịch (Payment Transactions)
CREATE TABLE IF NOT EXISTS `payment_transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `vnp_txn_ref` VARCHAR(50),
    `vnp_transaction_no` VARCHAR(50),
    `vnp_response_code` VARCHAR(10),
    `vnp_amount` DECIMAL(19, 2),
    `vnp_bank_code` VARCHAR(20),
    `vnp_pay_date` VARCHAR(20),
    `vnp_transaction_status` VARCHAR(10),
    `secure_hash` VARCHAR(255),
    `raw_data` TEXT COMMENT 'Toàn bộ dữ liệu JSON từ VNPay',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- 9. Bảng Thông báo (Notifications)
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `recipient_id` VARCHAR(100) NOT NULL COMMENT 'ID người nhận: user-{id} hoặc admin',
    `message` TEXT NOT NULL COMMENT 'Nội dung thông báo',
    `type` VARCHAR(20) NOT NULL DEFAULT 'SYSTEM' COMMENT 'MESSAGE, ORDER, SYSTEM',
    `is_read` TINYINT(1) DEFAULT 0 COMMENT '0: Chưa đọc, 1: Đã đọc',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX (`recipient_id`),
    INDEX (`is_read`)
) ENGINE = InnoDB;

-- 10. Bảng Tin nhắn Chat (Chat Messages)
CREATE TABLE IF NOT EXISTS `chat_messages` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sender` VARCHAR(100) NOT NULL COMMENT 'Tên hiển thị người gửi',
    `sender_id` VARCHAR(100) NOT NULL COMMENT 'ID người gửi (admin hoặc client_id)',
    `recipient_id` VARCHAR(100) COMMENT 'ID người nhận (admin hoặc client_id)',
    `content` TEXT NOT NULL COMMENT 'Nội dung tin nhắn',
    `type` VARCHAR(20) NOT NULL DEFAULT 'CHAT' COMMENT 'CHAT, JOIN, LEAVE',
    `email` VARCHAR(100) COMMENT 'Email của client để phân biệt hội thoại',
    `full_name` VARCHAR(100) COMMENT 'Tên đầy đủ của client',
    `is_bot_response` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX (`sender_id`),
    INDEX (`recipient_id`),
    INDEX (`email`),
    INDEX (`created_at`)
) ENGINE = InnoDB;

-- 11. Bảng Địa chỉ người dùng (User Addresses)
CREATE TABLE IF NOT EXISTS `user_addresses` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `province` VARCHAR(100) NOT NULL,
    `ward` VARCHAR(100) NOT NULL,
    `detail_address` VARCHAR(255) NOT NULL,
    `is_default` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX (`user_id`)
) ENGINE = InnoDB;

-- 12. Bảng Mã giảm giá (Coupons)
CREATE TABLE IF NOT EXISTS `coupons` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã code người dùng nhập vào (ví dụ: SALE20)',
    `discount_type` VARCHAR(10) NOT NULL DEFAULT 'PERCENT' COMMENT 'PERCENT: giảm theo %, FIXED: giảm số tiền cố định',
    `discount_value` DECIMAL(19, 2) NOT NULL COMMENT 'Giá trị giảm (20 = 20% hoặc 50000 = 50.000đ)',
    `min_order_amount` DECIMAL(19, 2) DEFAULT 0 COMMENT 'Giá trị đơn hàng tối thiểu để áp dụng mã',
    `max_discount_amount` DECIMAL(19, 2) DEFAULT NULL COMMENT 'Mức giảm tối đa (dùng để giới hạn khi giảm theo %)',
    `usage_limit` INT DEFAULT NULL COMMENT 'Tổng số lần được dùng, NULL = không giới hạn',
    `used_count` INT NOT NULL DEFAULT 0 COMMENT 'Số lần đã dùng thực tế',
    `is_active` TINYINT(1) DEFAULT 1 COMMENT '1: đang hoạt động, 0: tạm khóa',
    `expires_at` DATETIME DEFAULT NULL COMMENT 'Thời điểm hết hạn, NULL = không hết hạn',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX (`code`),
    INDEX (`is_active`)
) ENGINE = InnoDB;

-- 12. Bảng Đánh giá sản phẩm (Product Reviews)
CREATE TABLE IF NOT EXISTS `product_reviews` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `rating` TINYINT NOT NULL COMMENT 'Số sao từ 1 đến 5',
    `comment` TEXT COMMENT 'Nội dung đánh giá của người dùng',
    `is_verified_purchase` TINYINT(1) DEFAULT 0 COMMENT '1: đã mua sản phẩm này, 0: chưa xác nhận',
    `is_approved` TINYINT(1) DEFAULT 0 COMMENT '1: được hiển thị, 0: đang chờ admin duyệt',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_user_product_review` (`user_id`, `product_id`) COMMENT 'Mỗi user chỉ được review 1 lần mỗi sản phẩm',
    INDEX (`product_id`),
    INDEX (`is_approved`)
) ENGINE = InnoDB;

-- 13. Bảng Danh sách yêu thích (Wishlists)
CREATE TABLE IF NOT EXISTS `wishlists` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_user_product_wishlist` (`user_id`, `product_id`),
    INDEX (`user_id`)
) ENGINE = InnoDB;

-- III. CHÈN DỮ LIỆU MẪU (DML - INSERT)
-- ========================================== --
-- CHÈN DỮ LIỆU MẪU ĐẦY ĐỦ (20 bản ghi mỗi bảng) --
-- ========================================== --

-- 1. Chèn dữ liệu bảng Users
INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `avatar_url`, `phone`, `role`, `theme_preference`) VALUES
(1, 'admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'admin@technova.com', 'Hệ Thống Admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', '0900000000', 'ADMIN', 'dark'),
(2, 'user1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user1@gmail.com', 'Nguyễn Văn A', 'https://images.unsplash.com/photo-1500000200000?auto=format&fit=crop&q=80&w=200', '0912345602', 'USER', 'light'),
(3, 'user2', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user2@gmail.com', 'Nguyễn Văn B', 'https://images.unsplash.com/photo-1530000300000?auto=format&fit=crop&q=80&w=200', '0912345603', 'USER', 'dark'),
(4, 'user3', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user3@gmail.com', 'Nguyễn Văn C', 'https://images.unsplash.com/photo-1500000400000?auto=format&fit=crop&q=80&w=200', '0912345604', 'USER', 'light'),
(5, 'user4', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user4@gmail.com', 'Nguyễn Văn D', 'https://images.unsplash.com/photo-1530000500000?auto=format&fit=crop&q=80&w=200', '0912345605', 'USER', 'dark'),
(6, 'user5', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user5@gmail.com', 'Nguyễn Văn E', 'https://images.unsplash.com/photo-1500000600000?auto=format&fit=crop&q=80&w=200', '0912345606', 'USER', 'light'),
(7, 'user6', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user6@gmail.com', 'Nguyễn Văn F', 'https://images.unsplash.com/photo-1530000700000?auto=format&fit=crop&q=80&w=200', '0912345607', 'USER', 'dark'),
(8, 'user7', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user7@gmail.com', 'Nguyễn Văn G', 'https://images.unsplash.com/photo-1500000800000?auto=format&fit=crop&q=80&w=200', '0912345608', 'USER', 'light'),
(9, 'user8', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user8@gmail.com', 'Nguyễn Văn H', 'https://images.unsplash.com/photo-1530000900000?auto=format&fit=crop&q=80&w=200', '0912345609', 'USER', 'dark'),
(10, 'user9', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user9@gmail.com', 'Nguyễn Văn I', 'https://images.unsplash.com/photo-1500001000000?auto=format&fit=crop&q=80&w=200', '0912345610', 'USER', 'light'),
(11, 'user10', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user10@gmail.com', 'Nguyễn Văn J', 'https://images.unsplash.com/photo-1530001100000?auto=format&fit=crop&q=80&w=200', '0912345611', 'USER', 'dark'),
(12, 'user11', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user11@gmail.com', 'Nguyễn Văn K', 'https://images.unsplash.com/photo-1500001200000?auto=format&fit=crop&q=80&w=200', '0912345612', 'USER', 'light'),
(13, 'user12', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user12@gmail.com', 'Nguyễn Văn L', 'https://images.unsplash.com/photo-1530001300000?auto=format&fit=crop&q=80&w=200', '0912345613', 'USER', 'dark'),
(14, 'user13', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user13@gmail.com', 'Nguyễn Văn M', 'https://images.unsplash.com/photo-1500001400000?auto=format&fit=crop&q=80&w=200', '0912345614', 'USER', 'light'),
(15, 'user14', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user14@gmail.com', 'Nguyễn Văn N', 'https://images.unsplash.com/photo-1530001500000?auto=format&fit=crop&q=80&w=200', '0912345615', 'USER', 'dark'),
(16, 'user15', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user15@gmail.com', 'Nguyễn Văn O', 'https://images.unsplash.com/photo-1500001600000?auto=format&fit=crop&q=80&w=200', '0912345616', 'USER', 'light'),
(17, 'user16', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user16@gmail.com', 'Nguyễn Văn P', 'https://images.unsplash.com/photo-1530001700000?auto=format&fit=crop&q=80&w=200', '0912345617', 'USER', 'dark'),
(18, 'user17', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user17@gmail.com', 'Nguyễn Văn Q', 'https://images.unsplash.com/photo-1500001800000?auto=format&fit=crop&q=80&w=200', '0912345618', 'USER', 'light'),
(19, 'user18', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user18@gmail.com', 'Nguyễn Văn R', 'https://images.unsplash.com/photo-1530001900000?auto=format&fit=crop&q=80&w=200', '0912345619', 'USER', 'dark'),
(20, 'user19', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user19@gmail.com', 'Nguyễn Văn S', 'https://images.unsplash.com/photo-1500002000000?auto=format&fit=crop&q=80&w=200', '0912345620', 'USER', 'light');

-- 2. Chèn dữ liệu bảng Categories
INSERT INTO categories (id, name, image_url, description) VALUES
(1, 'Laptop', 'https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&q=80&w=600', 'Các dòng máy tính xách tay cao cấp, mỏng nhẹ hiệu năng cao'),
(2, 'SmartPhone', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600', 'Điện thoại thông minh trải nghiệm AI đỉnh cao'),
(3, 'SmartWatch', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600', 'Đồng hồ thông minh theo dõi sức khỏe và luyện tập'),
(4, 'Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600', 'Tai nghe chống ồn chủ động, âm thanh chân thực'),
(5, 'Accessories', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600', 'Phụ kiện công nghệ cáp sạc, Hub chuyển đổi, chuột bàn phím');

-- 3. Chèn dữ liệu bảng Products
INSERT INTO products (id, name, description, price, stock_quantity, image_url, more_images, category_id, brand, is_best_seller, original_price, discount_price, discount_percent, rating, review_count, specifications, is_active) VALUES
(1, 'MacBook Air M2 13"', 'Thiết kế mỏng nhẹ không tưởng, chip M2 mượt mà, pin lên đến 18 giờ.', 23990000.0, 30, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600', '', 1, 'Apple', 1, 28000000.0, 23990000.0, 14, 4.8, 850, 'Màn hình: 13.6 inch Liquid Retina; CPU: Apple M2 8-core; RAM: 8GB; SSD: 256GB', 1),
(2, 'Dell XPS 13 Plus', 'Màn hình 3.5K OLED rực rỡ, bàn phím vô cực siêu mượt.', 41000000.0, 15, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600', '', 1, 'Dell', 0, 46000000.0, 41000000.0, 10, 4.8, 150, 'Màn hình: 13.4 inch 3.5K OLED; CPU: Intel Core i7-1360P; RAM: 16GB; SSD: 512GB', 1),
(3, 'ROG Zephyrus G14', 'Màn hình gaming 120Hz, hiệu năng cực đỉnh trong thiết kế nhỏ gọn.', 37500000.0, 20, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600', '', 1, 'Asus', 1, 41500000.0, 37500000.0, 9, 4.9, 540, 'Màn hình: 14 inch QHD+ 120Hz; CPU: AMD Ryzen 9; GPU: RTX 4060; RAM: 16GB', 1),
(4, 'Lenovo ThinkPad X1 Carbon', 'Laptop doanh nhân huyền thoại, bàn phím gõ siêu êm, siêu bền bỉ.', 45000000.0, 10, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600', '', 1, 'Lenovo', 0, 49000000.0, 45000000.0, 8, 4.7, 95, 'Màn hình: 14 inch WUXGA; CPU: Intel Core i7-1355U; RAM: 16GB; SSD: 1TB', 1),
(5, 'iPhone 15 Pro Max', 'Chip A17 Pro mạnh mẽ, khung viền Titan siêu bền nhẹ.', 31990000.0, 50, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600', '', 2, 'Apple', 1, 35000000.0, 31990000.0, 8, 4.9, 1250, 'Màn hình: 6.7 inch Super Retina XDR; Chip: A17 Pro; Camera: 48MP; Pin: 29 giờ', 1),
(6, 'Samsung Galaxy S24 Ultra', 'Bút S Pen huyền thoại, camera zoom 100x kèm AI thông minh.', 28500000.0, 45, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600', '', 2, 'Samsung', 1, 33500000.0, 28500000.0, 14, 4.9, 980, 'Màn hình: 6.8 inch Dynamic AMOLED 2X; Chip: Snapdragon 8 Gen 3; Pin: 5000mAh', 1),
(7, 'Google Pixel 8 Pro', 'Trải nghiệm Android thuần khiết, camera chụp ảnh đêm siêu đỉnh.', 21500000.0, 25, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600', '', 2, 'Google', 0, 24500000.0, 21500000.0, 12, 4.6, 310, 'Màn hình: 6.7 inch LTPO OLED; Chip: Google Tensor G3; RAM: 12GB; Pin: 5050mAh', 1),
(8, 'Xiaomi 14 Ultra', 'Ống kính Leica cao cấp, cảm biến 1 inch siêu nhạy sáng.', 26990000.0, 18, 'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&q=80&w=600', '', 2, 'Xiaomi', 0, 29990000.0, 26990000.0, 10, 4.7, 180, 'Màn hình: 6.73 inch AMOLED 120Hz; Chip: Snapdragon 8 Gen 3; Sạc nhanh: 90W', 1),
(9, 'Apple Watch Series 9', 'Cảm biến nhịp tim thế hệ mới, đo nồng độ oxy trong máu chính xác.', 9200000.0, 100, 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=600', '', 3, 'Apple', 0, 10500000.0, 9200000.0, 12, 4.7, 420, 'Kích thước: 45mm; Màn hình: Always-On Retina; Pin: 18 giờ', 1),
(10, 'Galaxy Watch6 Classic', 'Vòng xoay bezel vật lý sành điệu, đo thành phần cơ thể chi tiết.', 6990000.0, 60, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600', '', 3, 'Samsung', 0, 8500000.0, 6990000.0, 17, 4.6, 310, 'Kích thước: 47mm; Màn hình: Sapphire Crystal; Pin: 40 giờ', 1),
(11, 'Garmin Fenix 7 Pro', 'Đồng hồ thể thao chuyên nghiệp, định vị GPS đa băng tần siêu chuẩn.', 18500000.0, 15, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600', '', 3, 'Garmin', 1, 19900000.0, 18500000.0, 7, 4.8, 120, 'Màn hình: MIP chống chói; Thời lượng pin: Lên đến 18 ngày ở chế độ Smartwatch', 1),
(12, 'Huawei Watch GT 4', 'Thiết kế thời trang sang trọng, pin trâu 14 ngày sử dụng liên tục.', 4990000.0, 40, 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600', '', 3, 'Huawei', 0, 5990000.0, 4990000.0, 16, 4.5, 230, 'Kích thước: 46mm; Màn hình: AMOLED; Tương thích: iOS & Android', 1),
(13, 'Sony WH-1000XM5', 'Chống ồn chủ động đỉnh cao nhất thị trường, âm thanh hi-res sắc nét.', 6800000.0, 35, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600', '', 4, 'Sony', 1, 8490000.0, 6800000.0, 20, 4.8, 640, 'Loại tai nghe: Over-ear; Kết nối: Bluetooth 5.2; Thời lượng pin: 30 giờ', 1),
(14, 'AirPods Pro Gen 2', 'Chống ồn thích ứng thông minh, kết nối nhanh chóng hệ sinh thái Apple.', 5590000.0, 70, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=600', '', 4, 'Apple', 1, 6190000.0, 5590000.0, 9, 4.8, 920, 'Chip: Apple H2; Chống nước: IPX4; Pin: 6 giờ (tai nghe) + 24 giờ (hộp sạc)', 1),
(15, 'Marshall Major IV', 'Thiết kế retro cổ điển cá tính, thời lượng pin lên đến 80 giờ.', 3600000.0, 22, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600', '', 4, 'Marshall', 0, 4200000.0, 3600000.0, 14, 4.7, 195, 'Thời lượng pin: 80 giờ; Sạc không dây: Có hỗ trợ; Driver: 40mm', 1),
(16, 'Bose QuietComfort Ultra', 'Âm thanh vòm sống động, đeo tai êm ái cả ngày dài.', 9900000.0, 15, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600', '', 4, 'Bose', 0, 10900000.0, 9900000.0, 9, 4.7, 105, 'Loại: Over-ear; Chế độ: Quiet, Aware, Immersion; Pin: 24 giờ', 1),
(17, 'Sạc nhanh Anker GaNPrime 65W', 'Công nghệ GaN nhỏ gọn, 3 cổng sạc tiện lợi cùng lúc.', 890000.0, 120, 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=600', '', 5, 'Anker', 1, 1200000.0, 890000.0, 25, 4.9, 1450, 'Cổng: 2x USB-C, 1x USB-A; Công suất: 65W Max; Bảo vệ chống quá nhiệt', 1),
(18, 'Chuột không dây Logitech MX Master 3S', 'Cảm biến 8K DPI cực nhạy, nút cuộn MagSpeed siêu nhanh.', 2490000.0, 50, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600', '', 5, 'Logitech', 1, 2990000.0, 2490000.0, 16, 4.8, 880, 'Cảm biến: Darkfield 8000 DPI; Kết nối: Logi Bolt & Bluetooth; Pin sạc qua USB-C', 1),
(19, 'Bàn phím cơ Keychron K2 V2', 'Bàn phím cơ không dây nhỏ gọn Layout 75% thời thượng.', 1850000.0, 30, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600', '', 5, 'Keychron', 0, 2100000.0, 1850000.0, 11, 4.7, 340, 'Số phím: 84 phím; Switch: Gateron Mechanical; Hotswap: Có hỗ trợ', 1),
(20, 'Hub chuyển đổi Baseus 8 in 1', 'Mở rộng 8 cổng tiện dụng kết nối tivi máy chiếu thẻ nhớ.', 750000.0, 80, 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=600', '', 5, 'Baseus', 0, 950000.0, 750000.0, 21, 4.6, 210, 'Cổng kết nối: HDMI 4K, 3x USB 3.0, SD/TF, LAN RJ45, USB-C PD 100W', 1);

-- 4. Chèn dữ liệu bảng Carts
INSERT INTO `carts` (`id`, `user_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20);

-- 5. Chèn dữ liệu bảng Cart Items
INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`) VALUES
(1, 1, 2, 2),
(2, 2, 3, 3),
(3, 3, 4, 1),
(4, 4, 5, 2),
(5, 5, 6, 3),
(6, 6, 7, 1),
(7, 7, 8, 2),
(8, 8, 9, 3),
(9, 9, 10, 1),
(10, 10, 11, 2),
(11, 11, 12, 3),
(12, 12, 13, 1),
(13, 13, 14, 2),
(14, 14, 15, 3),
(15, 15, 16, 1),
(16, 16, 17, 2),
(17, 17, 18, 3),
(18, 18, 19, 1),
(19, 19, 20, 2),
(20, 20, 1, 3);

-- 6. Chèn dữ liệu bảng Orders
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `payment_method`, `shipping_address`, `phone_number`, `applied_coupon_code`, `coupon_discount`) VALUES
(1, 1, 250000.0, 'PENDING', 'COD', 'Số 10 Đường Láng, Đống Đa, Hà Nội', '0912345601', NULL, 25000.0),
(2, 2, 500000.0, 'PAID', 'VNPAY', 'Số 20 Đường Láng, Đống Đa, Hà Nội', '0912345602', 'TECHNOVA10', 0.0),
(3, 3, 750000.0, 'DELIVERED', 'COD', 'Số 30 Đường Láng, Đống Đa, Hà Nội', '0912345603', NULL, 25000.0),
(4, 4, 1000000.0, 'PAID', 'VNPAY', 'Số 40 Đường Láng, Đống Đa, Hà Nội', '0912345604', 'TECHNOVA10', 0.0),
(5, 5, 1250000.0, 'SHIPPING', 'COD', 'Số 50 Đường Láng, Đống Đa, Hà Nội', '0912345605', NULL, 25000.0),
(6, 6, 1500000.0, 'PAID', 'VNPAY', 'Số 60 Đường Láng, Đống Đa, Hà Nội', '0912345606', 'TECHNOVA10', 0.0),
(7, 7, 1750000.0, 'PENDING', 'COD', 'Số 70 Đường Láng, Đống Đa, Hà Nội', '0912345607', NULL, 25000.0),
(8, 8, 2000000.0, 'PAID', 'VNPAY', 'Số 80 Đường Láng, Đống Đa, Hà Nội', '0912345608', 'TECHNOVA10', 0.0),
(9, 9, 2250000.0, 'DELIVERED', 'COD', 'Số 90 Đường Láng, Đống Đa, Hà Nội', '0912345609', NULL, 25000.0),
(10, 10, 2500000.0, 'PAID', 'VNPAY', 'Số 100 Đường Láng, Đống Đa, Hà Nội', '0912345610', 'TECHNOVA10', 0.0),
(11, 11, 2750000.0, 'PENDING', 'COD', 'Số 110 Đường Láng, Đống Đa, Hà Nội', '0912345611', NULL, 25000.0),
(12, 12, 3000000.0, 'PAID', 'VNPAY', 'Số 120 Đường Láng, Đống Đa, Hà Nội', '0912345612', 'TECHNOVA10', 0.0),
(13, 13, 3250000.0, 'PENDING', 'COD', 'Số 130 Đường Láng, Đống Đa, Hà Nội', '0912345613', NULL, 25000.0),
(14, 14, 3500000.0, 'PAID', 'VNPAY', 'Số 140 Đường Láng, Đống Đa, Hà Nội', '0912345614', 'TECHNOVA10', 0.0),
(15, 15, 3750000.0, 'DELIVERED', 'COD', 'Số 150 Đường Láng, Đống Đa, Hà Nội', '0912345615', NULL, 25000.0),
(16, 16, 4000000.0, 'PAID', 'VNPAY', 'Số 160 Đường Láng, Đống Đa, Hà Nội', '0912345616', 'TECHNOVA10', 0.0),
(17, 17, 4250000.0, 'PENDING', 'COD', 'Số 170 Đường Láng, Đống Đa, Hà Nội', '0912345617', NULL, 25000.0),
(18, 18, 4500000.0, 'PAID', 'VNPAY', 'Số 180 Đường Láng, Đống Đa, Hà Nội', '0912345618', 'TECHNOVA10', 0.0),
(19, 19, 4750000.0, 'PENDING', 'COD', 'Số 190 Đường Láng, Đống Đa, Hà Nội', '0912345619', NULL, 25000.0),
(20, 20, 5000000.0, 'PAID', 'VNPAY', 'Số 200 Đường Láng, Đống Đa, Hà Nội', '0912345620', 'TECHNOVA10', 0.0);

-- 7. Chèn dữ liệu bảng Order Items
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 2, 23990000.0),
(2, 2, 2, 1, 41000000.0),
(3, 3, 3, 2, 37500000.0),
(4, 4, 4, 1, 45000000.0),
(5, 5, 5, 2, 31990000.0),
(6, 6, 6, 1, 28500000.0),
(7, 7, 7, 2, 21500000.0),
(8, 8, 8, 1, 26990000.0),
(9, 9, 9, 2, 9200000.0),
(10, 10, 10, 1, 6990000.0),
(11, 11, 11, 2, 18500000.0),
(12, 12, 12, 1, 4990000.0),
(13, 13, 13, 2, 6800000.0),
(14, 14, 14, 1, 5590000.0),
(15, 15, 15, 2, 3600000.0),
(16, 16, 16, 1, 9900000.0),
(17, 17, 17, 2, 890000.0),
(18, 18, 18, 1, 2490000.0),
(19, 19, 19, 2, 1850000.0),
(20, 20, 20, 1, 750000.0);

-- 8. Chèn dữ liệu bảng Payment Transactions
INSERT INTO `payment_transactions` (`id`, `order_id`, `vnp_txn_ref`, `vnp_transaction_no`, `vnp_response_code`, `vnp_amount`, `vnp_bank_code`, `vnp_pay_date`, `vnp_transaction_status`, `secure_hash`, `raw_data`) VALUES
(1, 1, 'TXNREF1001', 'TRANSNO2001', '00', 23990000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(2, 2, 'TXNREF1002', 'TRANSNO2002', '00', 41000000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(3, 3, 'TXNREF1003', 'TRANSNO2003', '00', 37500000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(4, 4, 'TXNREF1004', 'TRANSNO2004', '00', 45000000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(5, 5, 'TXNREF1005', 'TRANSNO2005', '00', 31990000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(6, 6, 'TXNREF1006', 'TRANSNO2006', '00', 28500000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(7, 7, 'TXNREF1007', 'TRANSNO2007', '00', 21500000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(8, 8, 'TXNREF1008', 'TRANSNO2008', '00', 26990000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(9, 9, 'TXNREF1009', 'TRANSNO2009', '00', 9200000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(10, 10, 'TXNREF1010', 'TRANSNO2010', '00', 6990000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(11, 11, 'TXNREF1011', 'TRANSNO2011', '00', 18500000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(12, 12, 'TXNREF1012', 'TRANSNO2012', '00', 4990000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(13, 13, 'TXNREF1013', 'TRANSNO2013', '00', 6800000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(14, 14, 'TXNREF1014', 'TRANSNO2014', '00', 5590000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(15, 15, 'TXNREF1015', 'TRANSNO2015', '00', 3600000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(16, 16, 'TXNREF1016', 'TRANSNO2016', '00', 9900000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(17, 17, 'TXNREF1017', 'TRANSNO2017', '00', 890000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(18, 18, 'TXNREF1018', 'TRANSNO2018', '00', 2490000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(19, 19, 'TXNREF1019', 'TRANSNO2019', '00', 1850000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}'),
(20, 20, 'TXNREF1020', 'TRANSNO2020', '00', 750000.0, 'NCB', '20260702100000', '00', 'SECUREHASH12345', '{"status":"success","code":"00"}');

-- 9. Chèn dữ liệu bảng Notifications
INSERT INTO `notifications` (`id`, `recipient_id`, `message`, `type`, `is_read`) VALUES
(1, '1', 'Đơn hàng #1 của bạn đã được cập nhật trạng thái.', 'SYSTEM', 1),
(2, '2', 'Đơn hàng #2 của bạn đã được cập nhật trạng thái.', 'ORDER', 0),
(3, '3', 'Đơn hàng #3 của bạn đã được cập nhật trạng thái.', 'SYSTEM', 1),
(4, '4', 'Đơn hàng #4 của bạn đã được cập nhật trạng thái.', 'ORDER', 0),
(5, 'admin', 'Đơn hàng #5 của bạn đã được cập nhật trạng thái.', 'SYSTEM', 1),
(6, '6', 'Đơn hàng #6 của bạn đã được cập nhật trạng thái.', 'ORDER', 0),
(7, '7', 'Đơn hàng #7 của bạn đã được cập nhật trạng thái.', 'SYSTEM', 1),
(8, '8', 'Đơn hàng #8 của bạn đã được cập nhật trạng thái.', 'ORDER', 0),
(9, '9', 'Đơn hàng #9 của bạn đã được cập nhật trạng thái.', 'SYSTEM', 1),
(10, 'admin', 'Đơn hàng #10 của bạn đã được cập nhật trạng thái.', 'ORDER', 0),
(11, '11', 'Đơn hàng #11 của bạn đã được cập nhật trạng thái.', 'SYSTEM', 1),
(12, '12', 'Đơn hàng #12 của bạn đã được cập nhật trạng thái.', 'ORDER', 0),
(13, '13', 'Đơn hàng #13 của bạn đã được cập nhật trạng thái.', 'SYSTEM', 1),
(14, '14', 'Đơn hàng #14 của bạn đã được cập nhật trạng thái.', 'ORDER', 0),
(15, 'admin', 'Đơn hàng #15 của bạn đã được cập nhật trạng thái.', 'SYSTEM', 1),
(16, '16', 'Đơn hàng #16 của bạn đã được cập nhật trạng thái.', 'ORDER', 0),
(17, '17', 'Đơn hàng #17 của bạn đã được cập nhật trạng thái.', 'SYSTEM', 1),
(18, '18', 'Đơn hàng #18 của bạn đã được cập nhật trạng thái.', 'ORDER', 0),
(19, '19', 'Đơn hàng #19 của bạn đã được cập nhật trạng thái.', 'SYSTEM', 1),
(20, 'admin', 'Đơn hàng #20 của bạn đã được cập nhật trạng thái.', 'ORDER', 0);

-- 10. Chèn dữ liệu bảng Chat Messages
INSERT INTO `chat_messages` (`id`, `sender`, `sender_id`, `recipient_id`, `content`, `type`, `email`, `full_name`, `is_bot_response`) VALUES
(1, 'Khách hàng 1', 'user-1', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 1', 'CHAT', 'user1@gmail.com', 'Nguyễn Văn A', 0),
(2, 'Khách hàng 2', 'user-2', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 2', 'CHAT', 'user2@gmail.com', 'Nguyễn Văn B', 0),
(3, 'Khách hàng 3', 'user-3', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 3', 'CHAT', 'user3@gmail.com', 'Nguyễn Văn C', 0),
(4, 'Khách hàng 4', 'user-4', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 4', 'CHAT', 'user4@gmail.com', 'Nguyễn Văn D', 0),
(5, 'Khách hàng 5', 'user-5', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 5', 'CHAT', 'user5@gmail.com', 'Nguyễn Văn E', 0),
(6, 'Khách hàng 6', 'user-6', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 6', 'CHAT', 'user6@gmail.com', 'Nguyễn Văn F', 0),
(7, 'Khách hàng 7', 'user-7', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 7', 'CHAT', 'user7@gmail.com', 'Nguyễn Văn G', 0),
(8, 'Khách hàng 8', 'user-8', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 8', 'CHAT', 'user8@gmail.com', 'Nguyễn Văn H', 0),
(9, 'Khách hàng 9', 'user-9', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 9', 'CHAT', 'user9@gmail.com', 'Nguyễn Văn I', 0),
(10, 'Khách hàng 10', 'user-10', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 10', 'CHAT', 'user10@gmail.com', 'Nguyễn Văn J', 0),
(11, 'Khách hàng 11', 'user-11', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 11', 'CHAT', 'user11@gmail.com', 'Nguyễn Văn K', 0),
(12, 'Khách hàng 12', 'user-12', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 12', 'CHAT', 'user12@gmail.com', 'Nguyễn Văn L', 0),
(13, 'Khách hàng 13', 'user-13', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 13', 'CHAT', 'user13@gmail.com', 'Nguyễn Văn M', 0),
(14, 'Khách hàng 14', 'user-14', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 14', 'CHAT', 'user14@gmail.com', 'Nguyễn Văn N', 0),
(15, 'Khách hàng 15', 'user-15', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 15', 'CHAT', 'user15@gmail.com', 'Nguyễn Văn O', 0),
(16, 'Khách hàng 16', 'user-16', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 16', 'CHAT', 'user16@gmail.com', 'Nguyễn Văn P', 0),
(17, 'Khách hàng 17', 'user-17', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 17', 'CHAT', 'user17@gmail.com', 'Nguyễn Văn Q', 0),
(18, 'Khách hàng 18', 'user-18', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 18', 'CHAT', 'user18@gmail.com', 'Nguyễn Văn R', 0),
(19, 'Khách hàng 19', 'user-19', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 19', 'CHAT', 'user19@gmail.com', 'Nguyễn Văn S', 0),
(20, 'Khách hàng 20', 'user-20', 'admin', 'Chào admin, tôi muốn hỏi về sản phẩm số 20', 'CHAT', 'user20@gmail.com', 'Nguyễn Văn T', 0);

-- 11. Chèn dữ liệu bảng User Addresses
INSERT INTO `user_addresses` (`id`, `user_id`, `full_name`, `phone_number`, `province`, `ward`, `detail_address`, `is_default`) VALUES
(1, 1, 'Nguyễn Văn A', '0912345601', 'TP Hồ Chí Minh', 'Bến Nghé', 'Số 5 Ngõ 1, Phố Chùa Láng', 1),
(2, 2, 'Nguyễn Văn B', '0912345602', 'Hà Nội', 'Láng Thượng', 'Số 10 Ngõ 2, Phố Chùa Láng', 1),
(3, 3, 'Nguyễn Văn C', '0912345603', 'TP Hồ Chí Minh', 'Bến Nghé', 'Số 15 Ngõ 3, Phố Chùa Láng', 1),
(4, 4, 'Nguyễn Văn D', '0912345604', 'Hà Nội', 'Láng Thượng', 'Số 20 Ngõ 4, Phố Chùa Láng', 1),
(5, 5, 'Nguyễn Văn E', '0912345605', 'TP Hồ Chí Minh', 'Bến Nghé', 'Số 25 Ngõ 5, Phố Chùa Láng', 1),
(6, 6, 'Nguyễn Văn F', '0912345606', 'Hà Nội', 'Láng Thượng', 'Số 30 Ngõ 6, Phố Chùa Láng', 1),
(7, 7, 'Nguyễn Văn G', '0912345607', 'TP Hồ Chí Minh', 'Bến Nghé', 'Số 35 Ngõ 7, Phố Chùa Láng', 1),
(8, 8, 'Nguyễn Văn H', '0912345608', 'Hà Nội', 'Láng Thượng', 'Số 40 Ngõ 8, Phố Chùa Láng', 1),
(9, 9, 'Nguyễn Văn I', '0912345609', 'TP Hồ Chí Minh', 'Bến Nghé', 'Số 45 Ngõ 9, Phố Chùa Láng', 1),
(10, 10, 'Nguyễn Văn J', '0912345610', 'Hà Nội', 'Láng Thượng', 'Số 50 Ngõ 10, Phố Chùa Láng', 1),
(11, 11, 'Nguyễn Văn K', '0912345611', 'TP Hồ Chí Minh', 'Bến Nghé', 'Số 55 Ngõ 11, Phố Chùa Láng', 1),
(12, 12, 'Nguyễn Văn L', '0912345612', 'Hà Nội', 'Láng Thượng', 'Số 60 Ngõ 12, Phố Chùa Láng', 1),
(13, 13, 'Nguyễn Văn M', '0912345613', 'TP Hồ Chí Minh', 'Bến Nghé', 'Số 65 Ngõ 13, Phố Chùa Láng', 1),
(14, 14, 'Nguyễn Văn N', '0912345614', 'Hà Nội', 'Láng Thượng', 'Số 70 Ngõ 14, Phố Chùa Láng', 1),
(15, 15, 'Nguyễn Văn O', '0912345615', 'TP Hồ Chí Minh', 'Bến Nghé', 'Số 75 Ngõ 15, Phố Chùa Láng', 1),
(16, 16, 'Nguyễn Văn P', '0912345616', 'Hà Nội', 'Láng Thượng', 'Số 80 Ngõ 16, Phố Chùa Láng', 1),
(17, 17, 'Nguyễn Văn Q', '0912345617', 'TP Hồ Chí Minh', 'Bến Nghé', 'Số 85 Ngõ 17, Phố Chùa Láng', 1),
(18, 18, 'Nguyễn Văn R', '0912345618', 'Hà Nội', 'Láng Thượng', 'Số 90 Ngõ 18, Phố Chùa Láng', 1),
(19, 19, 'Nguyễn Văn S', '0912345619', 'TP Hồ Chí Minh', 'Bến Nghé', 'Số 95 Ngõ 19, Phố Chùa Láng', 1),
(20, 20, 'Nguyễn Văn T', '0912345620', 'Hà Nội', 'Láng Thượng', 'Số 100 Ngõ 20, Phố Chùa Láng', 1);

-- 12. Chèn dữ liệu bảng Coupons
INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `min_order_amount`, `max_discount_amount`, `usage_limit`, `used_count`, `is_active`, `expires_at`) VALUES
(1, 'COUPON01', 'FIXED', 50000.0, 0.0, 200000.0, 100, 1, 1, '2026-12-31 23:59:59'),
(2, 'COUPON02', 'PERCENT', 10.0, 100000.0, 100000.0, 100, 2, 1, '2026-12-31 23:59:59'),
(3, 'COUPON03', 'FIXED', 50000.0, 0.0, 200000.0, 100, 3, 1, '2026-12-31 23:59:59'),
(4, 'COUPON04', 'PERCENT', 10.0, 100000.0, 100000.0, 100, 4, 1, '2026-12-31 23:59:59'),
(5, 'COUPON05', 'FIXED', 50000.0, 0.0, 200000.0, 100, 5, 1, '2026-12-31 23:59:59'),
(6, 'COUPON06', 'PERCENT', 10.0, 100000.0, 100000.0, 100, 6, 1, '2026-12-31 23:59:59'),
(7, 'COUPON07', 'FIXED', 50000.0, 0.0, 200000.0, 100, 7, 1, '2026-12-31 23:59:59'),
(8, 'COUPON08', 'PERCENT', 10.0, 100000.0, 100000.0, 100, 8, 1, '2026-12-31 23:59:59'),
(9, 'COUPON09', 'FIXED', 50000.0, 0.0, 200000.0, 100, 9, 1, '2026-12-31 23:59:59'),
(10, 'COUPON10', 'PERCENT', 10.0, 100000.0, 100000.0, 100, 10, 1, '2026-12-31 23:59:59'),
(11, 'COUPON11', 'FIXED', 50000.0, 0.0, 200000.0, 100, 11, 1, '2026-12-31 23:59:59'),
(12, 'COUPON12', 'PERCENT', 10.0, 100000.0, 100000.0, 100, 12, 1, '2026-12-31 23:59:59'),
(13, 'COUPON13', 'FIXED', 50000.0, 0.0, 200000.0, 100, 13, 1, '2026-12-31 23:59:59'),
(14, 'COUPON14', 'PERCENT', 10.0, 100000.0, 100000.0, 100, 14, 1, '2026-12-31 23:59:59'),
(15, 'COUPON15', 'FIXED', 50000.0, 0.0, 200000.0, 100, 15, 1, '2026-12-31 23:59:59'),
(16, 'COUPON16', 'PERCENT', 10.0, 100000.0, 100000.0, 100, 16, 1, '2026-12-31 23:59:59'),
(17, 'COUPON17', 'FIXED', 50000.0, 0.0, 200000.0, 100, 17, 1, '2026-12-31 23:59:59'),
(18, 'COUPON18', 'PERCENT', 10.0, 100000.0, 100000.0, 100, 18, 1, '2026-12-31 23:59:59'),
(19, 'COUPON19', 'FIXED', 50000.0, 0.0, 200000.0, 100, 19, 1, '2026-12-31 23:59:59'),
(20, 'COUPON20', 'PERCENT', 10.0, 100000.0, 100000.0, 100, 20, 1, '2026-12-31 23:59:59');

-- 13. Chèn dữ liệu bảng Product Reviews
INSERT INTO `product_reviews` (`id`, `product_id`, `user_id`, `rating`, `comment`, `is_verified_purchase`, `is_approved`) VALUES
(1, 1, 3, 5, 'Sản phẩm MacBook Air M2 13" dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(2, 2, 4, 4, 'Sản phẩm Dell XPS 13 Plus dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(3, 3, 5, 5, 'Sản phẩm ROG Zephyrus G14 dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(4, 4, 6, 4, 'Sản phẩm Lenovo ThinkPad X1 Carbon dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(5, 5, 7, 5, 'Sản phẩm iPhone 15 Pro Max dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(6, 6, 8, 4, 'Sản phẩm Samsung Galaxy S24 Ultra dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(7, 7, 9, 5, 'Sản phẩm Google Pixel 8 Pro dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(8, 8, 10, 4, 'Sản phẩm Xiaomi 14 Ultra dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(9, 9, 11, 5, 'Sản phẩm Apple Watch Series 9 dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(10, 10, 12, 4, 'Sản phẩm Galaxy Watch6 Classic dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(11, 11, 13, 5, 'Sản phẩm Garmin Fenix 7 Pro dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(12, 12, 14, 4, 'Sản phẩm Huawei Watch GT 4 dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(13, 13, 15, 5, 'Sản phẩm Sony WH-1000XM5 dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(14, 14, 16, 4, 'Sản phẩm AirPods Pro Gen 2 dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(15, 15, 17, 5, 'Sản phẩm Marshall Major IV dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(16, 16, 18, 4, 'Sản phẩm Bose QuietComfort Ultra dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(17, 17, 19, 5, 'Sản phẩm Sạc nhanh Anker GaNPrime 65W dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(18, 18, 20, 4, 'Sản phẩm Chuột không dây Logitech MX Master 3S dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(19, 19, 2, 5, 'Sản phẩm Bàn phím cơ Keychron K2 V2 dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1),
(20, 20, 3, 4, 'Sản phẩm Hub chuyển đổi Baseus 8 in 1 dùng rất tốt, hài lòng với chất lượng dịch vụ!', 1, 1);

-- 14. Chèn dữ liệu bảng Wishlists
INSERT INTO `wishlists` (`id`, `user_id`, `product_id`) VALUES
(1, 3, 7),
(2, 4, 8),
(3, 5, 9),
(4, 6, 10),
(5, 7, 11),
(6, 8, 12),
(7, 9, 13),
(8, 10, 14),
(9, 11, 15),
(10, 12, 16),
(11, 13, 17),
(12, 14, 18),
(13, 15, 19),
(14, 16, 20),
(15, 17, 1),
(16, 18, 2),
(17, 19, 3),
(18, 20, 4),
(19, 2, 5),
(20, 3, 6);

-- 15. Chèn dữ liệu bảng User Product Views
INSERT INTO `user_product_views` (`id`, `user_id`, `product_id`, `view_count`) VALUES
(1, 3, 1, 2),
(2, 4, 2, 3),
(3, 5, 3, 4),
(4, 6, 4, 5),
(5, 7, 5, 1),
(6, 8, 6, 2),
(7, 9, 7, 3),
(8, 10, 8, 4),
(9, 11, 9, 5),
(10, 12, 10, 1),
(11, 13, 11, 2),
(12, 14, 12, 3),
(13, 15, 13, 4),
(14, 16, 14, 5),
(15, 17, 15, 1),
(16, 18, 16, 2),
(17, 19, 17, 3),
(18, 20, 18, 4),
(19, 2, 19, 5),
(20, 3, 20, 1);

-- 16. Chèn dữ liệu bảng Banners
INSERT INTO `banners` (`id`, `title`, `image_url`, `link_url`, `sort_order`, `is_active`) VALUES
(1, 'Sự kiện khuyến mãi mùa hè 1', 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Apple', 1, 1),
(2, 'Sự kiện khuyến mãi mùa hè 2', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Dell', 2, 1),
(3, 'Sự kiện khuyến mãi mùa hè 3', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Asus', 3, 1),
(4, 'Sự kiện khuyến mãi mùa hè 4', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Lenovo', 4, 1),
(5, 'Sự kiện khuyến mãi mùa hè 5', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Apple', 5, 1),
(6, 'Sự kiện khuyến mãi mùa hè 6', 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Samsung', 6, 1),
(7, 'Sự kiện khuyến mãi mùa hè 7', 'https://images.unsplash.com/photo-1504274066654-fa55935398ab?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Google', 7, 1),
(8, 'Sự kiện khuyến mãi mùa hè 8', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Xiaomi', 8, 1),
(9, 'Sự kiện khuyến mãi mùa hè 9', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Apple', 9, 1),
(10, 'Sự kiện khuyến mãi mùa hè 10', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Samsung', 10, 1),
(11, 'Sự kiện khuyến mãi mùa hè 11', 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Garmin', 11, 1),
(12, 'Sự kiện khuyến mãi mùa hè 12', 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Huawei', 12, 1),
(13, 'Sự kiện khuyến mãi mùa hè 13', 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Sony', 13, 1),
(14, 'Sự kiện khuyến mãi mùa hè 14', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Apple', 14, 1),
(15, 'Sự kiện khuyến mãi mùa hè 15', 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Marshall', 15, 1),
(16, 'Sự kiện khuyến mãi mùa hè 16', 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Bose', 16, 1),
(17, 'Sự kiện khuyến mãi mùa hè 17', 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Anker', 17, 1),
(18, 'Sự kiện khuyến mãi mùa hè 18', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Logitech', 18, 1),
(19, 'Sự kiện khuyến mãi mùa hè 19', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Keychron', 19, 1),
(20, 'Sự kiện khuyến mãi mùa hè 20', 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=1200&h=400', '/products?brand=Baseus', 20, 1);