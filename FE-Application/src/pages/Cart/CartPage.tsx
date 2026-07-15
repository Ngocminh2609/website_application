import React from "react";
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
import { useCartPageState } from "../../hooks/Cart/useCartPageState";
import BaseButton from "../../components/common/BaseButton";
import type { ColumnsType } from "antd/es/table";
import type { CartItem } from "../../types/cart";
import PersonalizedRecommendations from "../../components/common/PersonalizedRecommendations";
import { Radio, Divider, Select } from "antd";
import { styles } from "./styles/cart-page.styles";
import { CART_STRINGS } from "../../constants/Cart/cart-page";
import { formatCartCurrency } from "./helper";
import { phoneRules } from "../../utils/validationRules";

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * Trang Giỏ hàng với Quy trình Checkout chuyên nghiệp.
 */
const CartPage: React.FC = () => {
  const {
    cart,
    loading,
    isModalVisible,
    setIsModalVisible,
    checkoutLoading,
    addressForm,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddingAddress,
    setIsAddingAddress,
    addressLoading,
    provinces,
    wards,
    wardsLoading,
    paymentMethod,
    setPaymentMethod,
    couponCode,
    setCouponCode,
    couponResult,
    couponLoading,
    couponError,
    setCouponError,
    handleUpdateQuantity,
    handleRemoveItem,
    calculateTotal,
    handleApplyCoupon,
    handleRemoveCoupon,
    handlePaymentClick,
    handleAddAddress,
    handleProvinceChange,
    handleProvinceSearch,
    handleWardSearch,
    handleConfirmPayment,
  } = useCartPageState();

  const columns: ColumnsType<CartItem> = [
    {
      title: CART_STRINGS.table.product,
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
              {formatCartCurrency(record.product.price)}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: CART_STRINGS.table.quantity,
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
      title: CART_STRINGS.table.total,
      key: "subtotal",
      render: (_, record) => (
        <Text strong style={{ color: "var(--primary-color)" }}>
          {formatCartCurrency(record.product.price * record.quantity)}
        </Text>
      ),
    },
    {
      title: CART_STRINGS.table.action,
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
        <Title level={2} style={styles.billingTitle}>
          {CART_STRINGS.header.title}
        </Title>
        <Text style={styles.billingLabel}>
          {CART_STRINGS.header.subtitle}
        </Text>
      </div>

      {!cart || cart.items.length === 0 ? (
        <Card
          className="glass-effect"
          style={styles.emptyCartCard}
        >
          <Empty
            image={
              <ShoppingCartOutlined
                style={styles.emptyCartIcon}
              />
            }
            description={
              <Text style={styles.emptyCartText}>
                {CART_STRINGS.empty.title}
              </Text>
            }
          >
            <BaseButton
              type="primary"
              onClick={() => (window.location.href = "/")}
            >
              {CART_STRINGS.empty.btn}
            </BaseButton>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={16}>
            <Card
              className="glass-effect"
              styles={{
                body: styles.tableCardBody(window.innerWidth < 768),
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
                <span style={styles.billingTitle}>
                  <CreditCardOutlined /> {CART_STRINGS.invoice.title}
                </span>
              }
              className="glass-effect"
            >
              <Space
                direction="vertical"
                style={styles.fullWidth}
                size="large"
              >
                <div style={styles.spaceBetween}>
                  <Text style={styles.billingLabel}>{CART_STRINGS.invoice.subtotal}</Text>
                  <Text style={styles.billingValue}>
                    {formatCartCurrency(calculateTotal())}
                  </Text>
                </div>

                {/* Khu vực nhập mã giảm giá */}
                <div>
                  <Text style={styles.couponLabel}>
                    <TagOutlined /> {CART_STRINGS.invoice.coupon}
                  </Text>
                  {couponResult ? (
                    <div style={styles.couponSuccessWrapper}>
                      <Space>
                        <CheckCircleOutlined style={{ color: "#22c55e" }} />
                        <Text style={styles.couponSuccessText}>
                          {couponResult.code}{" "}
                          {couponResult.discountType === "PERCENT"
                            ? `(-${couponResult.discountValue}%)`
                            : ""}
                        </Text>
                        <Text style={styles.couponSuccessSubtext}>
                          -{formatCartCurrency(couponResult.discountAmount)}
                          {couponResult.maxDiscountAmount &&
                            couponResult.discountAmount >=
                            couponResult.maxDiscountAmount && (
                              <span style={styles.couponMaxText}>
                                {CART_STRINGS.invoice.maxDiscount}
                              </span>
                            )}
                        </Text>
                      </Space>
                      <CloseCircleOutlined
                        style={styles.couponSuccessClose}
                        onClick={handleRemoveCoupon}
                      />
                    </div>
                  ) : (
                    <Space.Compact style={styles.fullWidth}>
                      <Input
                        placeholder={CART_STRINGS.invoice.couponPlaceholder}
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        onPressEnter={handleApplyCoupon}
                        status={couponError ? "error" : undefined}
                        style={styles.couponInput}
                      />
                      <BaseButton
                        onClick={handleApplyCoupon}
                        loading={couponLoading}
                        type="primary"
                      >
                        {couponLoading ? <Spin size="small" /> : CART_STRINGS.invoice.couponApplyBtn}
                      </BaseButton>
                    </Space.Compact>
                  )}
                  {couponError && (
                    <Text style={styles.couponErrorText}>
                      {couponError}
                    </Text>
                  )}
                </div>

                <div style={styles.spaceBetween}>
                  <Text style={styles.billingLabel}>
                    {CART_STRINGS.invoice.shipping}
                  </Text>
                  <Tag color="green">{CART_STRINGS.invoice.freeShipping}</Tag>
                </div>
                {couponResult && (
                  <div style={styles.spaceBetween}>
                    <Text style={styles.discountLabel}>
                      {CART_STRINGS.invoice.discount}
                      {couponResult.discountType === "PERCENT"
                        ? `(${couponResult.discountValue}%)`
                        : ""}
                      :
                    </Text>
                    <Text style={styles.discountValue}>
                      -{formatCartCurrency(couponResult.discountAmount)}
                    </Text>
                  </div>
                )}
                <div style={styles.totalDivider}>
                  <Text strong style={styles.totalLabel}>
                    {CART_STRINGS.invoice.total}
                  </Text>
                  <Text strong style={styles.totalValue}>
                    {formatCartCurrency(
                      couponResult ? couponResult.finalAmount : calculateTotal(),
                    )}
                  </Text>
                </div>
                <BaseButton
                  type="primary"
                  style={styles.paymentButton}
                  onClick={handlePaymentClick}
                >
                  {CART_STRINGS.invoice.payBtn}
                </BaseButton>
                <div style={styles.vnpayLogoContainer}>
                  <img
                    src={vnpayLogo}
                    alt="VNPay"
                    style={styles.vnpayLogo}
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      <PersonalizedRecommendations
        title={CART_STRINGS.recommendations.title}
        description={CART_STRINGS.recommendations.description}
        limit={5}
      />

      {/* Modal Checkout Đa Địa Chỉ */}
      <Modal
        title={
          <div style={styles.modalTitleContainer}>
            <HomeOutlined style={styles.codIcon} />
            <Title level={4} style={styles.modalTitleText}>
              {CART_STRINGS.modal.title}
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
          <div style={styles.modalSpinner}>
            <Spin size="large" tip={CART_STRINGS.modal.loadingAddress} />
          </div>
        ) : isAddingAddress || addresses.length === 0 ? (
          <Form
            form={addressForm}
            layout="vertical"
            onFinish={handleAddAddress}
            style={styles.formContainer}
            initialValues={{ isDefault: addresses.length === 0 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="fullName"
                  label={CART_STRINGS.modal.fullNameLabel}
                  rules={[{ required: true, message: CART_STRINGS.modal.fullNameRequired }]}
                >
                  <Input placeholder={CART_STRINGS.modal.fullNamePlaceholder} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phoneNumber"
                  label={CART_STRINGS.modal.phoneLabel}
                  getValueFromEvent={(e) =>
                    e.target.value.replace(/[^0-9]/g, "")
                  }
                  rules={phoneRules(CART_STRINGS.modal.phoneInvalid, {
                    required: true,
                    requiredMessage: CART_STRINGS.modal.phoneRequired,
                  })}
                >
                  <Input placeholder={CART_STRINGS.modal.phonePlaceholder} maxLength={11} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="province_code"
                  label={CART_STRINGS.modal.provinceLabel}
                  rules={[{ required: true, message: CART_STRINGS.modal.required }]}
                >
                  <Select
                    showSearch
                    allowClear
                    virtual={true}
                    listHeight={250}
                    placeholder={CART_STRINGS.modal.provincePlaceholder}
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
                  label={CART_STRINGS.modal.wardLabel}
                  rules={[{ required: true, message: CART_STRINGS.modal.required }]}
                >
                  <Select
                    showSearch
                    allowClear
                    virtual={true}
                    listHeight={250}
                    placeholder={CART_STRINGS.modal.wardPlaceholder}
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
              label={CART_STRINGS.modal.detailLabel}
              rules={[
                { required: true, message: CART_STRINGS.modal.detailRequired },
              ]}
            >
              <Input.TextArea rows={2} placeholder={CART_STRINGS.modal.detailPlaceholder} />
            </Form.Item>

            <div style={styles.formActionButtons}>
              <BaseButton
                type="primary"
                htmlType="submit"
                style={styles.buttonFlex2}
                loading={checkoutLoading}
              >
                {CART_STRINGS.modal.saveBtn}
              </BaseButton>
              {addresses.length > 0 && (
                <BaseButton
                  type="text"
                  onClick={() => setIsAddingAddress(false)}
                  style={styles.buttonFlex1}
                >
                  {CART_STRINGS.modal.cancelBtn}
                </BaseButton>
              )}
            </div>
          </Form>
        ) : (
          <div style={styles.formContainer}>
            <div style={styles.addressHeader}>
              <Text strong>{CART_STRINGS.modal.selectAddress}</Text>
              <BaseButton
                type="text"
                icon={<PlusOutlined />}
                onClick={() => setIsAddingAddress(true)}
                style={styles.addAddressBtn}
              >
                {CART_STRINGS.modal.addAddressBtn}
              </BaseButton>
            </div>

            <Radio.Group
              onChange={(e) => setSelectedAddressId(e.target.value)}
              value={selectedAddressId}
              style={styles.fullWidth}
            >
              <Space
                direction="vertical"
                style={styles.fullWidth}
                size="middle"
              >
                {addresses.map((addr) => (
                  <Radio
                    key={addr.id}
                    value={addr.id}
                    className={`address-item-radio ${selectedAddressId === addr.id ? "active" : ""}`}
                    style={styles.addressItemRadio(selectedAddressId === addr.id)}
                  >
                    <div style={styles.addressMeta}>
                      <div style={styles.addressTitleRow}>
                        <Text strong style={styles.addressFullName}>
                          {addr.fullName}
                        </Text>
                        {addr.isDefault && (
                          <Tag
                            color="blue"
                            style={styles.defaultTag}
                          >
                            {CART_STRINGS.modal.defaultTag}
                          </Tag>
                        )}
                      </div>
                      <div style={styles.addressPhone}>
                        <Text type="secondary">
                          <PhoneOutlined /> {addr.phoneNumber}
                        </Text>
                      </div>
                      <div style={styles.addressDetail}>
                        <Text style={styles.addressDetailText}>
                          <EnvironmentOutlined /> {addr.detailAddress},{" "}
                          {addr.ward}, {addr.province}
                        </Text>
                      </div>
                    </div>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>

            <Divider style={styles.dividerMargin} />

            <div style={{ marginBottom: 24 }}>
              <Text strong style={styles.paymentMethodTitle}>
                {CART_STRINGS.modal.paymentMethodLabel}
              </Text>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                style={styles.fullWidth}
              >
                <Space direction="vertical" style={styles.fullWidth}>
                  <Radio
                    value="VNPAY"
                    className={`payment-method-item ${paymentMethod === "VNPAY" ? "active" : ""}`}
                    style={styles.paymentMethodItem(paymentMethod === "VNPAY")}
                  >
                    <Space>
                      <img src={vnpayLogo} alt="VNPay" style={styles.vnpayLogoSmall} />
                      <Text>
                        {CART_STRINGS.modal.vnpayLabel}
                      </Text>
                    </Space>
                  </Radio>
                  <Radio
                    value="COD"
                    className={`payment-method-item ${paymentMethod === "COD" ? "active" : ""}`}
                    style={styles.paymentMethodItem(paymentMethod === "COD")}
                  >
                    <Space>
                      <CreditCardOutlined
                        style={styles.codIcon}
                      />
                      <Text>{CART_STRINGS.modal.codLabel}</Text>
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>

            <BaseButton
              type="primary"
              style={styles.confirmButton}
              loading={checkoutLoading}
              onClick={handleConfirmPayment}
              icon={<CheckOutlined />}
            >
              {paymentMethod === "VNPAY"
                ? CART_STRINGS.modal.continueVNPay
                : CART_STRINGS.modal.confirmOrder}
            </BaseButton>
          </div>
        )}
      </Modal>
    </Content>
  );
};

export default CartPage;
