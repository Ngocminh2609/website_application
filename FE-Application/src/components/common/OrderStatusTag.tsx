import type { FC } from "react";
import { Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { ORDER_STATUS_LABELS } from "../../constants/Order/status";

interface OrderStatusTagProps {
  status: string;
}

/**
 * Tag trạng thái đơn hàng dùng chung cho Admin và User Orders.
 */
export const OrderStatusTag: FC<OrderStatusTagProps> = ({ status }) => {
  switch (status) {
    case "PENDING":
      return (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          {ORDER_STATUS_LABELS.pending}
        </Tag>
      );
    case "PAID":
      return (
        <Tag icon={<CheckCircleOutlined />} color="processing">
          {ORDER_STATUS_LABELS.paid}
        </Tag>
      );
    case "SHIPPING":
      return (
        <Tag icon={<CarOutlined />} color="blue">
          {ORDER_STATUS_LABELS.shipping}
        </Tag>
      );
    case "DELIVERED":
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {ORDER_STATUS_LABELS.delivered}
        </Tag>
      );
    case "FAILED":
      return (
        <Tag icon={<StopOutlined />} color="error">
          {ORDER_STATUS_LABELS.failed}
        </Tag>
      );
    case "CANCELLED":
      return (
        <Tag icon={<StopOutlined />} color="default">
          {ORDER_STATUS_LABELS.cancelled}
        </Tag>
      );
    default:
      return <Tag>{status}</Tag>;
  }
};
