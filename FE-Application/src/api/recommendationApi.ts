import { apiClient } from './apiClient';
import type { Product } from '../types/product';

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = '/recommendations';

// ─── API ─────────────────────────────────────────────────────────────────────

/**
 * Service quản lý các yêu cầu liên quan đến Gợi ý sản phẩm (Recommendations).
 */
export const recommendationApi = {
    /**
     * Gửi tín hiệu theo dõi lượt xem sản phẩm lên Server.
     * @param productId - ID sản phẩm được xem.
     */
    trackView: (productId: number): Promise<void> =>
        apiClient.fetch<void>(`${BASE_PATH}/track/${productId}`, { method: 'POST' }),

    /**
     * Lấy danh sách sản phẩm gợi ý cá nhân hóa từ Server.
     * @param limit - Số lượng sản phẩm gợi ý (mặc định là 10).
     * @returns Danh sách `Product` được gợi ý.
     */
    getPersonalized: (limit: number = 10): Promise<Product[]> =>
        apiClient.fetch<Product[]>(`${BASE_PATH}/personal?limit=${limit}`),
};
