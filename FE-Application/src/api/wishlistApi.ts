import { apiClient } from './apiClient';
import type { Product } from '../types/product';

/**
 * Service xử lý các yêu cầu liên quan đến danh sách yêu thích (Wishlist).
 */
const wishlistApi = {
    /**
     * Lấy danh sách sản phẩm yêu thích của người dùng.
     */
    getWishlist: () =>
        apiClient.fetch<Product[]>('/wishlist'),

    /**
     * Thêm sản phẩm vào danh sách yêu thích.
     */
    addToWishlist: (productId: number) =>
        apiClient.fetch<{ message: string }>(`/wishlist/${productId}`, {
            method: 'POST'
        }),

    /**
     * Xóa sản phẩm khỏi danh sách yêu thích.
     */
    removeFromWishlist: (productId: number) =>
        apiClient.fetch<{ message: string }>(`/wishlist/${productId}`, {
            method: 'DELETE'
        }),

    /**
     * Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa.
     */
    checkWishlist: (productId: number) =>
        apiClient.fetch<{ isInWishlist: boolean }>(`/wishlist/check/${productId}`)
};

export default wishlistApi;
