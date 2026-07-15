import { apiClient } from "./apiClient";
import type { ProductReview } from "../types/review";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateReviewPayload {
  rating: number;
  comment: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = "/reviews";
const ADMIN_PATH = `${BASE_PATH}/admin`;

// ─── API ─────────────────────────────────────────────────────────────────────

/**
 * Service quản lý các yêu cầu liên quan đến Đánh giá sản phẩm.
 */
export const reviewApi = {
  /**
   * Lấy danh sách đánh giá của một sản phẩm.
   * @param productId - ID sản phẩm.
   * @returns Danh sách `ProductReview`.
   */
  getByProduct: (productId: number): Promise<ProductReview[]> =>
    apiClient.fetch<ProductReview[]>(`${BASE_PATH}/product/${productId}`),

  /**
   * Tạo đánh giá mới cho sản phẩm.
   * @param productId - ID sản phẩm cần đánh giá.
   * @param payload - Nội dung đánh giá (rating, comment).
   * @returns Đánh giá vừa được tạo.
   */
  create: (
    productId: number,
    payload: CreateReviewPayload,
  ): Promise<ProductReview> =>
    apiClient.fetch<ProductReview>(`${BASE_PATH}/product/${productId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * Xóa đánh giá.
   * @param reviewId - ID đánh giá cần xóa.
   * @returns Thông báo kết quả.
   */
  delete: (reviewId: number): Promise<string> =>
    apiClient.fetch<string>(`${BASE_PATH}/${reviewId}`, { method: "DELETE" }),

  // ─── Admin ───────────────────────────────────────────────────────────────

  /**
   * Lấy tất cả đánh giá. (Yêu cầu quyền ADMIN)
   * @returns Danh sách `ProductReview`.
   */
  getAllAdmin: (): Promise<ProductReview[]> =>
    apiClient.fetch<ProductReview[]>(`${ADMIN_PATH}/all`),

  /**
   * Duyệt đánh giá. (Yêu cầu quyền ADMIN)
   * @param reviewId - ID đánh giá cần duyệt.
   */
  approve: (reviewId: number): Promise<void> =>
    apiClient.fetch<void>(`${ADMIN_PATH}/${reviewId}/approve`, {
      method: "PUT",
    }),
};
