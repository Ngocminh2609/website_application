import { apiClient } from "./apiClient";

export interface PaymentResponse {
    status: string;
    message: string;
    url: string;
}

export const paymentApi = {
    /**
     * @deprecated Sử dụng createOrderPayment để tạo đơn hàng thực tế
     */
    createPayment: async (amount: number, orderInfo: string): Promise<PaymentResponse> => {
        return apiClient.fetch<PaymentResponse>(`/v1/payment/create-payment?amount=${amount}&orderInfo=${encodeURIComponent(orderInfo)}`, {
            method: 'GET'
        });
    },

    createOrderPayment: async (username: string, address: string, phone: string, couponCode?: string, paymentMethod: string = 'VNPAY'): Promise<PaymentResponse> => {
        // Sử dụng POST request để gửi dữ liệu checkout một cách an toàn
        let url = `/v1/payment/create-order-payment?username=${username}&shippingAddress=${encodeURIComponent(address)}&phoneNumber=${encodeURIComponent(phone)}&paymentMethod=${paymentMethod}`;
        if (couponCode) {
            url += `&couponCode=${encodeURIComponent(couponCode)}`;
        }
        return apiClient.fetch<PaymentResponse>(url, {
            method: 'POST'
        });
    },

    verifyPayment: async (params: string): Promise<PaymentResponse> => {
        return apiClient.fetch<PaymentResponse>(`/v1/payment/vnpay-callback${params}`, {
            method: 'GET'
        });
    }
};
