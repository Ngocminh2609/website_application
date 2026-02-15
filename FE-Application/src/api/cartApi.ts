import { apiClient } from './apiClient';
import type { Cart } from '../types/cart';

/**
 * Service quản lý các yêu cầu liên quan đến Giỏ hàng.
 */
export const cartApi = {
    // Lấy giỏ hàng của người dùng hiện tại
    getCart: () => apiClient.fetch<Cart>('/cart'),

    // Thêm sản phẩm vào giỏ hàng
    addToCart: (productId: number, quantity: number = 1) => apiClient.fetch<Cart>('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
    }),

    // Cập nhật số lượng mặt hàng trong giỏ
    updateQuantity: (itemId: number, quantity: number) => apiClient.fetch<Cart>(`/cart/update/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
    }),

    // Xóa một mặt hàng khỏi giỏ
    removeItem: (itemId: number) => apiClient.fetch<Cart>(`/cart/item/${itemId}`, {
        method: 'DELETE',
    }),
};
