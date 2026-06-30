import { apiClient } from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentResponse {
    status: string;
    message: string;
    url: string;
}

export interface CreateOrderPaymentParams {
    username: string;
    address: string;
    phone: string;
    couponCode?: string;
    paymentMethod?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = '/v1/payment';
const DEFAULT_PAYMENT_METHOD = 'VNPAY';

// ─── API ─────────────────────────────────────────────────────────────────────

export const paymentApi = {
    /**
     * @deprecated Sử dụng `createOrderPayment` để tạo đơn hàng thực tế.
     * @param amount - Số tiền thanh toán.
     * @param orderInfo - Thông tin đơn hàng.
     * @returns Thông tin thanh toán.
     */
    createPayment: (amount: number, orderInfo: string): Promise<PaymentResponse> =>
        apiClient.fetch<PaymentResponse>(
            `${BASE_PATH}/create-payment?amount=${amount}&orderInfo=${encodeURIComponent(orderInfo)}`
        ),

    /**
     * Tạo đơn hàng và khởi tạo thanh toán.
     * @param params - Thông tin checkout.
     * @returns Thông tin thanh toán bao gồm URL redirect.
     */
    createOrderPayment: ({
        username,
        address,
        phone,
        couponCode,
        paymentMethod = DEFAULT_PAYMENT_METHOD,
    }: CreateOrderPaymentParams): Promise<PaymentResponse> => {
        const url = new URL(`${BASE_PATH}/create-order-payment`, window.location.origin);
        url.searchParams.set('username', username);
        url.searchParams.set('shippingAddress', address);
        url.searchParams.set('phoneNumber', phone);
        url.searchParams.set('paymentMethod', paymentMethod);
        if (couponCode) url.searchParams.set('couponCode', couponCode);

        return apiClient.fetch<PaymentResponse>(url.pathname + url.search, { method: 'POST' });
    },

    /**
     * Xác minh kết quả thanh toán từ VNPay callback.
     * @param params - Chuỗi query params từ VNPay callback URL.
     * @returns Kết quả xác minh.
     */
    verifyPayment: (params: string): Promise<PaymentResponse> =>
        apiClient.fetch<PaymentResponse>(`${BASE_PATH}/vnpay-callback${params}`),
};
