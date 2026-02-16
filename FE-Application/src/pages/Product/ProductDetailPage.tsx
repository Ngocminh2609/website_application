import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Tag, Rate, Space, Divider, Spin, Empty, Breadcrumb, Image } from 'antd';
import {
    ShoppingCartOutlined,
    ArrowLeftOutlined,
    CheckCircleFilled,
    RocketOutlined,
    SafetyCertificateOutlined,
    SwapOutlined
} from '@ant-design/icons';
import { productApi } from '../../api/productApi';
import { cartApi } from '../../api/cartApi';
import { useCart } from '../../hooks/useCart';
import type { Product } from '../../types/product';
import BaseButton from '../../components/common/BaseButton';
import { notification } from '../../utils/notification';

const { Title, Text, Paragraph } = Typography;

/**
 * Trang chi tiết sản phẩm cao cấp.
 * Hiển thị đầy đủ thông tin, thông số kỹ thuật và bộ sưu tập ảnh.
 */
const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { refreshCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mainImage, setMainImage] = useState<string>('');

    useEffect(() => {
        const fetchProductDetail = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await productApi.getProductById(parseInt(id));
                setProduct(data);
                setMainImage(data.imageUrl);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        const token = localStorage.getItem('token');
        if (!token) {
            notification.error('Vui lòng đăng nhập để thực hiện');
            return;
        }

        try {
            await cartApi.addToCart(product.id, 1);
            await refreshCart(true);
            notification.product.addCartSuccess();
        } catch {
            notification.error('Không thể thêm sản phẩm vào giỏ hàng');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '150px' }}><Spin size="large" /></div>;
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Empty description={<span style={{ color: '#fff' }}>Sản phẩm không tồn tại hoặc đã bị xóa</span>} />
                <Link to="/products">
                    <BaseButton icon={<ArrowLeftOutlined />} style={{ marginTop: '20px' }}>Quay lại cửa hàng</BaseButton>
                </Link>
            </div>
        );
    }

    // Danh sách ảnh phụ
    const otherImages = product.moreImages ? product.moreImages.split(',').filter(img => img.trim() !== '') : [];
    const allImages = [product.imageUrl, ...otherImages];

    // Xử lý thông số kỹ thuật (giả sử được phân tách bằng dấu chấm phẩy)
    const specs = product.specifications
        ? product.specifications.split(';').map(s => s.trim()).filter(s => s !== '')
        : [];

    const discountPercent = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Layout style={{ background: 'transparent', minHeight: '100vh', paddingTop: '100px' }}>
            <div className="main-content">
                {/* Breadcrumb hiện đại */}
                <Breadcrumb
                    items={[
                        { title: <Link to="/" style={{ color: 'var(--text-muted)' }}>Trang chủ</Link> },
                        { title: <Link to="/products" style={{ color: 'var(--text-muted)' }}>Sản phẩm</Link> },
                        { title: <span style={{ color: '#fff' }}>{product.name}</span> },
                    ]}
                    style={{ marginBottom: '30px' }}
                />

                <Row gutter={[48, 48]} style={{ marginBottom: '60px' }}>
                    {/* KHỐI HÌNH ẢNH */}
                    <Col xs={24} lg={12}>
                        <div style={{ position: 'sticky', top: '120px' }}>
                            {/* Ảnh chính lớn */}
                            <div style={{
                                background: 'var(--glass-bg)',
                                padding: '20px',
                                borderRadius: '24px',
                                border: '1px solid var(--glass-border)',
                                marginBottom: '20px',
                                overflow: 'hidden'
                            }}>
                                <Image
                                    src={mainImage}
                                    alt={product.name}
                                    style={{ width: '100%', height: 'auto', borderRadius: '16px', objectFit: 'contain' }}
                                    preview={{ mask: 'Xem phóng to' }}
                                />
                            </div>

                            {/* Danh sách ảnh nhỏ (Gallery) */}
                            {allImages.length > 1 && (
                                <Row gutter={[12, 12]}>
                                    {allImages.map((img, idx) => (
                                        <Col span={6} key={idx}>
                                            <div
                                                onClick={() => setMainImage(img)}
                                                style={{
                                                    cursor: 'pointer',
                                                    border: mainImage === img ? '2px solid var(--primary-color)' : '1px solid var(--glass-border)',
                                                    borderRadius: '12px',
                                                    padding: '5px',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${product.name} ${idx}`}
                                                    style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>
                    </Col>

                    {/* KHỐI THÔNG TIN CHI TIẾT */}
                    <Col xs={24} lg={12}>
                        <div style={{ color: '#fff' }}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                {/* Nhãn hiệu & Huy hiệu */}
                                <Space split={<Divider type="vertical" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />}>
                                    <Text style={{ color: 'var(--primary-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                        {product.brand || 'NO BRAND'}
                                    </Text>
                                    <Tag color="blue" bordered={false} style={{ borderRadius: '4px', fontWeight: 600 }}>CHÍNH HÃNG</Tag>
                                    {product.isBestSeller && <Tag color="gold" bordered={false} style={{ borderRadius: '4px', fontWeight: 600 }}>BÁN CHẠY</Tag>}
                                </Space>

                                <Title level={1} style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '8px' }}>{product.name}</Title>

                                {/* Rating */}
                                <Space size="large" style={{ marginBottom: '10px' }}>
                                    <Rate disabled defaultValue={product.rating || 5} />
                                    <Text style={{ color: 'var(--text-muted)' }}>( {product.reviewCount || 0} đánh giá từ người dùng )</Text>
                                </Space>

                                {/* Giá cả */}
                                <div style={{
                                    background: 'rgba(99, 102, 241, 0.05)',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    borderLeft: '4px solid var(--primary-color)'
                                }}>
                                    <Space align="baseline" size="middle">
                                        <Title level={2} style={{ color: '#fff', margin: 0, fontSize: '2rem' }}>
                                            {product.price?.toLocaleString('vi-VN')} ₫
                                        </Title>
                                        {product.originalPrice && (
                                            <Text delete style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                                                {product.originalPrice?.toLocaleString('vi-VN')} ₫
                                            </Text>
                                        )}
                                        {discountPercent > 0 && (
                                            <Tag color="red" bordered={false} style={{ fontSize: '1rem', padding: '4px 8px' }}>
                                                -{discountPercent}%
                                            </Tag>
                                        )}
                                    </Space>
                                </div>

                                {/* Ưu đãi đi kèm */}
                                <div style={{ margin: '20px 0' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Space><RocketOutlined style={{ color: 'var(--primary-color)' }} /> <Text style={{ color: '#fff' }}>Giao hàng nhanh 2h</Text></Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space><SafetyCertificateOutlined style={{ color: 'var(--primary-color)' }} /> <Text style={{ color: '#fff' }}>Bảo hành 24 tháng</Text></Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space><SwapOutlined style={{ color: 'var(--primary-color)' }} /> <Text style={{ color: '#fff' }}>Lỗi 1 đổi 1 trong 30 ngày</Text></Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space><CheckCircleFilled style={{ color: 'var(--primary-color)' }} /> <Text style={{ color: '#fff' }}>Cam kết 100% chính hãng</Text></Space>
                                        </Col>
                                    </Row>
                                </div>

                                <Divider style={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                                {/* Mô tả ngắn */}
                                <div>
                                    <Title level={5} style={{ color: '#fff' }}>Mô tả sản phẩm</Title>
                                    <Paragraph style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.8' }}>
                                        {product.description}
                                    </Paragraph>
                                </div>

                                {/* Nút hành động */}
                                <div style={{ marginTop: '20px' }}>
                                    <Row gutter={16}>
                                        <Col span={16}>
                                            <BaseButton
                                                type="primary"
                                                icon={<ShoppingCartOutlined />}
                                                onClick={handleAddToCart}
                                                style={{ width: '100%', height: '54px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 700 }}
                                            >
                                                THÊM VÀO GIỎ HÀNG
                                            </BaseButton>
                                        </Col>
                                        <Col span={8}>
                                            <BaseButton
                                                style={{ width: '100%', height: '54px', borderRadius: '12px', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                                            >
                                                LƯU LẠI
                                            </BaseButton>
                                        </Col>
                                    </Row>
                                </div>
                            </Space>
                        </div>
                    </Col>
                </Row>

                {/* THÔNG SỐ KỸ THUẬT & CHI TIẾT DƯỚI */}
                <div style={{
                    background: 'var(--glass-bg)',
                    borderRadius: '24px',
                    padding: '40px',
                    border: '1px solid var(--glass-border)',
                    marginBottom: '80px'
                }}>
                    <Row gutter={[48, 48]}>
                        <Col xs={24} md={12}>
                            <Title level={3} style={{ color: '#fff', marginBottom: '30px' }}>Thông số kỹ thuật</Title>
                            {specs.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {specs.map((spec, index) => {
                                        const [label, ...valueParts] = spec.split(':');
                                        const value = valueParts.join(':');
                                        return (
                                            <div key={index} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '12px 0',
                                                borderBottom: '1px solid rgba(255,255,255,0.03)'
                                            }}>
                                                <Text style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label.trim()}</Text>
                                                <Text style={{ color: '#fff', fontWeight: 600 }}>{value ? value.trim() : ''}</Text>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Text style={{ color: 'var(--text-muted)' }}>Đang cập nhật thông tin...</Text>
                            )}
                        </Col>
                        <Col xs={24} md={12}>
                            <Title level={3} style={{ color: '#fff', marginBottom: '30px' }}>Đánh giá từ khách hàng</Title>
                            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
                                <Title level={2} style={{ color: '#fff', margin: 0 }}>{product.rating || 5}/5</Title>
                                <Rate disabled defaultValue={product.rating || 5} />
                                <div style={{ marginTop: '10px' }}>
                                    <Text style={{ color: 'var(--text-muted)' }}>Mọi khách hàng đều hài lòng với sản phẩm này</Text>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetailPage;
