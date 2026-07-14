import { apiClient } from "./apiClient";
import type { CouponValidateResponse } from "../types/coupon-review";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Coupon {
  id: number;
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = "/coupons";
const ADMIN_PATH = `${BASE_PATH}/admin`;

// ─── API ─────────────────────────────────────────────────────────────────────

export const couponApi = {
  /**
   * Kiểm tra tính hợp lệ của mã giảm giá.
   * @param code - Mã coupon.
   * @param orderAmount - Giá trị đơn hàng.
   * @returns Kết quả kiểm tra coupon.
   */
  validate: (
    code: string,
    orderAmount: number,
  ): Promise<CouponValidateResponse> =>
    apiClient.fetch<CouponValidateResponse>(
      `${BASE_PATH}/validate?code=${encodeURIComponent(code)}&orderAmount=${orderAmount}`,
    ),

  // ─── Admin ───────────────────────────────────────────────────────────────

  /**
   * Lấy danh sách tất cả coupon. (Yêu cầu quyền ADMIN)
   * @returns Danh sách `Coupon`.
   */
  getAll: (): Promise<Coupon[]> => apiClient.fetch<Coupon[]>(ADMIN_PATH),

  /**
   * Tạo coupon mới. (Yêu cầu quyền ADMIN)
   * @param coupon - Dữ liệu coupon cần tạo.
   * @returns Coupon vừa được tạo.
   */
  create: (coupon: Partial<Coupon>): Promise<Coupon> =>
    apiClient.fetch<Coupon>(ADMIN_PATH, {
      method: "POST",
      body: JSON.stringify(coupon),
    }),

  /**
   * Cập nhật trạng thái coupon. (Yêu cầu quyền ADMIN)
   * @param id - ID của coupon.
   * @param active - Trạng thái kích hoạt.
   */
  updateStatus: (id: number, active: boolean): Promise<void> =>
    apiClient.fetch<void>(`${ADMIN_PATH}/${id}/status?active=${active}`, {
      method: "PUT",
    }),

  /**
   * Xóa coupon. (Yêu cầu quyền ADMIN)
   * @param id - ID của coupon cần xóa.
   */
  delete: (id: number): Promise<void> =>
    apiClient.fetch<void>(`${ADMIN_PATH}/${id}`, { method: "DELETE" }),
};
