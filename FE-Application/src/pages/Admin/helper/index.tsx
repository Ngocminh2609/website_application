import { Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  StopOutlined,
} from "@ant-design/icons";
import type { Order } from "../../../api/orderApi";
import dayjs from "dayjs";
import { ADMIN_STRINGS } from "../../../constants/Admin/admin-dashboard";

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
 * Trả về Tag trạng thái tương ứng của đơn hàng
 */
export const getStatusTag = (status: string) => {
  switch (status) {
    case "PENDING":
      return (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          {ADMIN_STRINGS.orderStatus.pending}
        </Tag>
      );
    case "PAID":
      return (
        <Tag icon={<CheckCircleOutlined />} color="processing">
          {ADMIN_STRINGS.orderStatus.paid}
        </Tag>
      );
    case "SHIPPING":
      return (
        <Tag icon={<CarOutlined />} color="blue">
          {ADMIN_STRINGS.orderStatus.shipping}
        </Tag>
      );
    case "DELIVERED":
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {ADMIN_STRINGS.orderStatus.delivered}
        </Tag>
      );
    case "FAILED":
      return (
        <Tag icon={<StopOutlined />} color="error">
          {ADMIN_STRINGS.orderStatus.failed}
        </Tag>
      );
    case "CANCELLED":
      return (
        <Tag icon={<StopOutlined />} color="default">
          {ADMIN_STRINGS.orderStatus.cancelled}
        </Tag>
      );
    default:
      return <Tag>{status}</Tag>;
  }
};

/**
 * Định dạng tiền tệ VND
 */
export const formatCurrency = (amount: number, hasSpace: boolean = true): string => {
  const formatted = amount.toLocaleString("vi-VN");
  return hasSpace ? `${formatted} đ` : `${formatted}đ`;
};

/**
 * Định dạng ngày giờ sử dụng toLocaleString
 */
export const formatDateTime = (date: string | Date | number): string => {
  return new Date(date).toLocaleString("vi-VN");
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
