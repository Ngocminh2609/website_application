import { apiClient } from "./apiClient";
import type { Product } from "../types/product";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WishlistResponse {
  message: string;
}

export interface WishlistCheckResponse {
  isInWishlist: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = "/wishlist";

// ─── API ─────────────────────────────────────────────────────────────────────

/**
 * Service xử lý các yêu cầu liên quan đến danh sách yêu thích (Wishlist).
 */
export const wishlistApi = {
  /**
   * Lấy danh sách sản phẩm yêu thích của người dùng.
   * @returns Danh sách `Product`.
   */
  getWishlist: (): Promise<Product[]> => apiClient.fetch<Product[]>(BASE_PATH),

  /**
   * Thêm sản phẩm vào danh sách yêu thích.
   * @param productId - ID sản phẩm cần thêm.
   * @returns Thông báo kết quả.
   */
  addToWishlist: (productId: number): Promise<WishlistResponse> =>
    apiClient.fetch<WishlistResponse>(`${BASE_PATH}/${productId}`, {
      method: "POST",
    }),

  /**
   * Xóa sản phẩm khỏi danh sách yêu thích.
   * @param productId - ID sản phẩm cần xóa.
   * @returns Thông báo kết quả.
   */
  removeFromWishlist: (productId: number): Promise<WishlistResponse> =>
    apiClient.fetch<WishlistResponse>(`${BASE_PATH}/${productId}`, {
      method: "DELETE",
    }),

  /**
   * Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa.
   * @param productId - ID sản phẩm cần kiểm tra.
   * @returns Trạng thái wishlist.
   */
  checkWishlist: (productId: number): Promise<WishlistCheckResponse> =>
    apiClient.fetch<WishlistCheckResponse>(`${BASE_PATH}/check/${productId}`),
};

export default wishlistApi;
