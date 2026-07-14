import React from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Table,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Tabs,
  Tooltip,
  Badge,
} from "antd";
import {
  TeamOutlined,
  ShoppingOutlined,
  DollarOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  TruckOutlined,
  StopOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  BarChartOutlined,
  BellOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  GiftOutlined,
  StarOutlined,
  PictureOutlined,
  FireFilled,
} from "@ant-design/icons";
import AdminChat from "./AdminChat";
import type { Product } from "../../types/product";
import { type Order } from "../../api/orderApi";
import BaseButton from "../../components/common/BaseButton";
import type { ColumnsType } from "antd/es/table";
import StatisticsTab from "./StatisticsTab";
import NotificationManagement from "./NotificationManagement";
import VoucherManagement from "./VoucherManagement";
import ReviewModeration from "./ReviewModeration";
import BannerManagement from "./BannerManagement";
import { useAdminDashboardState } from "../../hooks/Admin/useAdminDashboardState";
import { styles } from "./styles/admin-dashboard.styles";
import { calculateTotalRevenue, getStatusTag } from "./helper";
import { ADMIN_STRINGS } from "../../constants/Admin/admin-dashboard";

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * Trang Quản trị viên (Admin Dashboard) đa năng.
 * Tích hợp quản lý sản phẩm và quản lý đơn hàng tập trung.
 */
