import React, { useEffect } from 'react';
import { Layout, Typography, Row, Col, Empty, Spin } from 'antd';
import ProductCard from '../../components/common/ProductCard';
import BaseButton from '../../components/common/BaseButton';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types/product';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

/**
 * Trang Chủ tối ưu hóa không gian.
 * Hiển thị trải rộng trên màn hình lớn và thu gọn thông minh trên di động.
 */
const HomePage: React.FC = () => {
    const { products, loading, fetchProducts } = useProducts();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <Content className="main-content">
            {/* Hero Section - Tận dụng chiều rộng màn hình lớn */}
            <section style={{
                textAlign: 'center',
                marginBottom: 'var(--section-margin)',
                width: '100%',
                margin: '0 auto var(--section-margin) auto'
            }} className="animate-fade-up">
                <Title className="hero-title" style={{ margin: 0 }}>
                    Định Nghĩa Lại<br />Trải Nghiệm Công Nghệ
                </Title>
                <Paragraph style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                    color: 'var(--text-muted)',
                    margin: '32px auto 48px auto',
                    maxWidth: '1200px', // Nới lỏng độ rộng đoạn văn để cân đối với tiêu đề lớn
                    padding: '0 20px',
                    lineHeight: 1.6
                }}>
                    Khám phá bộ sưu tập thiết bị cao cấp nhất được tuyển chọn theo tiêu chuẩn quốc tế,
                    mang đến sự kết hợp hoàn hảo giữa hiệu năng đỉnh cao và thiết kế nghệ thuật.
                </Paragraph>
                <BaseButton type="primary" size="large" style={{
                    fontSize: '1.2rem',
                    padding: '15px 50px',
                    height: 'auto',
                    borderRadius: '50px'
                }}>
                    Bắt đầu mua sắm
                </BaseButton>
            </section>

            {/* Product List Section */}
            <section>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '50px',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <Title level={2} style={{ color: '#fff', margin: 0 }}>
                        Sản Phẩm Nổi Bật
                    </Title>
                    <div style={{ height: '2px', flex: 1, background: 'linear-gradient(90deg, var(--primary-color), transparent)', marginLeft: '30px' }} className="desktop-only" />
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>
                        <Spin size="large" tip="Đang tải dữ liệu..." />
                    </div>
                ) : products.length > 0 ? (
                    <Row gutter={[32, 32]}>
                        {products.map((product: Product) => (
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty description="Chưa có sản phẩm nào trong kho." />
                )}
            </section>
        </Content>
    );
};

export default HomePage;
