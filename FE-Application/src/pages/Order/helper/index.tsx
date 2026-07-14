import { Tag, Space, Typography } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  CloseCircleFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { Order } from "../../../api/orderApi";
import { ORDER_STRINGS } from "../../../constants/Order/orders";
import { styles } from "../styles/orders-page.styles";

const { Text } = Typography;

export const getStatusTag = (status: string) => {
  switch (status) {
    case "PENDING":
      return (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          {ORDER_STRINGS.status.pending}
        </Tag>
      );
    case "PAID":
      return (
        <Tag icon={<CheckCircleOutlined />} color="processing">
          {ORDER_STRINGS.status.paid}
        </Tag>
      );
    case "SHIPPING":
      return (
        <Tag icon={<CarOutlined />} color="blue">
          {ORDER_STRINGS.status.shipping}
        </Tag>
      );
    case "DELIVERED":
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {ORDER_STRINGS.status.delivered}
        </Tag>
      );
    case "FAILED":
      return (
        <Tag icon={<CloseCircleFilled />} color="error">
          {ORDER_STRINGS.status.failed}
        </Tag>
      );
    case "CANCELLED":
      return (
        <Tag icon={<CloseCircleOutlined />} color="default">
          {ORDER_STRINGS.status.cancelled}
        </Tag>
      );
    default:
      return <Tag>{status}</Tag>;
  }
};

export const getOrderTableColumns = () => [
  {
    title: ORDER_STRINGS.table.orderId,
    dataIndex: "id",
    key: "id",
    render: (id: number) => <Text strong>#{id}</Text>,
  },
  {
    title: ORDER_STRINGS.table.orderDate,
    dataIndex: "orderDate",
    key: "orderDate",
    render: (date: string) => new Date(date).toLocaleString("vi-VN"),
  },
  {
    title: ORDER_STRINGS.table.products,
    key: "items",
    render: (_text: string, record: Order) => (
      <Space direction="vertical" size="small">
        {record.items.map((item) => (
          <div key={item.id}>
            <Text style={styles.itemName}>
              {item.product.name} x {item.quantity}
            </Text>
          </div>
        ))}
      </Space>
    ),
  },
  {
    title: ORDER_STRINGS.table.totalAmount,
    dataIndex: "totalAmount",
    key: "totalAmount",
    render: (amount: number) => (
      <Text strong style={styles.totalAmountText}>
        {amount.toLocaleString("vi-VN")}đ
      </Text>
    ),
  },
  {
    title: ORDER_STRINGS.table.status,
    dataIndex: "status",
    key: "status",
    render: (status: string) => getStatusTag(status),
  },
];
