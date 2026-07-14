import { Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  StopOutlined,
} from "@ant-design/icons";
import type { Order } from "../../../api/orderApi";
import dayjs from "dayjs";

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
          Chờ thanh toán
        </Tag>
      );
    case "PAID":
      return (
        <Tag icon={<CheckCircleOutlined />} color="processing">
          Đã thanh toán
        </Tag>
      );
    case "SHIPPING":
      return (
        <Tag icon={<CarOutlined />} color="blue">
          Đang giao hàng
        </Tag>
      );
    case "DELIVERED":
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Đã giao hàng
        </Tag>
      );
    case "FAILED":
      return (
        <Tag icon={<StopOutlined />} color="error">
          Lỗi giao dịch
        </Tag>
      );
    case "CANCELLED":
      return (
        <Tag icon={<StopOutlined />} color="default">
          Đã hủy
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

