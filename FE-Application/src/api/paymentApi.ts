import { apiClient } from "./apiClient";
import type {
  PaymentResponse,
  CreateOrderPaymentParams,
} from "../types/payment";

export type { PaymentResponse, CreateOrderPaymentParams } from "../types/payment";

const BASE_PATH = "/v1/payment";
const DEFAULT_PAYMENT_METHOD = "VNPAY";

export const paymentApi = {
  /**
   * @deprecated Sử dụng `createOrderPayment` để tạo đơn hàng thực tế.
   */
  createPayment: (
    amount: number,
    orderInfo: string,
  ): Promise<PaymentResponse> =>
    apiClient.fetch<PaymentResponse>(
      `${BASE_PATH}/create-payment?amount=${amount}&orderInfo=${encodeURIComponent(orderInfo)}`,
    ),

  createOrderPayment: ({
    address,
    phone,
    couponCode,
    paymentMethod = DEFAULT_PAYMENT_METHOD,
  }: CreateOrderPaymentParams): Promise<PaymentResponse> => {
    const url = new URL(
      `${BASE_PATH}/create-order-payment`,
      window.location.origin,
    );
    url.searchParams.set("shippingAddress", address);
    url.searchParams.set("phoneNumber", phone);
    url.searchParams.set("paymentMethod", paymentMethod);
    if (couponCode) url.searchParams.set("couponCode", couponCode);

    return apiClient.fetch<PaymentResponse>(url.pathname + url.search, {
      method: "POST",
    });
  },

  verifyPayment: (params: string): Promise<PaymentResponse> =>
    apiClient.fetch<PaymentResponse>(`${BASE_PATH}/vnpay-callback${params}`),
};
