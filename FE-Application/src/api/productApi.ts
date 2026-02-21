import { apiClient } from './apiClient';
import type { Product, ProductRequest } from '../types/product';

/**
 * Service quản lý các yêu cầu liên quan đến Sản phẩm.
 */
export const productApi = {
    // Lấy danh sách sản phẩm đang kinh doanh (Public)
    getAllProducts: () => apiClient.fetch<Product[]>('/products'),

    // Lấy toàn bộ danh sách (Admin)
    getAllAdmin: () => apiClient.fetch<Product[]>('/products/admin'),

    // Tìm kiếm sản phẩm theo ID
    getProductById: (id: number) => apiClient.fetch<Product>(`/products/${id}`),

    // Tìm kiếm sản phẩm theo từ khóa
    searchProducts: (query: string) => apiClient.fetch<Product[]>(`/products/search?query=${query}`),

    // Lấy sản phẩm bán chạy
    getBestSellers: () => apiClient.fetch<Product[]>('/products/best-sellers'),

    // Lấy sản phẩm Flash Sale
    getFlashSales: () => apiClient.fetch<Product[]>('/products/flash-sales'),

    // Lấy sản phẩm theo Hãng
    getProductsByBrand: (brand: string) => apiClient.fetch<Product[]>(`/products/brand/${brand}`),

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

    // Lấy danh sách sản phẩm để so sánh
    getCompareProducts: (ids: number[]) => apiClient.fetch<Product[]>(`/products/compare?ids=${ids.join(',')}`),
};
