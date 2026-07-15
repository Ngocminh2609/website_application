import type { DISCOUNT_TYPES } from "../components/common/Commons";

export type DiscountType =
  | typeof DISCOUNT_TYPES.PERCENT
  | typeof DISCOUNT_TYPES.FIXED;

/**
 * Entity mã giảm giá (admin + domain).
 */
export interface Coupon {
  id: number;
  code: string;
  discountType: DiscountType | "PERCENT" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  createdAt?: string;
}

export interface CouponValidateResponse {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  maxDiscountAmount?: number;
  finalAmount: number;
  message: string;
}
