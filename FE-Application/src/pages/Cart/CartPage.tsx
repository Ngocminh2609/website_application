import React from 'react';
import { Layout, Typography, Table, Space, InputNumber, Card, Row, Col, Empty, Tag } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { cartApi } from '../../api/cartApi';
import type { CartItem } from '../../types/cart';
import { useCart } from '../../hooks/useCart';
import BaseButton from '../../components/common/BaseButton';
import { notification } from '../../utils/notification';
import type { ColumnsType } from 'antd/es/table';

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * Trang Giỏ hàng với Layout đáp ứng.
 * Tự động chuyển đổi từ Row (Desktop) sang Column (Mobile) để tránh vỡ form.
 */
const CartPage: React.FC = () => {
    const { cart, loading, refreshCart } = useCart();

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
                        <Text type="secondary" style={{ fontSize: '12px' }}>${record.product.price}</Text>
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
                    ${(record.product.price * record.quantity).toFixed(0)}
                </Text>
            ),
        },
        {
            title: '',
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
                <Text style={{ color: 'var(--text-muted)' }}>Quản lý các sản phẩm bạn đã chọn</Text>
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
                                scroll={{ x: 400 }} // Hỗ trợ cuộn ngang trên màn hình rất nhỏ
                            />
                        </Card>
                    </Col>
                    <Col xs={24} xl={8}>
                        <Card
                            title={<span style={{ color: '#fff' }}>Hóa đơn thanh toán</span>}
                            className="glass-effect"
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size="large">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text style={{ color: 'var(--text-muted)' }}>Tạm tính:</Text>
                                    <Text style={{ color: '#fff' }}>${calculateTotal().toFixed(2)}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text style={{ color: 'var(--text-muted)' }}>Vận chuyển:</Text>
                                    <Tag color="green">Miễn phí</Tag>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <Text strong style={{ color: '#fff', fontSize: '18px' }}>Tổng cộng:</Text>
                                    <Text strong style={{ color: 'var(--primary-color)', fontSize: '24px' }}>${calculateTotal().toFixed(2)}</Text>
                                </div>
                                <BaseButton type="primary" style={{ width: '100%', height: '50px', fontSize: '1.1rem', marginTop: '10px' }}>
                                    Thanh Toán Ngay
                                </BaseButton>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            )}
        </Content>
    );
};

export default CartPage;
