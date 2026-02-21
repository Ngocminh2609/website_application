import React, { useEffect, useState } from 'react';
import { Layout, Typography, Table, Tag, Space, Card, Spin, Empty, Button } from 'antd';
import { ShoppingOutlined, ClockCircleOutlined, CarOutlined, CheckCircleOutlined, CloseCircleOutlined, CloseCircleFilled } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import type { Order } from '../../api/orderApi';
import { notification } from '../../utils/notification';

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * Trang Lịch sử đơn hàng chuyên nghiệp.
 */
const OrdersPage: React.FC = () => {
    const location = useLocation();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);

            try {
                const data = await orderApi.getUserOrders(user.username);
                setOrders(data);
            } catch (error: unknown) {
                notification.error(error instanceof Error ? error.message : 'Lỗi khi lấy danh sách đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [location.key]);

    const getStatusTag = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Tag icon={<ClockCircleOutlined />} color="warning">Chờ thanh toán</Tag>;
            case 'PAID':
                return <Tag icon={<CheckCircleOutlined />} color="processing">Đã thanh toán</Tag>;
            case 'SHIPPING':
                return <Tag icon={<CarOutlined />} color="blue">Đang giao hàng</Tag>;
            case 'DELIVERED':
                return <Tag icon={<CheckCircleOutlined />} color="success">Đã giao hàng</Tag>;
            case 'FAILED':
                return <Tag icon={<CloseCircleFilled />} color="error">Thanh toán lỗi</Tag>;
            case 'CANCELLED':
                return <Tag icon={<CloseCircleOutlined />} color="default">Đã hủy</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => <Text strong>#{id}</Text>,
        },
        {
            title: 'Ngày mua',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date: string) => new Date(date).toLocaleString('vi-VN'),
        },
        {
            title: 'Sản phẩm',
            key: 'items',
            render: (_text: string, record: Order) => (
                <Space direction="vertical" size="small">
                    {record.items.map(item => (
                        <div key={item.id}>
                            <Text style={{ fontSize: 13 }}>{item.product.name} x {item.quantity}</Text>
                        </div>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => (
                <Text strong style={{ color: '#ee636e' }}>
                    {amount.toLocaleString('vi-VN')}đ
                </Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => getStatusTag(status),
        },
    ];

    return (
        <Content className="main-content" style={{ padding: '40px 20px' }}>
            <div style={{ marginBottom: '40px' }}>
                <Title level={2} style={{ color: 'var(--text-main)' }}>Lịch sử đơn hàng</Title>
                <Text style={{ color: 'var(--text-muted)' }}>Theo dõi quá trình vận chuyển đơn hàng của bạn</Text>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>
            ) : orders.length === 0 ? (
                <Card className="glass-effect" style={{ textAlign: 'center', padding: '50px' }}>
                    <Empty
                        image={<ShoppingOutlined style={{ fontSize: 64, color: 'var(--primary-color)' }} />}
                        description={<Text style={{ color: 'var(--text-muted)' }}>Bạn chưa có đơn hàng nào</Text>}
                    >
                        <Button type="primary" onClick={() => window.location.href = '/products'}>Mua sắm ngay</Button>
                    </Empty>
                </Card>
            ) : (
                <Card className="glass-effect" styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 800 }}
                    />
                </Card>
            )}
        </Content>
    );
};

export default OrdersPage;
