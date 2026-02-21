import { apiClient } from './apiClient';
import type { CouponValidateResponse } from '../types/coupon-review';

export interface Coupon {
    id: number;
    code: string;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
    expiresAt: string;
}

export const couponApi = {
    validate: (code: string, orderAmount: number): Promise<CouponValidateResponse> =>
        apiClient.fetch<CouponValidateResponse>(
            `/coupons/validate?code=${encodeURIComponent(code)}&orderAmount=${orderAmount}`
        ),

    // Admin methods
    getAll: (): Promise<Coupon[]> =>
        apiClient.fetch<Coupon[]>('/coupons/admin'),

    create: (coupon: Partial<Coupon>): Promise<Coupon> =>
        apiClient.fetch<Coupon>('/coupons/admin', {
            method: 'POST',
            body: JSON.stringify(coupon)
        }),

    toggle: (id: number): Promise<void> =>
        apiClient.fetch(`/coupons/admin/${id}/toggle`, { method: 'PUT' }),

    delete: (id: number): Promise<void> =>
        apiClient.fetch(`/coupons/admin/${id}`, { method: 'DELETE' })
};
