import { apiClient } from './apiClient';
import type { ProductReview } from '../types/coupon-review';

export const reviewApi = {
    getByProduct: (productId: number): Promise<ProductReview[]> =>
        apiClient.fetch<ProductReview[]>(`/reviews/product/${productId}`),

    create: (productId: number, rating: number, comment: string): Promise<ProductReview> =>
        apiClient.fetch<ProductReview>(`/reviews/product/${productId}`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment }),
        }),

    delete: (reviewId: number): Promise<string> =>
        apiClient.fetch<string>(`/reviews/${reviewId}`, { method: 'DELETE' }),

    // Admin methods
    getAllAdmin: (): Promise<ProductReview[]> =>
        apiClient.fetch<ProductReview[]>('/reviews/admin/all'),

    approve: (reviewId: number): Promise<void> =>
        apiClient.fetch(`/reviews/admin/${reviewId}/approve`, { method: 'PUT' }),
};
