import { apiClient } from './apiClient';
import type { Category } from '../types/category';

/**
 * Service quản lý các yêu cầu liên quan đến Danh mục.
 */
export const categoryApi = {
    // Lấy danh sách tất cả danh mục
    getAllCategories: () => apiClient.fetch<Category[]>('/categories'),

    // Lấy chi tiết một danh mục
    getCategoryById: (id: number) => apiClient.fetch<Category>(`/categories/${id}`),

    // Tạo danh mục mới (Yêu cầu quyền ADMIN)
    createCategory: (data: Partial<Category>) => apiClient.fetch<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Cập nhật danh mục (Yêu cầu quyền ADMIN)
    updateCategory: (id: number, data: Partial<Category>) => apiClient.fetch<Category>(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    // Xóa danh mục (Yêu cầu quyền ADMIN)
    deleteCategory: (id: number) => apiClient.fetch<void>(`/categories/${id}`, {
        method: 'DELETE',
    }),
};
