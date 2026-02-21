import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Table, Space, Tag, Modal, Form, Input, InputNumber, Select, Upload, Tabs, Tooltip, Badge } from 'antd';
import type { UploadFile } from 'antd';
import { useLocation } from 'react-router-dom';
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
    ClockCircleOutlined,
    CarOutlined,
    MessageOutlined,
    BarChartOutlined,
    BellOutlined,
    InfoCircleOutlined,
    FireFilled,
    AppstoreOutlined,
    GiftOutlined,
    StarOutlined
} from '@ant-design/icons';
import AdminChat from './AdminChat';
import { useAdminChat } from '../../context/useAdminChat';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { fileApi } from '../../api/fileApi';
import { orderApi, type Order } from '../../api/orderApi';
import type { Product, ProductRequest } from '../../types/product';
import type { Category } from '../../types/category';
import BaseButton from '../../components/common/BaseButton';
import { notification } from '../../utils/notification';
import type { ColumnsType } from 'antd/es/table';
import StatisticsTab from './StatisticsTab';
import NotificationManagement from './NotificationManagement';
import VoucherManagement from './VoucherManagement';
import ReviewModeration from './ReviewModeration';

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * Trang Quản trị viên (Admin Dashboard) đa năng.
 * Tích hợp quản lý sản phẩm và quản lý đơn hàng tập trung.
 */
