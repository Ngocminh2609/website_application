import { Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  StopOutlined,
} from "@ant-design/icons";
import type { Order } from "../../../api/orderApi";

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