const AdminDashboard: React.FC = () => {
  const {
    totalUnread,
    products,
    categories,
    orders,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingId,
    fileList,
    setFileList,
    form,
    activeTab,
    setActiveTab,
    livePrice,
    handleAddProduct,
    handleEdit,
    onFinish,
    handleDelete,
    handleStatusUpdate,
    handleDeleteOrder,
  } = useAdminDashboardState();

  const productColumns: ColumnsType<Product> = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record: Product) => (
        <Space size="middle">
          <div style={styles.imageWrapper}>
            <img
              src={record.imageUrl}
              alt={record.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=200";
              }}
              style={styles.productImage}
            />
            {record.isBestSeller && (
              <FireFilled style={styles.bestSellerFire} />
            )}
          </div>
          <div>
            <Text strong style={styles.productNameText}>
              {record.name}
            </Text>
            <Space>
              <Tag color="blue" style={styles.tagBrandAndCategory}>
                {record.brand || "No Brand"}
              </Tag>
              <Tag color="purple" style={styles.tagBrandAndCategory}>
                {record.category?.name}
              </Tag>
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: "Giá bán",
      key: "price",
      render: (_, record: Product) => (
        <div>
          <Text strong style={styles.productPrice}>
            {record.price.toLocaleString("vi-VN")} đ
          </Text>
          {record.discountPercent && record.discountPercent > 0 ? (
            <Text delete type="secondary" style={styles.originalPrice}>
              {record.originalPrice?.toLocaleString("vi-VN")} đ
            </Text>
          ) : null}
          {!record.isActive && (
            <Tag color="default" style={styles.inactiveTag}>
              ĐANG ẨN
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      render: (qty: number) => (
        <Tag color={qty < 10 ? "volcano" : "green"}>{qty} chiếc</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right",
      render: (_, record: Product) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <BaseButton
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <BaseButton
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const orderColumns: ColumnsType<Order> = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id: number) => <Text strong>#{id}</Text>,
    },
    {
      title: "Khách hàng / Liên hệ",
      key: "contact",
      render: (_, record: Order) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.shippingAddress}</Text>
          <Text type="secondary" style={styles.orderContactSubtext}>
            <TeamOutlined /> {record.phoneNumber}
          </Text>
        </Space>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amt: number) => (
        <Text strong style={styles.orderTotalAmount}>
          {amt.toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right",
      render: (_, record: Order) => (
        <Space size="small">
          {record.status === "PAID" && (
            <Tooltip title="Bắt đầu giao hàng">
              <BaseButton
                type="primary"
                size="small"
                icon={<TruckOutlined />}
                onClick={() =>
                  handleStatusUpdate(
                    record.id,
                    "SHIPPING",
                    "Đã chuyển trạng thái sang Đang giao hàng",
                  )
                }
              />
            </Tooltip>
          )}
          {record.status === "SHIPPING" && (
            <Tooltip title="Xác nhận đã giao">
              <BaseButton
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                style={styles.deliveredStatusButton}
                onClick={() =>
                  handleStatusUpdate(
                    record.id,
                    "DELIVERED",
                    "Đơn hàng đã hoàn thành",
                  )
                }
              />
            </Tooltip>
          )}
          {(record.status === "PENDING" || record.status === "PAID") && (
            <Tooltip title="Hủy đơn này">
              <BaseButton
                type="text"
                icon={<StopOutlined />}
                danger
                onClick={() =>
                  handleStatusUpdate(record.id, "CANCELLED", "Đã hủy đơn hàng")
                }
              />
            </Tooltip>
          )}
          <Tooltip title="Xóa vĩnh viễn">
            <BaseButton
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteOrder(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Content className="main-content">
      <div style={styles.headerContainer}>
        <div>
          <Title level={1} style={styles.headerTitle}>
            {ADMIN_STRINGS.header.title}
          </Title>
          <Text style={styles.headerSubtitle}>
            {ADMIN_STRINGS.header.subPrefix}
            <Text strong style={styles.ordersCountHighlight}>
              {orders.length}
            </Text>
            {ADMIN_STRINGS.header.subSuffix}
          </Text>
        </div>
      </div>

      <Row gutter={[24, 24]} style={styles.rowMargin}>
        <Col xs={24} sm={8}>
          <Card className="glass-effect" styles={{ body: styles.cardBody }}>
            <Space direction="vertical" size={4}>
              <Text style={styles.cardTitleIconText}>
                <ShoppingOutlined style={styles.ordersCountHighlight} />
                {ADMIN_STRINGS.cards.stock}
              </Text>
              <Title level={2} style={styles.cardTitleValue}>
                {products.length}{" "}
                <Text style={styles.cardSubText}>
                  {ADMIN_STRINGS.cards.stockUnit}
                </Text>
              </Title>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="glass-effect" styles={{ body: styles.cardBody }}>
            <Space direction="vertical" size={4}>
              <Text style={styles.cardTitleIconText}>
                <HistoryOutlined style={styles.ordersCountHighlight} />
                {ADMIN_STRINGS.cards.orders}
              </Text>
              <Title level={2} style={styles.cardTitleValue}>
                {orders.length}{" "}
                <Text style={styles.cardSubText}>
                  {ADMIN_STRINGS.cards.ordersUnit}
                </Text>
              </Title>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="glass-effect" styles={{ body: styles.cardBody }}>
            <Space direction="vertical" size={4}>
              <Text style={styles.cardTitleIconText}>
                <DollarOutlined style={styles.ordersCountHighlight} />
                {ADMIN_STRINGS.cards.revenue}
              </Text>
              <Title level={2} style={styles.cardTitleRevenueValue}>
                {calculateTotalRevenue(orders).toLocaleString("vi-VN")}đ
              </Title>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card className="glass-effect" styles={{ body: styles.cardBody }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          destroyInactiveTabPane={true}
          items={[
            {
              key: "products",
              label: (
                <span style={styles.tabLabelText}>
                  <ShoppingOutlined /> {ADMIN_STRINGS.tabs.productsList}
                </span>
              ),
              children: (
                <div>
                  <div style={styles.tableActionsContainer}>
                    <BaseButton
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddProduct}
                    >
                      {ADMIN_STRINGS.tabs.addProduct}
                    </BaseButton>
                  </div>
                  <Table
                    columns={productColumns}
                    dataSource={products}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                    scroll={{ x: 800 }}
                  />
                </div>
              ),
            },
            {
              key: "orders",
              label: (
                <span style={styles.tabLabelText}>
                  <HistoryOutlined /> {ADMIN_STRINGS.tabs.ordersManagement}
                </span>
              ),
              children: (
                <Table
                  columns={orderColumns}
                  dataSource={orders}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 8 }}
                  scroll={{ x: 800 }}
                />
              ),
            },
            {
              key: "statistics",
              label: (
                <span style={styles.tabLabelText}>
                  <BarChartOutlined /> {ADMIN_STRINGS.tabs.statistics}
                </span>
              ),
              children: <StatisticsTab />,
            },
            {
              key: "chat",
              label: (
                <Badge count={totalUnread} offset={[10, 0]}>
                  <span style={styles.tabLabelText}>
                    <MessageOutlined /> {ADMIN_STRINGS.tabs.chat}
                  </span>
                </Badge>
              ),
              children: <AdminChat />,
            },
            {
              key: "notifications",
              label: (
                <span style={styles.tabLabelText}>
                  <BellOutlined /> {ADMIN_STRINGS.tabs.notifications}
                </span>
              ),
              children: <NotificationManagement />,
            },
            {
              key: "vouchers",
              label: (
                <span style={styles.tabLabelText}>
                  <GiftOutlined /> {ADMIN_STRINGS.tabs.vouchers}
                </span>
              ),
              children: <VoucherManagement />,
            },
            {
              key: "reviews",
              label: (
                <span style={styles.tabLabelText}>
                  <StarOutlined /> {ADMIN_STRINGS.tabs.reviews}
                </span>
              ),
              children: <ReviewModeration />,
            },
            {
              key: "banners",
              label: (
                <span style={styles.tabLabelText}>
                  <PictureOutlined /> {ADMIN_STRINGS.tabs.banners}
                </span>
              ),
              children: <BannerManagement />,
            },
          ]}
        />
      </Card>

      <Modal
        title={
          <Title level={4} style={styles.modalTitle}>
            {editingId ? ADMIN_STRINGS.modal.titleUpdate : ADMIN_STRINGS.modal.titleAdd}
          </Title>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okButtonProps={{ loading: loading }}
        width={800}
        style={styles.modalStyle}
        styles={{
          body: styles.modalBody,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={styles.formContainer}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                name="name"
                label={ADMIN_STRINGS.modal.nameLabel}
                rules={[
                  { required: true, message: ADMIN_STRINGS.modal.nameRequired },
                ]}
              >
                <Input size="large" placeholder={ADMIN_STRINGS.modal.namePlaceholder} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="brand" label={ADMIN_STRINGS.modal.brandLabel}>
                <Input size="large" placeholder={ADMIN_STRINGS.modal.brandPlaceholder} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="originalPrice"
                label={ADMIN_STRINGS.modal.priceLabel}
                rules={[{ required: true, message: ADMIN_STRINGS.modal.priceRequired }]}
              >
                <InputNumber
                  size="large"
                  style={styles.inputNumberWidth}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="discountPercent" label={ADMIN_STRINGS.modal.discountLabel}>
                <InputNumber
                  size="large"
                  min={0}
                  max={99}
                  style={styles.inputNumberWidth}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <div style={styles.discountPreview}>
                <Text style={{ color: "var(--text-muted)" }}>
                  {ADMIN_STRINGS.modal.discountPriceLabel}
                </Text>
                <Text strong style={styles.discountPrice}>
                  {livePrice.toLocaleString("vi-VN")} đ
                </Text>
              </div>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label={ADMIN_STRINGS.modal.categoryLabel}
                rules={[{ required: true, message: ADMIN_STRINGS.modal.categoryRequired }]}
              >
                <Select
                  size="large"
                  options={categories.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  prefix={<AppstoreOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="stockQuantity"
                label={ADMIN_STRINGS.modal.stockLabel}
                rules={[{ required: true, message: ADMIN_STRINGS.modal.stockRequired }]}
              >
                <InputNumber size="large" style={styles.inputNumberWidth} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="isBestSeller"
                label={ADMIN_STRINGS.modal.bestSellerLabel}
                valuePropName="checked"
              >
                <Select
                  size="large"
                  options={[
                    { label: ADMIN_STRINGS.modal.yes, value: true },
                    { label: ADMIN_STRINGS.modal.no, value: false },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="isActive"
                label={ADMIN_STRINGS.modal.activeLabel}
                valuePropName="checked"
                initialValue={true}
              >
                <Select
                  size="large"
                  options={[
                    { label: ADMIN_STRINGS.modal.public, value: true },
                    { label: ADMIN_STRINGS.modal.hidden, value: false },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <Space>
                <UploadOutlined /> {ADMIN_STRINGS.modal.imageLabel}
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={6}>
                <Upload
                  beforeUpload={() => false}
                  listType="picture-card"
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={styles.uploadButtonText}>{ADMIN_STRINGS.modal.uploadBtn}</div>
                    </div>
                  )}
                </Upload>
              </Col>
              <Col span={18}>
                <Form.Item name="imageUrl">
                  <Input
                    placeholder={ADMIN_STRINGS.modal.urlPlaceholder}
                    style={styles.imageUrlInput}
                    disabled={fileList.length > 0}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="moreImages"
              label={ADMIN_STRINGS.modal.moreImagesLabel}
            >
              <Input.TextArea placeholder="URL1, URL2, URL3..." rows={2} />
            </Form.Item>
          </Form.Item>

          <Form.Item name="description" label={ADMIN_STRINGS.modal.descLabel}>
            <Input.TextArea
              rows={2}
              placeholder={ADMIN_STRINGS.modal.descPlaceholder}
            />
          </Form.Item>

          <Form.Item
            name="specifications"
            label={
              <Space>
                <InfoCircleOutlined /> {ADMIN_STRINGS.modal.specsLabel}
              </Space>
            }
            help={ADMIN_STRINGS.modal.specsHelp}
          >
            <Input.TextArea
              rows={4}
              placeholder={ADMIN_STRINGS.modal.specsPlaceholder}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default AdminDashboard;
