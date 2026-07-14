import { apiClient } from "./apiClient";
import type { Category } from "../types/category";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CategoryPayload = Partial<Category>;

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = "/categories";

// ─── API ─────────────────────────────────────────────────────────────────────

/**
 * Service quản lý các yêu cầu liên quan đến Danh mục.
 */
export const categoryApi = {
  /**
   * Lấy danh sách tất cả danh mục.
   * @returns Danh sách `Category`.
   */
  getAllCategories: (): Promise<Category[]> =>
    apiClient.fetch<Category[]>(BASE_PATH),

  /**
   * Lấy chi tiết một danh mục.
   * @param id - ID của danh mục.
   * @returns Thông tin `Category`.
   */
  getCategoryById: (id: number): Promise<Category> =>
    apiClient.fetch<Category>(`${BASE_PATH}/${id}`),

  /**
   * Tạo danh mục mới. (Yêu cầu quyền ADMIN)
   * @param data - Dữ liệu danh mục cần tạo.
   * @returns Danh mục vừa được tạo.
   */
  createCategory: (data: CategoryPayload): Promise<Category> =>
    apiClient.fetch<Category>(BASE_PATH, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * Cập nhật danh mục. (Yêu cầu quyền ADMIN)
   * @param id - ID của danh mục cần cập nhật.
   * @param data - Các trường cần cập nhật.
   * @returns Danh mục sau khi cập nhật.
   */
  updateCategory: (id: number, data: CategoryPayload): Promise<Category> =>
    apiClient.fetch<Category>(`${BASE_PATH}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /**
   * Xóa danh mục. (Yêu cầu quyền ADMIN)
   * @param id - ID của danh mục cần xóa.
   */
  deleteCategory: (id: number): Promise<void> =>
    apiClient.fetch<void>(`${BASE_PATH}/${id}`, { method: "DELETE" }),
};
