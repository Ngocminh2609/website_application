import type { Product } from './product';

/**
 * Kiểu dữ liệu cho một mục trong giỏ hàng.
 */
export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

/**
 * Kiểu dữ liệu cho Giỏ hàng.
 */
export interface Cart {
    id: number;
    items: CartItem[];
    createdAt?: string;
    updatedAt?: string;
}
