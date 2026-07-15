import type { Order } from "../../../types/order";
import dayjs from "dayjs";
import { OrderStatusTag } from "../../../components/common/OrderStatusTag";

export { formatVnd as formatCurrency, formatDateTimeVi as formatDateTime } from "../../../utils/format";

/** Wrapper tương thích gọi dạng getStatusTag(status) */
export const getStatusTag = (status: string) => (
  <OrderStatusTag status={status} />
);

/**
 * Tính tổng doanh thu thực từ danh sách đơn hàng
 */
export const calculateTotalRevenue = (orders: Order[]): number => {
  return orders
    .filter(
      (o) =>
        o.status === "PAID" ||
        o.status === "DELIVERED" ||
        o.status === "SHIPPING",
    )
    .reduce((sum, o) => sum + o.totalAmount, 0);
};

/**
 * Định dạng ngày giờ sử dụng dayjs
 */
export const formatDateDayjs = (
  date: string | Date | number,
  formatStr: string = "DD/MM/YYYY HH:mm",
): string => {
  return dayjs(date).format(formatStr);
};

/**
 * Tính phần trăm sử dụng (Ví dụ: voucher)
 */
export const calculateUsagePercentage = (usedCount: number, usageLimit: number): number => {
  return Math.min(100, (usedCount / (usageLimit || 1)) * 100);
};
