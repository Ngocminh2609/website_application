import { apiClient } from "./apiClient";
import type { Coupon, CouponValidateResponse } from "../types/coupon";

export type { Coupon, CouponValidateResponse } from "../types/coupon";

const BASE_PATH = "/coupons";
const ADMIN_PATH = `${BASE_PATH}/admin`;

export const couponApi = {
  validate: (
    code: string,
    orderAmount: number,
  ): Promise<CouponValidateResponse> =>
    apiClient.fetch<CouponValidateResponse>(
      `${BASE_PATH}/validate?code=${encodeURIComponent(code)}&orderAmount=${orderAmount}`,
    ),

  getAll: (): Promise<Coupon[]> => apiClient.fetch<Coupon[]>(ADMIN_PATH),

  create: (coupon: Partial<Coupon>): Promise<Coupon> =>
    apiClient.fetch<Coupon>(ADMIN_PATH, {
      method: "POST",
      body: JSON.stringify(coupon),
    }),

  updateStatus: (id: number, active: boolean): Promise<void> =>
    apiClient.fetch<void>(`${ADMIN_PATH}/${id}/status?active=${active}`, {
      method: "PUT",
    }),

  delete: (id: number): Promise<void> =>
    apiClient.fetch<void>(`${ADMIN_PATH}/${id}`, { method: "DELETE" }),
};
