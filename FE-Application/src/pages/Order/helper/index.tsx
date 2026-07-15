import { Space, Typography } from "antd";
import type { Order } from "../../../types/order";
import { ORDER_STRINGS } from "../../../constants/Order/orders";
import { styles } from "../styles/orders-page.styles";
import { OrderStatusTag } from "../../../components/common/OrderStatusTag";
import { formatDateTimeVi, formatVnd } from "../../../utils/format";

const { Text } = Typography;

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
    render: (date: string) => formatDateTimeVi(date),
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
        {formatVnd(amount, false)}
      </Text>
    ),
  },
  {
    title: ORDER_STRINGS.table.status,
    dataIndex: "status",
    key: "status",
    render: (status: string) => <OrderStatusTag status={status} />,
  },
];
