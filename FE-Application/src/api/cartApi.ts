import { apiClient } from './apiClient';
import type { Cart } from '../types/cart';

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = '/cart';

// ─── API ─────────────────────────────────────────────────────────────────────

/**
 * Service quản lý các yêu cầu liên quan đến Giỏ hàng.
 */
export const cartApi = {
    /**
     * Lấy giỏ hàng của người dùng hiện tại.
     * @returns Giỏ hàng hiện tại.
     */
    getCart: (): Promise<Cart> =>
        apiClient.fetch<Cart>(BASE_PATH),

    /**
     * Thêm sản phẩm vào giỏ hàng.
     * @param productId - ID sản phẩm cần thêm.
     * @param quantity - Số lượng cần thêm (mặc định là 1).
     * @returns Giỏ hàng sau khi cập nhật.
     */
    addToCart: (productId: number, quantity: number = 1): Promise<Cart> =>
        apiClient.fetch<Cart>(`${BASE_PATH}/add`, {
            method: 'POST',
            body: JSON.stringify({ productId, quantity }),
        }),

    /**
     * Cập nhật số lượng mặt hàng trong giỏ.
     * @param itemId - ID của item trong giỏ hàng.
     * @param quantity - Số lượng mới.
     * @returns Giỏ hàng sau khi cập nhật.
     */
    updateQuantity: (itemId: number, quantity: number): Promise<Cart> =>
        apiClient.fetch<Cart>(`${BASE_PATH}/update/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        }),

    /**
     * Xóa một mặt hàng khỏi giỏ.
     * @param itemId - ID của item cần xóa.
     * @returns Giỏ hàng sau khi xóa.
     */
    removeItem: (itemId: number): Promise<Cart> =>
        apiClient.fetch<Cart>(`${BASE_PATH}/item/${itemId}`, { method: 'DELETE' }),
};
