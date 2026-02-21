import { apiClient } from './apiClient';
import type { Product } from '../types/product';

/**
 * Service quản lý các yêu cầu liên quan đến Gợi ý sản phẩm (Recommendations).
 */
export const recommendationApi = {
    /**
     * Gửi tín hiệu theo dõi lượt xem sản phẩm lên Server.
     */
    trackView: (productId: number) => apiClient.fetch<void>(`/recommendations/track/${productId}`, {
        method: 'POST'
    }),

    /**
     * Lấy danh sách sản phẩm gợi ý cá nhân hóa từ Server.
     */
    getPersonalized: (limit: number = 10) => apiClient.fetch<Product[]>(`/recommendations/personal?limit=${limit}`)
};
