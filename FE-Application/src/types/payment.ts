export interface PaymentResponse {
  status: string;
  message: string;
  url: string;
}

export interface CreateOrderPaymentParams {
  address: string;
  phone: string;
  couponCode?: string;
  paymentMethod?: string;
}
