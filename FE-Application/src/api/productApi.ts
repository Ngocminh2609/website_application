import { apiClient } from './apiClient';
import type { Product, ProductRequest } from '../types/product';

/**
 * Service quản lý các yêu cầu liên quan đến Sản phẩm.
 */
export const productApi = {
    // Lấy danh sách tất cả sản phẩm
    getAllProducts: () => apiClient.fetch<Product[]>('/products'),

    // Tìm kiếm sản phẩm theo ID
    getProductById: (id: number) => apiClient.fetch<Product>(`/products/${id}`),

    // Tìm kiếm sản phẩm theo từ khóa
    searchProducts: (query: string) => apiClient.fetch<Product[]>(`/products/search?query=${query}`),

    // Tạo sản phẩm mới (Yêu cầu quyền ADMIN)
    createProduct: (data: ProductRequest) => apiClient.fetch<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    // Cập nhật sản phẩm (Yêu cầu quyền ADMIN)
    updateProduct: (id: number, data: Partial<ProductRequest>) => apiClient.fetch<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    // Xóa sản phẩm (Yêu cầu quyền ADMIN)
    deleteProduct: (id: number) => apiClient.fetch<void>(`/products/${id}`, {
        method: 'DELETE',
    }),
};
