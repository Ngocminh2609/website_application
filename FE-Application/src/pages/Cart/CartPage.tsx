import React, { useState, useEffect } from "react";
import vnpayLogo from "../../assets/vnpay-logo.png";
import {
  Layout,
  Typography,
  Table,
  Space,
  InputNumber,
  Card,
  Row,
  Col,
  Empty,
  Tag,
  Modal,
  Form,
  Input,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  TagOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  HomeOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { cartApi } from "../../api/cartApi";
import { paymentApi } from "../../api/paymentApi";
import { couponApi } from "../../api/couponApi";
import { addressApi } from "../../api/addressApi";
import type { UserAddress } from "../../api/addressApi";
import type { User } from "../../types/auth";
import type { CartItem } from "../../types/cart";
import type { CouponValidateResponse } from "../../types/coupon-review";
import { useCart } from "../../hooks/useCart";
import BaseButton from "../../components/common/BaseButton";
import { notification } from "../../utils/notification";
import type { ColumnsType } from "antd/es/table";
import PersonalizedRecommendations from "../../components/common/PersonalizedRecommendations";
import { Radio, Divider, Select } from "antd";

// Các Interface cho dữ liệu từ Provinces API
interface ApiProvince {
  code: number;
  name: string;
}

interface ApiWard {
  code: number;
  name: string;
}

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * Trang Giỏ hàng với Quy trình Checkout chuyên nghiệp.
 */
const CartPage: React.FC = () => {
  const { cart, loading, refreshCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [addressForm] = Form.useForm();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [provinces, setProvinces] = useState<ApiProvince[]>([]);
  const [wards, setWards] = useState<ApiWard[]>([]);
  const [wardsLoading, setWardsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"VNPAY" | "COD">("VNPAY");

  useEffect(() => {
    // Fetch danh sách tỉnh thành khi trang web load
    const fetchProvinces = async () => {
      try {
        // Sử dụng API v2 để lấy danh sách 34 tỉnh thành mới nhất năm 2026
        const response = await fetch("https://provinces.open-api.vn/api/v2/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error: unknown) {
        console.error("Lỗi khi tải danh sách tỉnh thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    refreshCart(true);
  }, [refreshCart, location.key]);

  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] =
    useState<CouponValidateResponse | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await cartApi.updateQuantity(itemId, quantity);
      await refreshCart(true);
    } catch {
      notification.error("Không thể cập nhật số lượng");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await cartApi.removeItem(itemId);
      await refreshCart(true);
      notification.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch {
      notification.error("Lỗi khi xóa sản phẩm");
    }
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const total = calculateTotal();
    if (total <= 0) return;
    try {
      setCouponLoading(true);
      setCouponError(null);
      const result = await couponApi.validate(couponCode.trim(), total);
      setCouponResult(result);
    } catch (err: unknown) {
      setCouponResult(null);
      setCouponError(
        err instanceof Error ? err.message : "Mã giảm giá không hợp lệ",
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponCode("");
    setCouponError(null);
  };

  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const data = await addressApi.getAddresses();
      setAddresses(data);
      const defaultAddr = data.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    } catch {
      notification.error("Không thể tải danh sách địa chỉ");
    } finally {
      setAddressLoading(false);
    }
  };

  const handlePaymentClick = () => {
    const amount = calculateTotal();
    if (amount <= 0) {
      notification.error("Giỏ hàng trống");
      return;
    }
    setIsModalVisible(true);
    fetchAddresses();
  };

  const handleAddAddress = async (
    values: Omit<UserAddress, "id" | "isDefault">,
  ) => {
    try {
      setCheckoutLoading(true);
      const newAddress = await addressApi.addAddress({
        ...values,
        isDefault: addresses.length === 0, // Tự động làm mặc định nếu là địa chỉ đầu tiên
      });
      setAddresses([newAddress, ...addresses]);
      setSelectedAddressId(newAddress.id);
      setIsAddingAddress(false);
      addressForm.resetFields();
      setWards([]);
      notification.success("Đã thêm địa chỉ mới");
    } catch {
      notification.error("Lỗi khi thêm địa chỉ");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleProvinceChange = async (
    provinceCode: number,
    option:
      | { label: string; value: string | number }
      | { label: string; value: string | number }[]
      | undefined,
  ) => {
    if (!option || Array.isArray(option)) return;
    try {
      setWardsLoading(true);
      const provinceName = (option as { label: string }).label;

      addressForm.setFieldsValue({
        province: provinceName,
        ward: undefined,
      });

      const response = await fetch(
        `https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`,
      );
      const data = await response.json();
      setWards(data.wards || []);
    } catch {
      notification.error("Không thể tải danh sách Phường/Xã");
    } finally {
      setWardsLoading(false);
    }
  };

  const handleProvinceSearch = (val: string) => {
    if (!val) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (addressForm.getFieldValue("province_code")) {
        addressForm.setFieldsValue({
          province: undefined,
          province_code: undefined,
          ward: undefined,
        });
        setWards([]);
      }
    }, 150);
  };

  const handleWardSearch = (val: string) => {
    if (!val) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (addressForm.getFieldValue("ward")) {
        addressForm.setFieldsValue({ ward: undefined });
      }
    }, 150);
  };

  const handleConfirmPayment = async () => {
    if (!selectedAddressId) {
      notification.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddr) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      notification.error("Bạn cần đăng nhập để thanh toán");
      return;
    }
    const user = JSON.parse(userStr) as User;

    const fullAddressString = `${selectedAddr.detailAddress}, ${selectedAddr.ward}, ${selectedAddr.province}`;

    try {
      setCheckoutLoading(true);
      const response = await paymentApi.createOrderPayment({
        username: user.username,
        address: fullAddressString,
        phone: selectedAddr.phoneNumber,
        couponCode: couponResult?.code,
        paymentMethod,
      });

      if (paymentMethod === "VNPAY" && response.url) {
        window.location.href = response.url;
      } else if (paymentMethod === "COD") {
        notification.success("Đơn hàng đã được đặt thành công (COD)!");
        // response.url lúc này chứa "ORDER_ID=...&AMOUNT=..."
        navigate(`/payment-success?status=OK&method=COD&${response.url}`);
      }
    } catch (error: unknown) {
      notification.error(
        error instanceof Error ? error.message : "Lỗi khởi tạo thanh toán",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const columns: ColumnsType<CartItem> = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <Space size="middle">
          <img
            src={record.product.imageUrl}
            alt={record.product.name}
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              objectFit: "cover",
            }}
            className="desktop-only"
          />
          <div>
            <Text
              strong
              style={{ display: "block", maxWidth: "150px" }}
              ellipsis
            >
              {record.product.name}
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.product.price.toLocaleString("vi-VN")}đ
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty: number, record) => (
        <InputNumber
          min={1}
          value={qty}
          onChange={(val) => handleUpdateQuantity(record.id, val || 1)}
          style={{ width: "60px" }}
        />
      ),
    },
    {
      title: "Tổng",
      key: "subtotal",
      render: (_, record) => (
        <Text strong style={{ color: "var(--primary-color)" }}>
          {(record.product.price * record.quantity).toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <BaseButton
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id)}
        />
      ),
    },
  ];

  return (
    <Content className="main-content">
      <div
        style={{
          marginBottom: "40px",
          textAlign: window.innerWidth < 768 ? "center" : "left",
        }}
      >
        <Title level={2} style={{ color: "var(--text-main)", margin: 0 }}>
          Giỏ Hàng
        </Title>
        <Text style={{ color: "var(--text-muted)" }}>
          Tiến hành checkout sản phẩm của bạn
        </Text>
      </div>

      {!cart || cart.items.length === 0 ? (
        <Card
          className="glass-effect"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <Empty
            image={
              <ShoppingCartOutlined
                style={{ fontSize: 64, color: "var(--primary-color)" }}
              />
            }
            description={
              <Text style={{ color: "var(--text-muted)" }}>
                Giỏ hàng của bạn đang trống
              </Text>
            }
          >
            <BaseButton
              type="primary"
              onClick={() => (window.location.href = "/")}
            >
              Mua sắm ngay
            </BaseButton>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={16}>
            <Card
              className="glass-effect"
              styles={{
                body: { padding: window.innerWidth < 768 ? "10px" : "24px" },
              }}
            >
              <Table
                columns={columns}
                dataSource={cart.items}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{ x: 400 }}
              />
            </Card>
          </Col>
          <Col xs={24} xl={8}>
            <Card
              title={
                <span style={{ color: "var(--text-main)" }}>
                  <CreditCardOutlined /> Hóa đơn thanh toán
                </span>
              }
              className="glass-effect"
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="large"
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: "var(--text-muted)" }}>Tạm tính:</Text>
                  <Text style={{ color: "var(--text-main)" }}>
                    {calculateTotal().toLocaleString("vi-VN")}đ
                  </Text>
                </div>

                {/* Khu vực nhập mã giảm giá */}
                <div>
                  <Text
                    style={{
                      color: "var(--text-muted)",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    <TagOutlined /> Mã giảm giá
                  </Text>
                  {couponResult ? (
                    <div
                      style={{
                        background: "rgba(34, 197, 94, 0.1)",
                        border: "1px solid rgba(34, 197, 94, 0.4)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Space>
                        <CheckCircleOutlined style={{ color: "#22c55e" }} />
                        <Text style={{ color: "#22c55e", fontWeight: 600 }}>
                          {couponResult.code}{" "}
                          {couponResult.discountType === "PERCENT"
                            ? `(-${couponResult.discountValue}%)`
                            : ""}
                        </Text>
                        <Text style={{ color: "#22c55e", fontSize: 12 }}>
                          -{couponResult.discountAmount.toLocaleString("vi-VN")}
                          đ
                          {couponResult.maxDiscountAmount &&
                            couponResult.discountAmount >=
                              couponResult.maxDiscountAmount && (
                              <span style={{ fontSize: "10px", marginLeft: 4 }}>
                                (Tối đa)
                              </span>
                            )}
                        </Text>
                      </Space>
                      <CloseCircleOutlined
                        style={{ color: "#22c55e", cursor: "pointer" }}
                        onClick={handleRemoveCoupon}
                      />
                    </div>
                  ) : (
                    <Space.Compact style={{ width: "100%" }}>
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        onPressEnter={handleApplyCoupon}
                        status={couponError ? "error" : undefined}
                        style={{ textTransform: "uppercase" }}
                      />
                      <BaseButton
                        onClick={handleApplyCoupon}
                        loading={couponLoading}
                        type="primary"
                      >
                        {couponLoading ? <Spin size="small" /> : "Mã"}
                      </BaseButton>
                    </Space.Compact>
                  )}
                  {couponError && (
                    <Text
                      style={{
                        color: "#ef4444",
                        fontSize: 12,
                        marginTop: 6,
                        display: "block",
                      }}
                    >
                      {couponError}
                    </Text>
                  )}
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: "var(--text-muted)" }}>
                    Vận chuyển:
                  </Text>
                  <Tag color="green">Miễn phí toàn quốc</Tag>
                </div>
                {couponResult && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text style={{ color: "#22c55e" }}>
                      Giảm giá{" "}
                      {couponResult.discountType === "PERCENT"
                        ? `(${couponResult.discountValue}%)`
                        : ""}
                      :
                    </Text>
                    <Text style={{ color: "#22c55e", fontWeight: 600 }}>
                      -{couponResult.discountAmount.toLocaleString("vi-VN")}đ
                    </Text>
                  </div>
                )}
                <div
                  style={{
                    borderTop: "1px solid var(--glass-border)",
                    paddingTop: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    strong
                    style={{ color: "var(--text-main)", fontSize: "18px" }}
                  >
                    Tổng cộng:
                  </Text>
                  <Text
                    strong
                    style={{ color: "var(--primary-color)", fontSize: "24px" }}
                  >
                    {(couponResult
                      ? couponResult.finalAmount
                      : calculateTotal()
                    ).toLocaleString("vi-VN")}
                    đ
                  </Text>
                </div>
                <BaseButton
                  type="primary"
                  style={{
                    width: "100%",
                    height: "50px",
                    fontSize: "1.1rem",
                    marginTop: "10px",
                    background: "var(--primary-gradient)",
                    border: "none",
                  }}
                  onClick={handlePaymentClick}
                >
                  Thanh Toán VNPay
                </BaseButton>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <img
                    src={vnpayLogo}
                    alt="VNPay"
                    style={{ height: 30, opacity: 1 }}
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      <PersonalizedRecommendations
        title="Khám Phá Thêm"
        description="Sản phẩm công nghệ cao cấp bạn có thể quan tâm."
        limit={5}
      />

      {/* Modal Checkout Đa Địa Chỉ */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <HomeOutlined style={{ color: "var(--primary-color)" }} />
            <Title level={4} style={{ margin: 0 }}>
              Thông tin nhận hàng
            </Title>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsAddingAddress(false);
        }}
        footer={null}
        width={650}
        className="checkout-modal"
        centered
      >
        {addressLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" tip="Đang tải địa chỉ..." />
          </div>
        ) : isAddingAddress || addresses.length === 0 ? (
          <Form
            form={addressForm}
            layout="vertical"
            onFinish={handleAddAddress}
            style={{ marginTop: 20 }}
            initialValues={{ isDefault: addresses.length === 0 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="fullName"
                  label="Họ và tên người nhận"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                >
                  <Input placeholder="Nguyễn Văn A" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  getValueFromEvent={(e) =>
                    e.target.value.replace(/[^0-9]/g, "")
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ (10-11 số)",
                    },
                  ]}
                >
                  <Input placeholder="09xxxxxxxx" maxLength={11} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="province_code"
                  label="Tỉnh/Thành phố"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select
                    showSearch
                    allowClear
                    virtual={true}
                    listHeight={250}
                    placeholder="Chọn hoặc gõ tìm kiếm..."
                    onChange={handleProvinceChange}
                    onSearch={handleProvinceSearch}
                    optionFilterProp="label"
                    options={provinces.map((p) => ({
                      label: p.name,
                      value: p.code,
                    }))}
                  />
                </Form.Item>
                {/* Trường ẩn để lưu tên tỉnh phục vụ việc gửi lên BE */}
                <Form.Item name="province" noStyle>
                  <input type="hidden" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ward"
                  label="Phường/Xã"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select
                    showSearch
                    allowClear
                    virtual={true}
                    listHeight={250}
                    placeholder="Chọn Phường/Xã..."
                    loading={wardsLoading}
                    disabled={wards.length === 0}
                    onSearch={handleWardSearch}
                    optionFilterProp="label"
                    options={wards.map((w) => ({
                      label: w.name,
                      value: w.name,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="detailAddress"
              label="Địa chỉ chi tiết"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
              ]}
            >
              <Input.TextArea rows={2} placeholder="Số nhà, tên đường..." />
            </Form.Item>

            <div style={{ marginTop: 24, display: "flex", gap: "12px" }}>
              <BaseButton
                type="primary"
                htmlType="submit"
                style={{ flex: 2, height: 45 }}
                loading={checkoutLoading}
              >
                Lưu địa chỉ & Tiếp tục
              </BaseButton>
              {addresses.length > 0 && (
                <BaseButton
                  type="text"
                  onClick={() => setIsAddingAddress(false)}
                  style={{ flex: 1, height: 45 }}
                >
                  Hủy bỏ
                </BaseButton>
              )}
            </div>
          </Form>
        ) : (
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text strong>Chọn địa chỉ giao hàng:</Text>
              <BaseButton
                type="text"
                icon={<PlusOutlined />}
                onClick={() => setIsAddingAddress(true)}
                style={{ color: "var(--primary-color)" }}
              >
                Thêm địa chỉ mới
              </BaseButton>
            </div>

            <Radio.Group
              onChange={(e) => setSelectedAddressId(e.target.value)}
              value={selectedAddressId}
              style={{ width: "100%" }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                {addresses.map((addr) => (
                  <Radio
                    key={addr.id}
                    value={addr.id}
                    className={`address-item-radio ${selectedAddressId === addr.id ? "active" : ""}`}
                    style={{
                      width: "100%",
                      padding: "16px",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "12px",
                      margin: 0,
                      background:
                        selectedAddressId === addr.id
                          ? "rgba(99, 102, 241, 0.05)"
                          : "transparent",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        marginLeft: "8px",
                        verticalAlign: "top",
                        width: "90%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Text strong style={{ fontSize: "16px" }}>
                          {addr.fullName}
                        </Text>
                        {addr.isDefault && (
                          <Tag
                            color="blue"
                            style={{ borderRadius: "4px", margin: 0 }}
                          >
                            Mặc định
                          </Tag>
                        )}
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <Text type="secondary">
                          <PhoneOutlined /> {addr.phoneNumber}
                        </Text>
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <Text style={{ color: "var(--text-main)" }}>
                          <EnvironmentOutlined /> {addr.detailAddress},{" "}
                          {addr.ward}, {addr.province}
                        </Text>
                      </div>
                    </div>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>

            <Divider style={{ margin: "24px 0" }} />

            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: "block", marginBottom: 12 }}>
                Hình thức thanh toán:
              </Text>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Radio
                    value="VNPAY"
                    className={`payment-method-item ${paymentMethod === "VNPAY" ? "active" : ""}`}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "8px",
                      margin: 0,
                      background:
                        paymentMethod === "VNPAY"
                          ? "rgba(99, 102, 241, 0.05)"
                          : "transparent",
                    }}
                  >
                    <Space>
                      <img src={vnpayLogo} alt="VNPay" style={{ height: 20 }} />
                      <Text>
                        Thanh toán qua VNPay (ATM/Internet Banking/QR Code)
                      </Text>
                    </Space>
                  </Radio>
                  <Radio
                    value="COD"
                    className={`payment-method-item ${paymentMethod === "COD" ? "active" : ""}`}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "8px",
                      margin: 0,
                      background:
                        paymentMethod === "COD"
                          ? "rgba(99, 102, 241, 0.05)"
                          : "transparent",
                    }}
                  >
                    <Space>
                      <CreditCardOutlined
                        style={{ color: "var(--primary-color)", fontSize: 18 }}
                      />
                      <Text>Thanh toán khi nhận hàng (COD)</Text>
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>

            <BaseButton
              type="primary"
              style={{
                width: "100%",
                height: 50,
                fontSize: "1.1rem",
                borderRadius: "12px",
              }}
              loading={checkoutLoading}
              onClick={handleConfirmPayment}
              icon={<CheckOutlined />}
            >
              {paymentMethod === "VNPAY"
                ? "Tiếp tục thanh toán VNPay"
                : "Xác nhận đặt hàng"}
            </BaseButton>
          </div>
        )}
      </Modal>
    </Content>
  );
};

export default CartPage;
