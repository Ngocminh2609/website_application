import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Table, Space, Tag, Modal, Form, Input, InputNumber, Select, Upload } from 'antd';
import type { UploadFile } from 'antd';
import {
    TeamOutlined,
    ShoppingOutlined,
    DollarOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { fileApi } from '../../api/fileApi';
import type { Product, ProductRequest } from '../../types/product';
import type { Category } from '../../types/category';
import BaseButton from '../../components/common/BaseButton';
import { notification } from '../../utils/notification';
import type { ColumnsType } from 'antd/es/table';

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * Trang Quản trị viên (Admin Dashboard) tối ưu không gian rộng.
 */
const AdminDashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm<ProductRequest>();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [productData, categoryData] = await Promise.all([
                    productApi.getAllProducts(),
                    categoryApi.getAllCategories()
                ]);
                setProducts(productData);
                setCategories(categoryData);
            } catch (error) {
                console.error('Lỗi tải dữ liệu quản trị:', error);
                notification.error('Lỗi tải dữ liệu quản trị');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

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
            price: product.price,
            stockQuantity: product.stockQuantity,
            categoryId: product.category?.id || 0,
            imageUrl: product.imageUrl,
            description: product.description
        });
        setFileList([]); // Reset file list when starting edit
        setIsModalVisible(true);
    };

    const onFinish = async (values: ProductRequest) => {
        try {
            setLoading(true);
            let imageUrl = values.imageUrl;

            // Nếu có tệp tin mới được chọn, tải lên MinIO
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
            const productData = await productApi.getAllProducts();
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
                    const productData = await productApi.getAllProducts();
                    setProducts(productData);
                } catch {
                    notification.error('Lỗi khi xóa sản phẩm');
                }
            }
        });
    };

    const columns: ColumnsType<Product> = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record: Product) => (
                <Space size="middle">
                    <img
                        src={record.imageUrl}
                        alt={record.name}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=200';
                        }}
                        style={{ width: 45, height: 45, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div>
                        <Text strong style={{ display: 'block', fontSize: '15px' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }} className="desktop-only">{record.description?.substring(0, 50)}...</Text>
                        <Tag color="blue" className="mobile-only" style={{ marginTop: '4px' }}>${record.price}</Tag>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price',
            className: 'desktop-only',
            render: (price: number) => <Text style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '16px' }}>${price}</Text>,
        },
        {
            title: 'Trạng thái kho',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            render: (qty: number) => (
                <Tag color={qty < 10 ? 'volcano' : 'cyan'} style={{ padding: '2px 10px', borderRadius: '4px' }}>
                    {qty < 10 ? `Sắp hết (${qty})` : `Còn hàng (${qty})`}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'right',
            render: (_, record: Product) => (
                <Space size="small">
                    <BaseButton
                        type="text"
                        icon={<EditOutlined />}
                        style={{ color: 'var(--primary-color)' }}
                        onClick={() => handleEdit(record)}
                    />
                    <BaseButton
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <Content className="main-content">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '50px',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <div>
                    <Title level={1} style={{ color: '#fff', margin: 0, fontSize: '2.5rem' }}>Quản Trị Hệ Thống</Title>
                    <Text style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Bảng điều khiển quản lý hàng hóa và kinh doanh tập trung</Text>
                </div>
                <BaseButton type="primary" size="large" icon={<PlusOutlined />} onClick={handleAddProduct} style={{ height: '45px', padding: '0 30px' }}>
                    Thêm sản phẩm mới
                </BaseButton>
            </div>

            <Row gutter={[32, 32]} style={{ marginBottom: '50px' }}>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="glass-effect" styles={{ body: { padding: '30px' } }}>
                        <Space direction="vertical" size="middle">
                            <Text style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><ShoppingOutlined /> Tổng sản phẩm</Text>
                            <Title level={1} style={{ margin: 0, color: '#fff', fontSize: '3rem' }}>{products.length}</Title>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="glass-effect" styles={{ body: { padding: '30px' } }}>
                        <Space direction="vertical" size="middle">
                            <Text style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><TeamOutlined /> Khách hàng</Text>
                            <Title level={1} style={{ margin: 0, color: '#fff', fontSize: '3rem' }}>1,284</Title>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={24} lg={8}>
                    <Card className="glass-effect" styles={{ body: { padding: '30px' } }}>
                        <Space direction="vertical" size="middle">
                            <Text style={{ color: 'var(--text-muted)', fontSize: '1rem' }}><DollarOutlined /> Doanh thu dự kiến</Text>
                            <Title level={1} style={{ margin: 0, color: 'var(--primary-color)', fontSize: '3rem' }}>$42,850</Title>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Card
                className="glass-effect"
                title={<span style={{ color: '#fff', fontSize: '1.25rem' }}>{editingId ? 'Chỉnh sửa sản phẩm' : 'Danh sách sản phẩm trong kho'}</span>}
                styles={{ header: { borderBottom: '1px solid rgba(255,255,255,0.1)' }, body: { padding: '0' } }}
            >
                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, position: ['bottomRight'], showSizeChanger: true }}
                    scroll={{ x: 800 }}
                />
            </Card>

            <Modal
                title={<Title level={4} style={{ margin: 0 }}>{editingId ? 'Cập nhật thông tin sản phẩm' : 'Thêm sản phẩm mới'}</Title>}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okButtonProps={{ loading: loading }}
                width={700}
                centered
            >
                <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: '20px' }}>
                    <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
                        <Input size="large" placeholder="Ví dụ: iPhone 15 Pro Max" />
                    </Form.Item>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="price" label="Giá bán ($)" rules={[{ required: true, message: 'Nhập giá' }]}>
                                <InputNumber size="large" style={{ width: '100%' }} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="stockQuantity" label="Số lượng tồn kho" rules={[{ required: true, message: 'Nhập số lượng' }]}>
                                <InputNumber size="large" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="categoryId" label="Danh mục sản phẩm" rules={[{ required: true, message: 'Chọn danh mục' }]}>
                        <Select
                            size="large"
                            placeholder="Chọn danh mục"
                            options={categories.map(c => ({ label: c.name, value: c.id }))}
                        />
                    </Form.Item>
                    <Form.Item label="Hình ảnh sản phẩm">
                        <Upload
                            beforeUpload={() => false}
                            listType="picture-card"
                            maxCount={1}
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                        >
                            {fileList.length >= 1 ? null : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Tải ảnh</div>
                                </div>
                            )}
                        </Upload>
                        <Text type="secondary">Hoặc nhập URL thủ công bên dưới</Text>
                    </Form.Item>
                    <Form.Item name="imageUrl" label="Đường dẫn hình ảnh">
                        <Input size="large" placeholder="https://image-url.com/asset.jpg" disabled={fileList.length > 0} />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả sản phẩm">
                        <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết về tính năng, cấu hình..." />
                    </Form.Item>
                </Form>
            </Modal>
        </Content>
    );
};

export default AdminDashboard;
