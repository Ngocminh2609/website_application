-- ==========================================================
-- Bổ sung bảng cho hệ thống Đơn hàng và Thanh toán
-- ==========================================================

USE ecommerce_db;

-- 1. Bảng Đơn hàng (Orders)
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

-- 2. Bảng Chi tiết đơn hàng (Order Items)
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

-- 3. Bảng Ghi nhận giao dịch (Payment Transactions)
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
