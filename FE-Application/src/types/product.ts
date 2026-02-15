import type { Category } from './category';

/**
 * Định nghĩa cấu trúc dữ liệu cho thực thể Sản phẩm.
 */
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    category?: Category;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Giao diện cho yêu cầu tạo/cập nhật sản phẩm.
 */
export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    categoryId: number;
}