const AdminDashboard: React.FC = () => {
    const { totalUnread } = useAdminChat();
    const location = useLocation();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm<ProductRequest>();
    const [activeTab, setActiveTab] = useState<string>('products');

    // Watch values for live calculation
    const watchOriginalPrice = Form.useWatch('originalPrice', form);
    const watchDiscountPercent = Form.useWatch('discountPercent', form);
    const [livePrice, setLivePrice] = useState<number>(0);

    useEffect(() => {
        const price = watchOriginalPrice || 0;
        const percent = watchDiscountPercent || 0;
        setLivePrice(Math.round(price * (100 - percent) / 100));
    }, [watchOriginalPrice, watchDiscountPercent]);

    const loadCoreData = async () => {
        setLoading(true);
        try {
            const [productData, categoryData, orderData] = await Promise.all([
                productApi.getAllAdmin(),
                categoryApi.getAllCategories(),
                orderApi.getAllOrders()
            ]);
            setProducts(productData);
            setCategories(categoryData);
            setOrders(orderData);
        } catch (error) {
            console.error('Lỗi tải dữ liệu quản trị:', error);
            notification.error('Lỗi tải dữ liệu quản trị');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoreData();
        // Xử lý chuyển tab qua hash (#chat, #orders, etc.)
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            setActiveTab(hash);
        }
    }, [location.pathname, location.search, activeTab]); // Gọi lại load khi đổi route hoặc đổi tab

    const handleAddProduct = () => {
        setEditingId(null);
        form.resetFields();
        setFileList([]);
        setIsModalVisible(true);
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        form.setFieldsValue({
            name: product.name,
            originalPrice: product.originalPrice || product.price,
            discountPercent: product.discountPercent || 0,
            stockQuantity: product.stockQuantity,
            categoryId: product.category?.id || 0,
            imageUrl: product.imageUrl,
            description: product.description,
            brand: product.brand,
            isBestSeller: product.isBestSeller,
            specifications: product.specifications,
            moreImages: product.moreImages,
            isActive: product.isActive !== false // Mặc định là true nếu undefined
        });
        setFileList([]);
        setIsModalVisible(true);
    };

    const onFinish = async (values: ProductRequest) => {
        try {
            setLoading(true);
            let imageUrl = values.imageUrl;

            if (fileList.length > 0 && fileList[0].originFileObj) {
                const uploadRes = await fileApi.uploadImage(fileList[0].originFileObj as File, 'product');
                imageUrl = uploadRes.url;
            }

            if (editingId) {
                await productApi.updateProduct(editingId, { ...values, imageUrl });
                notification.success('Cập nhật sản phẩm thành công!');
            } else {
                await productApi.createProduct({ ...values, imageUrl });
                notification.success('Thêm sản phẩm thành công!');
            }

            setIsModalVisible(false);
            const productData = await productApi.getAllAdmin();
            setProducts(productData);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu này';
            notification.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
            onOk: async () => {
                try {
                    await productApi.deleteProduct(id);
                    notification.success('Xóa sản phẩm thành công');
                    const productData = await productApi.getAllAdmin();
                    setProducts(productData);
                } catch {
                    notification.error('Lỗi khi xóa sản phẩm');
                }
            }
        });
    };

    const handleStatusUpdate = async (orderId: number, status: string, message: string) => {
        try {
            setLoading(true);
            await orderApi.updateOrderStatus(orderId, status);
            notification.success(message);
            const orderData = await orderApi.getAllOrders();
            setOrders(orderData);
        } catch (error: unknown) {
            notification.error(error instanceof Error ? error.message : 'Lỗi cập nhật đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId: number) => {
        Modal.confirm({
            title: 'Xóa vĩnh viễn đơn hàng',
            content: 'Bạn có chắc chắn muốn xóa đơn hàng này khỏi hệ thống? Hành động này không thể hoàn tác.',
            okType: 'danger',
            onOk: async () => {
                try {
                    setLoading(true);
                    await orderApi.deleteOrder(orderId);
                    notification.success('Đã xóa đơn hàng');
                    const orderData = await orderApi.getAllOrders();
                    setOrders(orderData);
                } catch (error: unknown) {
                    notification.error(error instanceof Error ? error.message : 'Lỗi khi xóa đơn hàng');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const getStatusTag = (status: string) => {
        switch (status) {
            case 'PENDING': return <Tag icon={<ClockCircleOutlined />} color="warning">Chờ thanh toán</Tag>;
            case 'PAID': return <Tag icon={<CheckCircleOutlined />} color="processing">Đã thanh toán</Tag>;
            case 'SHIPPING': return <Tag icon={<CarOutlined />} color="blue">Đang giao hàng</Tag>;
            case 'DELIVERED': return <Tag icon={<CheckCircleOutlined />} color="success">Đã giao hàng</Tag>;
            case 'FAILED': return <Tag icon={<StopOutlined />} color="error">Lỗi giao dịch</Tag>;
            case 'CANCELLED': return <Tag icon={<StopOutlined />} color="default">Đã hủy</Tag>;
            default: return <Tag>{status}</Tag>;
        }
    };

    const productColumns: ColumnsType<Product> = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record: Product) => (
                <Space size="middle">
                    <div style={{ position: 'relative' }}>
                        <img
                            src={record.imageUrl}
                            alt={record.name}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=200';
                            }}
                            style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        {record.isBestSeller && (
                            <FireFilled style={{ position: 'absolute', top: -5, right: -5, color: '#ff4d4f', fontSize: 16 }} />
                        )}
                    </div>
                    <div>
                        <Text strong style={{ display: 'block', fontSize: '15px', color: 'var(--text-main)' }}>{record.name}</Text>
                        <Space>
                            <Tag color="blue" style={{ borderRadius: 4, margin: 0 }}>{record.brand || 'No Brand'}</Tag>
                            <Tag color="purple" style={{ borderRadius: 4, margin: 0 }}>{record.category?.name}</Tag>
                        </Space>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Giá bán',
            key: 'price',
            render: (_, record: Product) => (
                <div>
                    <Text strong style={{ display: 'block', color: 'var(--primary-color)' }}>{record.price.toLocaleString('vi-VN')} đ</Text>
                    {record.discountPercent && record.discountPercent > 0 ? (
                        <Text delete type="secondary" style={{ fontSize: 11 }}>{record.originalPrice?.toLocaleString('vi-VN')} đ</Text>
                    ) : null}
                    {!record.isActive && <Tag color="default" style={{ fontSize: 10, marginTop: 4 }}>ĐANG ẨN</Tag>}
                </div>
            ),
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            render: (qty: number) => (
                <Tag color={qty < 10 ? 'volcano' : 'green'}>
                    {qty} chiếc
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'right',
            render: (_, record: Product) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <BaseButton type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <BaseButton type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const orderColumns: ColumnsType<Order> = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => <Text strong>#{id}</Text>,
        },
        {
            title: 'Khách hàng / Liên hệ',
            key: 'contact',
            render: (_, record: Order) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.shippingAddress}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}><TeamOutlined /> {record.phoneNumber}</Text>
                </Space>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amt: number) => <Text strong style={{ color: 'var(--primary-color)' }}>{amt.toLocaleString('vi-VN')}đ</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => getStatusTag(status),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'right',
            render: (_, record: Order) => (
                <Space size="small">
                    {record.status === 'PAID' && (
                        <Tooltip title="Bắt đầu giao hàng">
                            <BaseButton
                                type="primary"
                                size="small"
                                icon={<TruckOutlined />}
                                onClick={() => handleStatusUpdate(record.id, 'SHIPPING', 'Đã chuyển trạng thái sang Đang giao hàng')}
                            />
                        </Tooltip>
                    )}
                    {record.status === 'SHIPPING' && (
                        <Tooltip title="Xác nhận đã giao">
                            <BaseButton
                                type="primary"
                                size="small"
                                icon={<CheckCircleOutlined />}
                                style={{ background: '#52c41a', border: 'none' }}
                                onClick={() => handleStatusUpdate(record.id, 'DELIVERED', 'Đơn hàng đã hoàn thành')}
                            />
                        </Tooltip>
                    )}
                    {(record.status === 'PENDING' || record.status === 'PAID') && (
                        <Tooltip title="Hủy đơn này">
                            <BaseButton
                                type="text"
                                icon={<StopOutlined />}
                                danger
                                onClick={() => handleStatusUpdate(record.id, 'CANCELLED', 'Đã hủy đơn hàng')}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Xóa vĩnh viễn">
                        <BaseButton type="text" icon={<DeleteOutlined />} danger onClick={() => handleDeleteOrder(record.id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const calculateTotalRevenue = () => {
        return orders
            .filter(o => o.status === 'PAID' || o.status === 'DELIVERED' || o.status === 'SHIPPING')
            .reduce((sum, o) => sum + o.totalAmount, 0);
    };

    return (
        <Content className="main-content">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <div>
                    <Title level={1} style={{ color: 'var(--text-main)', margin: 0 }}>Quản Trị Hệ Thống</Title>
                    <Text style={{ color: 'var(--text-muted)' }}>Cửa hàng của bạn đang có {orders.length} đơn hàng cần theo dõi</Text>
                </div>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
                <Col xs={24} sm={8}>
                    <Card className="glass-effect" styles={{ body: { padding: '24px' } }}>
                        <Space direction="vertical" size="small">
                            <Text style={{ color: 'var(--text-muted)' }}><ShoppingOutlined /> Kho hàng</Text>
                            <Title level={2} style={{ margin: 0, color: 'var(--text-main)' }}>{products.length} <Text style={{ fontSize: 14 }}>Sản phẩm</Text></Title>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="glass-effect" styles={{ body: { padding: '24px' } }}>
                        <Space direction="vertical" size="small">
                            <Text style={{ color: 'var(--text-muted)' }}><HistoryOutlined /> Đơn hàng</Text>
                            <Title level={2} style={{ margin: 0, color: 'var(--text-main)' }}>{orders.length} <Text style={{ fontSize: 14 }}>Yêu cầu</Text></Title>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="glass-effect" styles={{ body: { padding: '24px' } }}>
                        <Space direction="vertical" size="small">
                            <Text style={{ color: 'var(--text-muted)' }}><DollarOutlined /> Doanh thu thực</Text>
                            <Title level={2} style={{ margin: 0, color: 'var(--primary-color)' }}>{calculateTotalRevenue().toLocaleString('vi-VN')}đ</Title>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Card className="glass-effect" styles={{ body: { padding: '24px' } }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    destroyInactiveTabPane={true}
                    items={[
                        {
                            key: 'products',
                            label: <span style={{ fontSize: 16 }}><ShoppingOutlined /> Danh sách sản phẩm</span>,
                            children: (
                                <div>
                                    <div style={{ textAlign: 'right', marginBottom: 20 }}>
                                        <BaseButton type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
                                            Thêm sản phẩm mới
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
                            )
                        },
                        {
                            key: 'orders',
                            label: <span style={{ fontSize: 16 }}><HistoryOutlined /> Quản lý đơn hàng</span>,
                            children: (
                                <Table
                                    columns={orderColumns}
                                    dataSource={orders}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{ pageSize: 8 }}
                                    scroll={{ x: 800 }}
                                />
                            )
                        },
                        {
                            key: 'statistics',
                            label: <span style={{ fontSize: 16 }}><BarChartOutlined /> Báo cáo & Thống kê</span>,
                            children: <StatisticsTab />
                        },
                        {
                            key: 'chat',
                            label: (
                                <Badge count={totalUnread} offset={[10, 0]}>
                                    <span style={{ fontSize: 16 }}><MessageOutlined /> Chat Tư Vấn</span>
                                </Badge>
                            ),
                            children: <AdminChat />
                        },
                        {
                            key: 'notifications',
                            label: <span style={{ fontSize: 16 }}><BellOutlined /> Quản lý thông báo</span>,
                            children: <NotificationManagement />
                        },
                        {
                            key: 'vouchers',
                            label: <span style={{ fontSize: 16 }}><GiftOutlined /> Mã giảm giá</span>,
                            children: <VoucherManagement />
                        },
                        {
                            key: 'reviews',
                            label: <span style={{ fontSize: 16 }}><StarOutlined /> Kiểm duyệt đánh giá</span>,
                            children: <ReviewModeration />
                        }
                    ]}
                />
            </Card>

            <Modal
                title={<Title level={4} style={{ margin: 0 }}>{editingId ? 'Cập nhật thông tin sản phẩm' : 'Thêm sản phẩm mới'}</Title>}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okButtonProps={{ loading: loading }}
                width={800}
                style={{ top: 110 }}
                styles={{
                    body: {
                        maxHeight: 'calc(100vh - 270px)',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingRight: '8px'
                    }
                }}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: '20px' }}>
                    <Row gutter={24}>
                        <Col span={16}>
                            <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
                                <Input size="large" placeholder="Nhập tên sản phẩm..." />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="brand" label="Thương hiệu">
                                <Input size="large" placeholder="Ví dụ: Apple, Sony..." />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item name="originalPrice" label="Giá bán gốc (đ)" rules={[{ required: true, message: 'Nhập giá gốc' }]}>
                                <InputNumber size="large" style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="discountPercent" label="Giảm giá (%)">
                                <InputNumber size="large" min={0} max={99} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <div style={{
                                background: 'var(--bg-secondary)',
                                padding: '12px 16px',
                                borderRadius: 12,
                                marginTop: 30,
                                border: '1px dashed var(--primary-color)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Text style={{ color: 'var(--text-muted)' }}>Giá sau giảm:</Text>
                                <Text strong style={{ color: 'var(--primary-color)', fontSize: 18 }}>{livePrice.toLocaleString('vi-VN')} đ</Text>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="categoryId" label="Danh mục sản phẩm" rules={[{ required: true, message: 'Chọn danh mục' }]}>
                                <Select size="large" options={categories.map(c => ({ label: c.name, value: c.id }))} prefix={<AppstoreOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="stockQuantity" label="Tồn kho" rules={[{ required: true, message: 'Nhập số' }]}>
                                <InputNumber size="large" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="isBestSeller" label="Bán chạy?" valuePropName="checked">
                                <Select size="large" options={[{ label: 'Có', value: true }, { label: 'Không', value: false }]} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="isActive" label="Hiển thị?" valuePropName="checked" initialValue={true}>
                                <Select size="large" options={[
                                    { label: 'Công khai', value: true },
                                    { label: 'Tạm ẩn', value: false }
                                ]} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label={<Space><UploadOutlined /> Hình ảnh sản phẩm</Space>}>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Upload beforeUpload={() => false} listType="picture-card" maxCount={1} fileList={fileList} onChange={({ fileList }) => setFileList(fileList)}>
                                    {fileList.length >= 1 ? null : <div><PlusOutlined /><div style={{ marginTop: 8 }}>Tải lên</div></div>}
                                </Upload>
                            </Col>
                            <Col span={18}>
                                <Form.Item name="imageUrl">
                                    <Input placeholder="Hoặc dán URL ảnh tại đây" style={{ height: 102 }} disabled={fileList.length > 0} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="moreImages" label="Ảnh bổ sung (URLs cách nhau bởi dấu phẩy)">
                            <Input.TextArea placeholder="URL1, URL2, URL3..." rows={2} />
                        </Form.Item>
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả ngắn gọn">
                        <Input.TextArea rows={2} placeholder="Mô tả tóm tắt về sản phẩm..." />
                    </Form.Item>

                    <Form.Item
                        name="specifications"
                        label={<Space><InfoCircleOutlined /> Thông số kỹ thuật chi tiết</Space>}
                        help="Định dạng: Tên thông số: Giá trị; (Ví dụ: RAM: 16GB; Chip: M3;)"
                    >
                        <Input.TextArea rows={4} placeholder="Màn hình: 6.7 inch; Chip: A17 Pro; Pin: 29 giờ;" />
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
};

export default AdminDashboard;
