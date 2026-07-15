package com.ecommerce.backend.constant.service;

/**
 * Hằng số cấu hình OrderService.
 */
public final class OrderServiceConstants {

    private OrderServiceConstants() {
        // Hạn chế khởi tạo đối tượng hằng số
    }

    // Order Statuses
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_PAID = "PAID";
    public static final String STATUS_FAILED = "FAILED";
    public static final String STATUS_SHIPPING = "SHIPPING";
    public static final String STATUS_DELIVERED = "DELIVERED";
    public static final String STATUS_CANCELLED = "CANCELLED";

    // Payment Methods
    public static final String METHOD_COD = "COD";
    public static final String METHOD_VNPAY = "VNPAY";

    // VNPay Response Codes
    public static final String VNP_RESPONSE_CODE_SUCCESS = "00";

    // VNPay Payload Keys
    public static final String VNP_KEY_TXN_NO = "vnp_TransactionNo";
    public static final String VNP_KEY_AMOUNT = "vnp_Amount";
    public static final String VNP_KEY_BANK_CODE = "vnp_BankCode";
    public static final String VNP_KEY_PAY_DATE = "vnp_PayDate";
    public static final String VNP_KEY_TXN_STATUS = "vnp_TransactionStatus";

    // Notification Recipient
    public static final String RECIPIENT_USER_PREFIX = "user-";

    // Exception Messages
    public static final String ERROR_CART_NOT_FOUND = "Không tìm thấy giỏ hàng!";
    public static final String ERROR_CART_EMPTY = "Giỏ hàng trống!";
    public static final String ERROR_COUPON_INVALID_PREFIX = "Mã giảm giá không hợp lệ: ";
    public static final String ERROR_ORDER_NOT_FOUND_PREFIX = "Không tìm thấy đơn hàng ID: ";
    public static final String ERROR_ORDER_DELETE_NOT_FOUND = "Không tìm thấy đơn hàng để xóa";

    // Notification Messages
    public static final String MSG_PAID_PREFIX = "Thanh toán thành công đơn hàng #";
    public static final String MSG_PAID_SUFFIX = ". Chúng tôi sẽ sớm giao hàng cho bạn!";
    public static final String MSG_ORDER_PREFIX = "Đơn hàng #";
    public static final String MSG_SHIPPING_SUFFIX = " đang trên đường giao đến bạn.";
    public static final String MSG_DELIVERED_PREFIX = "Chúc mừng! Đơn hàng #";
    public static final String MSG_DELIVERED_SUFFIX = " đã được giao thành công.";
    public static final String MSG_CANCELLED_SUFFIX = " đã bị hủy.";
    public static final String MSG_STATUS_UPDATE_PREFIX = "Cập nhật trạng thái mới cho đơn hàng #";
    public static final String MSG_STATUS_UPDATE_SEPARATOR = ": ";

    // Log Messages
    public static final String LOG_COUPON_CONSUME_FAILED = "Không thể tiêu hao mã giảm giá: ";
}
