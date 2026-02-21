import React, { useState, useEffect } from 'react';
import vnpayLogo from '../../assets/vnpay-logo.png';
import { Layout, Typography, Table, Space, InputNumber, Card, Row, Col, Empty, Tag, Modal, Form, Input, Spin } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, CreditCardOutlined, EnvironmentOutlined, PhoneOutlined, TagOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { cartApi } from '../../api/cartApi';
import { paymentApi } from '../../api/paymentApi';
import { couponApi } from '../../api/couponApi';
import type { CartItem } from '../../types/cart';
import type { CouponValidateResponse } from '../../types/coupon-review';
import { useCart } from '../../hooks/useCart';
import BaseButton from '../../components/common/BaseButton';
import { notification } from '../../utils/notification';
import type { ColumnsType } from 'antd/es/table';

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * Trang Giỏ hàng với Quy trình Checkout chuyên nghiệp.
 */
const CartPage: React.FC = () => {
    const { cart, loading, refreshCart } = useCart();
    const location = useLocation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        refreshCart(true);
    }, [refreshCart, location.key]);

    const [couponCode, setCouponCode] = useState('');
    const [couponResult, setCouponResult] = useState<CouponValidateResponse | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState<string | null>(null);

    const handleUpdateQuantity = async (itemId: number, quantity: number) => {
        try {
            await cartApi.updateQuantity(itemId, quantity);
            await refreshCart(true);
        } catch {
            notification.error('Không thể cập nhật số lượng');
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        try {
            await cartApi.removeItem(itemId);
            await refreshCart(true);
            notification.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch {
            notification.error('Lỗi khi xóa sản phẩm');
        }
    };

    const calculateTotal = () => {
        if (!cart) return 0;
        return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
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
            setCouponError(err instanceof Error ? err.message : 'Mã giảm giá không hợp lệ');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponResult(null);
        setCouponCode('');
        setCouponError(null);
    };

    const handlePaymentClick = () => {
        const amount = calculateTotal();
        if (amount <= 0) {
            notification.error('Giỏ hàng trống');
            return;
        }
        setIsModalVisible(true);
    };

    const handleConfirmPayment = async (values: { address: string; phone: string }) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            notification.error('Bạn cần đăng nhập để thanh toán');
            return;
        }
        const user = JSON.parse(userStr);

        try {
            setCheckoutLoading(true);
            const response = await paymentApi.createOrderPayment(
                user.username,
                values.address,
                values.phone,
                couponResult?.code
            );

            if (response.url) {
                window.location.href = response.url;
            }
        } catch (error: unknown) {
            notification.error(error instanceof Error ? error.message : 'Lỗi khởi tạo thanh toán');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const columns: ColumnsType<CartItem> = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record) => (
                <Space size="middle">
                    <img
                        src={record.product.imageUrl}
                        alt={record.product.name}
                        style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                        className="desktop-only"
                    />
                    <div>
                        <Text strong style={{ display: 'block', maxWidth: '150px' }} ellipsis>{record.product.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.product.price.toLocaleString('vi-VN')}đ</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (qty: number, record) => (
                <InputNumber
                    min={1}
                    value={qty}
                    onChange={(val) => handleUpdateQuantity(record.id, val || 1)}
                    style={{ width: '60px' }}
                />
            ),
        },
        {
            title: 'Tổng',
            key: 'subtotal',
            render: (_, record) => (
                <Text strong style={{ color: 'var(--primary-color)' }}>
                    {(record.product.price * record.quantity).toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
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
            <div style={{ marginBottom: '40px', textAlign: window.innerWidth < 768 ? 'center' : 'left' }}>
                <Title level={2} style={{ color: 'var(--text-main)', margin: 0 }}>Giỏ Hàng</Title>
                <Text style={{ color: 'var(--text-muted)' }}>Tiến hành checkout sản phẩm của bạn</Text>
            </div>

            {!cart || cart.items.length === 0 ? (
                <Card className="glass-effect" style={{ textAlign: 'center', padding: '50px' }}>
                    <Empty
                        image={<ShoppingCartOutlined style={{ fontSize: 64, color: 'var(--primary-color)' }} />}
                        description={<Text style={{ color: 'var(--text-muted)' }}>Giỏ hàng của bạn đang trống</Text>}
                    >
                        <BaseButton type="primary" onClick={() => window.location.href = '/'}>Mua sắm ngay</BaseButton>
                    </Empty>
                </Card>
            ) : (
                <Row gutter={[24, 24]}>
                    <Col xs={24} xl={16}>
                        <Card className="glass-effect" styles={{ body: { padding: window.innerWidth < 768 ? '10px' : '24px' } }}>
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
                            title={<span style={{ color: 'var(--text-main)' }}><CreditCardOutlined /> Hóa đơn thanh toán</span>}
                            className="glass-effect"
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size="large">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text style={{ color: 'var(--text-muted)' }}>Tạm tính:</Text>
                                    <Text style={{ color: 'var(--text-main)' }}>{calculateTotal().toLocaleString('vi-VN')}đ</Text>
                                </div>

                                {/* Khu vực nhập mã giảm giá */}
                                <div>
                                    <Text style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                                        <TagOutlined /> Mã giảm giá
                                    </Text>
                                    {couponResult ? (
                                        <div style={{
                                            background: 'rgba(34, 197, 94, 0.1)',
                                            border: '1px solid rgba(34, 197, 94, 0.4)',
                                            borderRadius: 10,
                                            padding: '10px 14px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Space>
                                                <CheckCircleOutlined style={{ color: '#22c55e' }} />
                                                <Text style={{ color: '#22c55e', fontWeight: 600 }}>
                                                    {couponResult.code} {couponResult.discountType === 'PERCENT' ? `(-${couponResult.discountValue}%)` : ''}
                                                </Text>
                                                <Text style={{ color: '#22c55e', fontSize: 12 }}>
                                                    -{couponResult.discountAmount.toLocaleString('vi-VN')}đ
                                                    {couponResult.maxDiscountAmount && couponResult.discountAmount >= couponResult.maxDiscountAmount && (
                                                        <span style={{ fontSize: '10px', marginLeft: 4 }}>(Tối đa)</span>
                                                    )}
                                                </Text>
                                            </Space>
                                            <CloseCircleOutlined
                                                style={{ color: '#22c55e', cursor: 'pointer' }}
                                                onClick={handleRemoveCoupon}
                                            />
                                        </div>
                                    ) : (
                                        <Space.Compact style={{ width: '100%' }}>
                                            <Input
                                                placeholder="Nhập mã giảm giá"
                                                value={couponCode}
                                                onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(null); }}
                                                onPressEnter={handleApplyCoupon}
                                                status={couponError ? 'error' : undefined}
                                                style={{ textTransform: 'uppercase' }}
                                            />
                                            <BaseButton onClick={handleApplyCoupon} loading={couponLoading} type="primary">
                                                {couponLoading ? <Spin size="small" /> : 'Mã'}
                                            </BaseButton>
                                        </Space.Compact>
                                    )}
                                    {couponError && (
                                        <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 6, display: 'block' }}>
                                            {couponError}
                                        </Text>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text style={{ color: 'var(--text-muted)' }}>Vận chuyển:</Text>
                                    <Tag color="green">Miễn phí toàn quốc</Tag>
                                </div>
                                {couponResult && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#22c55e' }}>Giảm giá {couponResult.discountType === 'PERCENT' ? `(${couponResult.discountValue}%)` : ''}:</Text>
                                        <Text style={{ color: '#22c55e', fontWeight: 600 }}>-{couponResult.discountAmount.toLocaleString('vi-VN')}đ</Text>
                                    </div>
                                )}
                                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <Text strong style={{ color: 'var(--text-main)', fontSize: '18px' }}>Tổng cộng:</Text>
                                    <Text strong style={{ color: 'var(--primary-color)', fontSize: '24px' }}>
                                        {(couponResult ? couponResult.finalAmount : calculateTotal()).toLocaleString('vi-VN')}đ
                                    </Text>
                                </div>
                                <BaseButton
                                    type="primary"
                                    style={{ width: '100%', height: '50px', fontSize: '1.1rem', marginTop: '10px', background: 'var(--primary-gradient)', border: 'none' }}
                                    onClick={handlePaymentClick}
                                >
                                    Thanh Toán VNPay
                                </BaseButton>
                                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <img src={vnpayLogo} alt="VNPay" style={{ height: 30, opacity: 1 }} />
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Modal Checkout */}
            <Modal
                title={<Title level={4} style={{ margin: 0 }}>Xác nhận thông tin giao hàng</Title>}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                className="checkout-modal"
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleConfirmPayment}
                    style={{ marginTop: 20 }}
                >
                    <Form.Item
                        name="address"
                        label="Địa chỉ nhận sắm"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhận hàng' }]}
                    >
                        <Input prefix={<EnvironmentOutlined />} placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện..." />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại liên lạc"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Ví dụ: 0912345678" />
                    </Form.Item>

                    <div style={{ marginTop: 32 }}>
                        <BaseButton
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%', height: 48, fontSize: '1rem' }}
                            loading={checkoutLoading}
                        >
                            Xác nhận & Thanh toán ngay
                        </BaseButton>
                        <BaseButton
                            type="text"
                            onClick={() => setIsModalVisible(false)}
                            style={{ width: '100%', marginTop: 12 }}
                        >
                            Quay lại
                        </BaseButton>
                    </div>
                </Form>
            </Modal>
        </Content>
    );
};

export default CartPage;
