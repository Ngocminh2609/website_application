import { apiClient } from "./apiClient";
import type { Product, ProductRequest } from "../types/product";

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = "/products";

// ─── API ─────────────────────────────────────────────────────────────────────

/**
 * Service quản lý các yêu cầu liên quan đến Sản phẩm.
 */
export const productApi = {
  /**
   * Lấy danh sách sản phẩm đang kinh doanh. (Public)
   * @returns Danh sách `Product`.
   */
  getAllProducts: (): Promise<Product[]> =>
    apiClient.fetch<Product[]>(BASE_PATH),

  /**
   * Lấy toàn bộ danh sách sản phẩm. (Yêu cầu quyền ADMIN)
   * @returns Danh sách `Product`.
   */
  getAllAdmin: (): Promise<Product[]> =>
    apiClient.fetch<Product[]>(`${BASE_PATH}/admin`),

  /**
   * Tìm sản phẩm theo ID.
   * @param id - ID sản phẩm.
   * @returns Thông tin `Product`.
   */
  getProductById: (id: number): Promise<Product> =>
    apiClient.fetch<Product>(`${BASE_PATH}/${id}`),

  /**
   * Tìm kiếm sản phẩm theo từ khóa.
   * @param query - Từ khóa tìm kiếm.
   * @returns Danh sách `Product` phù hợp.
   */
  searchProducts: (query: string): Promise<Product[]> =>
    apiClient.fetch<Product[]>(
      `${BASE_PATH}/search?query=${encodeURIComponent(query)}`,
    ),

  /**
   * Lấy danh sách sản phẩm bán chạy.
   * @returns Danh sách `Product`.
   */
  getBestSellers: (): Promise<Product[]> =>
    apiClient.fetch<Product[]>(`${BASE_PATH}/best-sellers`),

  /**
   * Lấy danh sách sản phẩm Flash Sale.
   * @returns Danh sách `Product`.
   */
  getFlashSales: (): Promise<Product[]> =>
    apiClient.fetch<Product[]>(`${BASE_PATH}/flash-sales`),

  /**
   * Lấy danh sách sản phẩm theo hãng.
   * @param brand - Tên hãng sản xuất.
   * @returns Danh sách `Product`.
   */
  getProductsByBrand: (brand: string): Promise<Product[]> =>
    apiClient.fetch<Product[]>(
      `${BASE_PATH}/brand/${encodeURIComponent(brand)}`,
    ),

  /**
   * Tạo sản phẩm mới. (Yêu cầu quyền ADMIN)
   * @param data - Dữ liệu sản phẩm cần tạo.
   * @returns Sản phẩm vừa được tạo.
   */
  createProduct: (data: ProductRequest): Promise<Product> =>
    apiClient.fetch<Product>(BASE_PATH, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * Cập nhật sản phẩm. (Yêu cầu quyền ADMIN)
   * @param id - ID sản phẩm cần cập nhật.
   * @param data - Các trường cần cập nhật.
   * @returns Sản phẩm sau khi cập nhật.
   */
  updateProduct: (
    id: number,
    data: Partial<ProductRequest>,
  ): Promise<Product> =>
    apiClient.fetch<Product>(`${BASE_PATH}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /**
   * Xóa sản phẩm. (Yêu cầu quyền ADMIN)
   * @param id - ID sản phẩm cần xóa.
   */
  deleteProduct: (id: number): Promise<void> =>
    apiClient.fetch<void>(`${BASE_PATH}/${id}`, { method: "DELETE" }),

  /**
   * Lấy danh sách sản phẩm để so sánh.
   * @param ids - Danh sách ID sản phẩm.
   * @returns Danh sách `Product` tương ứng.
   */
  getCompareProducts: (ids: number[]): Promise<Product[]> =>
    apiClient.fetch<Product[]>(`${BASE_PATH}/compare?ids=${ids.join(",")}`),
};
