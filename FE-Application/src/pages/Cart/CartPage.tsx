import React, { useState } from 'react';
import { Layout, Typography, Table, Space, InputNumber, Card, Row, Col, Empty, Tag, Modal, Form, Input } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, CreditCardOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { cartApi } from '../../api/cartApi';
import { paymentApi } from '../../api/paymentApi';
import type { CartItem } from '../../types/cart';
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [form] = Form.useForm();

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

    const handlePaymentClick = () => {
        const amount = calculateTotal();
        if (amount <= 0) {
            notification.error('Giỏ hàng trống');
            return;
        }
        setIsModalVisible(true);
    };

    const handleConfirmPayment = async (values: { address: string; phone: string }) => {
        // Lấy thông tin user từ localStorage
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
                values.phone
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
                <Text strong style={{ color: '#6366f1' }}>
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
                <Title level={2} style={{ color: '#fff', margin: 0 }}>Giỏ Hàng</Title>
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
                            title={<span style={{ color: '#fff' }}><CreditCardOutlined /> Hóa đơn thanh toán</span>}
                            className="glass-effect"
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size="large">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text style={{ color: 'var(--text-muted)' }}>Tạm tính:</Text>
                                    <Text style={{ color: '#fff' }}>{calculateTotal().toLocaleString('vi-VN')}đ</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text style={{ color: 'var(--text-muted)' }}>Vận chuyển:</Text>
                                    <Tag color="green">Miễn phí toàn quốc</Tag>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <Text strong style={{ color: '#fff', fontSize: '18px' }}>Tổng cộng:</Text>
                                    <Text strong style={{ color: 'var(--primary-color)', fontSize: '24px' }}>{calculateTotal().toLocaleString('vi-VN')}đ</Text>
                                </div>
                                <BaseButton
                                    type="primary"
                                    style={{ width: '100%', height: '50px', fontSize: '1.1rem', marginTop: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', border: 'none' }}
                                    onClick={handlePaymentClick}
                                >
                                    Thanh Toán VNPay
                                </BaseButton>
                                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <img src="http://localhost:9000/product-images/vnpay-logo.png" alt="VNPay" style={{ height: 30, opacity: 1 }} />
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
