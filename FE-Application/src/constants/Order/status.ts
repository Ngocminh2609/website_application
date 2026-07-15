/**
 * Nhãn trạng thái đơn hàng dùng chung cho User Orders và Admin Dashboard.
 */
export const ORDER_STATUS_LABELS = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  shipping: "Đang giao hàng",
  delivered: "Đã giao hàng",
  failed: "Thanh toán lỗi",
  cancelled: "Đã hủy",
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS_LABELS;
