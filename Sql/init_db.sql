-- ==========================================================
-- Cơ sở dữ liệu cho dự án Website Bán Hàng Full Stack
-- FE: TypeScript | BE: Spring Boot | DB: MySQL
-- ==========================================================

-- I. KHỞI TẠO CƠ SỞ DỮ LIỆU
CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- II. ĐỊNH NGHĨA CẤU TRÚC BẢNG (DDL - CREATE)

-- 1. Bảng Danh mục (Categories)
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'Tên danh mục sản phẩm',
    image_url VARCHAR(500) COMMENT 'Đường dẫn ảnh đại diện danh mục',
    description TEXT COMMENT 'Mô tả chi tiết về danh mục',
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
    rating DOUBLE DEFAULT 5.0,
    review_count INT DEFAULT 0,
    specifications TEXT COMMENT 'Thông số kỹ thuật của sản phẩm',
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

-- 6. Bảng Đơn hàng (Orders)
CREATE TABLE IF NOT EXISTS `orders` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `total_amount` DECIMAL(19, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, PAID, FAILED, SHIPPING, DELIVERED, CANCELLED',
    `payment_method` VARCHAR(50) DEFAULT 'VNPAY',
    `shipping_address` TEXT,
    `phone_number` VARCHAR(20),
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
    PRIMARY KEY (`id`),
    INDEX (`sender_id`),
    INDEX (`recipient_id`),
    INDEX (`email`),
    INDEX (`created_at`)
) ENGINE = InnoDB;

-- III. CHÈN DỮ LIỆU MẪU (DML - INSERT)

-- 1. Dữ liệu người dùng (Mật khẩu: password123)
-- Admin và User cơ bản
INSERT INTO `users` (`username`, `password`, `email`, `full_name`, `role`) VALUES
('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'admin@technova.com', 'Hệ Thống Admin', 'ADMIN'),
('user1', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user1@gmail.com', 'Nguyễn Văn A', 'USER')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- 2. Danh mục sản phẩm
INSERT INTO categories (id, name, image_url, description) VALUES 
(1, 'Laptop', '', 'Các dòng máy tính xách tay cao cấp, mỏng nhẹ'),
(2, 'SmartPhone', '', 'Điện thoại thông minh trải nghiệm AI'),
(3, 'SmartWatch', '', 'Đồng hồ thông minh theo dõi sức khỏe')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Sản phẩm mẫu
INSERT INTO products (name, description, price, stock_quantity, image_url, more_images, category_id, brand, is_best_seller, original_price, discount_price, rating, review_count, specifications)
VALUES 
('iPhone 15 Pro Max', 'Chip A17 Pro mạnh mẽ, khung viền Titan siêu bền.', 32000000.00, 50, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1692845692711', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium_AV1?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1692845692711,https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium_AV2?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1692845692711', 2, 'Apple', 1, 35000000.00, 31990000.00, 4.9, 1250, 'Màn hình: 6.7 inch Super Retina XDR; Chip: A17 Pro; Camera: 48MP Main | 12MP Ultra Wide | 12MP Telephoto; Pin: Lên đến 29 giờ xem video'),
('MacBook Air M2 13"', 'Thiết kế mỏng nhẹ không tưởng, pin lên đến 18 giờ.', 24500000.00, 30, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-202206?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-202206_AV1?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665', 1, 'Apple', 1, 28000000.00, 23990000.00, 4.8, 850, 'Màn hình: 13.6 inch Liquid Retina; CPU: Apple M2 8-core; RAM: 8GB/16GB; SSD: 256GB/512GB'),
('Apple Watch Series 9', 'Cảm biến nhịp tim, đo nồng độ oxy trong máu.', 9500000.00, 100, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTXG3ref_VW_34FR+watch-45-alum-midnight-nc-s9_VW_34FR_WF_CO?wid=750&hei=750&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1694507905569', '', 3, 'Apple', 0, 10500000.00, 9200000.00, 4.7, 420, 'Kích thước: 41mm/45mm; Màn hình: Always-On Retina; Chip: S9 SiP; Pin: 18 giờ'),
('Samsung Galaxy S24 Ultra', 'Bút S Pen huyền thoại, chip Snapdragon 8 Gen 3 for Galaxy.', 28900000.00, 45, 'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-s928-sm-s928bztqvnn-thumb-539311311', '', 2, 'Samsung', 1, 33500000.00, 28500000.00, 4.9, 980, 'Màn hình: 6.8 inch Dynamic AMOLED 2X; Chip: Snapdragon 8 Gen 3; Camera: 200MP + 12MP + 50MP + 10MP; Bút S Pen: Tích hợp'),
('Galaxy Watch6 Classic', 'Vòng xoay bezel sành điệu, theo dõi giấc ngủ nâng cao.', 7200000.00, 60, 'https://images.samsung.com/is/image/samsung/p6pim/vn/2307/gallery/vn-galaxy-watch6-classic-r960-sm-r965fzsaxvv-thumb-537446146', '', 3, 'Samsung', 0, 8500000.00, 6990000.00, 4.6, 310, 'Màn hình: Sapphire Crystal; Chip: Exynos W930; Pin: 40 giờ'),
('Dell XPS 13 Plus', 'Màn hình 3.5K OLED rực rỡ, bàn phím vô cực.', 42000000.00, 15, 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9315/media-gallery/un-9315-nt-sky-notebook-xps13-9315-sky-gallery-3.psd?wid=800&hei=600&qlt=95', '', 1, 'Dell', 0, 46000000.00, 41000000.00, 4.8, 150, 'Màn hình: 13.4 inch 3.5K OLED; CPU: Intel Core i7-1360P; RAM: 16GB; SSD: 512GB'),
('ROG Zephyrus G14', 'Màn hình 120Hz, sức mạnh gaming trong thân xác văn phòng.', 38000000.00, 20, 'https://dlcdnwebimgs.asus.com/gain/3DCCBA1D-7C61-464A-A8E2-9E46714E2D30/w800', '', 1, 'Asus', 1, 41500000.00, 37500000.00, 4.9, 540, 'Màn hình: 14 inch QHD+ 120Hz; CPU: AMD Ryzen 9; GPU: RTX 4060; RAM: 16GB');

-- 4. Thông báo mẫu (Chào mừng)
INSERT INTO `notifications` (`recipient_id`, `message`, `type`) VALUES
('admin', 'Chào mừng Admin quay trở lại hệ thống!', 'SYSTEM'),
('user-2', 'Chào mừng bạn đến với Tech Nova! Hãy bắt đầu mua sắm ngay.', 'SYSTEM');
