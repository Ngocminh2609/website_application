/**
 * Định nghĩa kiểu dữ liệu cho hệ thống mã giảm giá và đánh giá sản phẩm.
 */

export interface CouponValidateResponse {
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  discountAmount: number;
  maxDiscountAmount?: number;
  finalAmount: number;
  message: string;
}

export interface Coupon {
  id: number;
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface ReviewUser {
  id: number;
  fullName?: string;
  username: string;
  avatarUrl?: string;
}

export interface ProductReview {
  id: number;
  user: ReviewUser;
  rating: number;
  comment?: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  product?: { id: number; name?: string };
  createdAt: string;
}
