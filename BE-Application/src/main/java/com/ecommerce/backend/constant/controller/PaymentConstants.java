package com.ecommerce.backend.constant.controller;

/**
 * Hằng số cấu hình PaymentController.
 */
public final class PaymentConstants {

    private PaymentConstants() {
    }

    public static final String STATUS_OK = "OK";
    public static final String STATUS_FAILED = "FAILED";

    public static final String MSG_COD_SUCCESS = "Đã nhận đơn hàng (COD). Chúng tôi sẽ liên hệ sớm nhất.";
    public static final String MSG_VNPAY_INIT_SUCCESS = "Successfully created order and payment URL";
    public static final String MSG_PAYMENT_SUCCESS = "Thanh toán thành công";
    public static final String MSG_PAYMENT_FAILED = "Thanh toán không thành công";
    public static final String MSG_INVALID_SIGNATURE = "Sai chữ ký bảo mật";

    public static final String VNP_SECURE_HASH = "vnp_SecureHash";
    public static final String VNP_SECURE_HASH_TYPE = "vnp_SecureHashType";
    public static final String VNP_RESPONSE_CODE = "vnp_ResponseCode";
    public static final String VNP_TXN_REF = "vnp_TxnRef";
}
