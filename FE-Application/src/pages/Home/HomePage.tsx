import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Space, Divider, Spin } from 'antd';
import { ThunderboltFilled, ArrowRightOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types/product';
import ProductCard from '../../components/common/ProductCard';
import BaseButton from '../../components/common/BaseButton';

const { Title, Text, Paragraph } = Typography;

/**
 * Trang chủ Tech Nova - Phiên bản nâng cấp tối ưu tương phản và thân thiện người dùng.
 * Chỉnh sửa: Chữ màu trắng/sáng trên nền tối, loại bỏ các thành phần gây rối mắt.
 */
const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        flashSales,
        bestSellers,
        categories,
        loading: productLoading,
        initializeHomeData,
        fetchProductsByBrand
    } = useProducts();
    const [brandsData, setBrandsData] = useState<{ id: string, name: string, products: Product[] }[]>([]);
    const [loadingBrands, setLoadingBrands] = useState<boolean>(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoadingBrands(true);
                // Khởi tạo các danh sách chính (Flash Sale, Best Seller, Categories) từ Context để tránh gọi trùng
                await initializeHomeData();

                // Sử dụng hàm từ context để đảm bảo cơ chế Single Flight (không gọi trùng lặp Apple/Samsung)
                const [apple, samsung] = await Promise.all([
                    fetchProductsByBrand('Apple'),
                    fetchProductsByBrand('Samsung')
                ]);

                setBrandsData([
                    { id: 'Apple', name: 'Apple Ecosystem', products: apple.slice(0, 4) },
                    { id: 'Samsung', name: 'Samsung Galaxy', products: samsung.slice(0, 4) }
                ]);

            } catch (error) {
                console.error("Lỗi khi tải trang chủ:", error);
            } finally {
                setLoadingBrands(false);
            }
        };

        fetchHomeData();
    }, [initializeHomeData, fetchProductsByBrand, location.key]);

    if (productLoading || loadingBrands) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'transparent' }}>
                <Spin size="large" tip={<Text style={{ color: 'var(--text-main)' }}>Đang khởi tạo không gian mua sắm...</Text>} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ color: 'var(--text-main)' }}>
            {/* HERO SECTION - Tối ưu chữ sáng trên nền tối */}
            <section className="hero-section" style={{
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                padding: '120px 0',
                background: 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)'
            }}>
                <div className="main-content">
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} lg={14}>
                            <Title className="hero-title" style={{ color: 'var(--text-main)', marginBottom: '24px', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                TRẢI NGHIỆM <br />
                                <span style={{ color: 'var(--primary-color)' }}>CÔNG NGHỆ </span>
                                ĐỈNH CAO
                            </Title>
                            <Paragraph style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '48px', lineHeight: 1.8, maxWidth: '600px' }}>
                                Chào mừng bạn đến với Tech Nova. Nơi cung cấp những thiết bị điện tử chính hãng,
                                bảo hành chuẩn quốc tế và trải nghiệm mua sắm không giới hạn.
                            </Paragraph>
                            <Space size="large">
                                <BaseButton
                                    type="primary"
                                    size="large"
                                    onClick={() => navigate('/products')}
                                    style={{ height: '64px', padding: '0 48px', fontSize: '1.1rem', borderRadius: '16px', fontWeight: 700 }}
                                >
                                    Khám Phá Sản Phẩm
                                </BaseButton>
                                <BaseButton
                                    size="large"
                                    ghost
                                    style={{ height: '64px', padding: '0 48px', fontSize: '1.1rem', borderRadius: '16px', borderColor: 'var(--text-main)', color: 'var(--text-main)' }}
                                >
                                    Xem Ưu Đãi
                                </BaseButton>
                            </Space>

                            <div style={{ marginTop: '60px', display: 'flex', gap: '40px' }}>
                                <div>
                                    <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>50k+</Title>
                                    <Text style={{ color: 'var(--text-muted)' }}>Khách hàng tin dùng</Text>
                                </div>
                                <Divider type="vertical" style={{ height: '40px', borderColor: 'var(--glass-border)' }} />
                                <div>
                                    <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>200+</Title>
                                    <Text style={{ color: 'var(--text-muted)' }}>Thương hiệu quốc tế</Text>
                                </div>
                            </div>
                        </Col>
                        <Col xs={0} lg={10}>
                            {/* Chỗ này có thể thêm hình ảnh Decor hoặc Graphic abstract để thêm phần sinh động */}
                        </Col>
                    </Row>
                </div>
            </section>

            <div className="main-content">
                {/* CATEGORY NAV - Nền rõ ràng, chữ nổi */}
                <div style={{ marginBottom: '100px', textAlign: 'center' }}>
                    <Text style={{ color: 'var(--primary-color)', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '3px', marginBottom: '20px', display: 'block' }}>
                        DANH MỤC PHỔ BIẾN
                    </Text>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '24px', padding: '10px 0 30px' }} className="no-scrollbar">
                        {categories.map(cat => (
                            <div
                                key={cat.id}
                                onClick={() => navigate(`/products?category=${cat.id}`)}
                                style={{
                                    padding: '18px 40px',
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    whiteSpace: 'nowrap'
                                }}
                                className="category-item-hover"
                            >
                                <Text style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '1.05rem' }}>{cat.name}</Text>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FLASH SALE - Chữ sáng, nền nhấn đỏ */}
                {flashSales.length > 0 && (
                    <section style={{ marginBottom: '120px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ background: '#ef4444', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                                    <ThunderboltFilled style={{ color: '#fff', fontSize: '24px' }} />
                                </div>
                                <div>
                                    <Title level={2} style={{ color: 'var(--text-main)', margin: 0 }}>Flash Sale Giờ Vàng</Title>
                                    <Text style={{ color: '#ef4444', fontWeight: 600 }}>Kết thúc trong: 05:20:15</Text>
                                </div>
                            </div>
                            <BaseButton type="link" onClick={() => navigate('/products')} style={{ color: 'var(--primary-color)', fontSize: '1rem' }}>
                                Xem tất cả <ArrowRightOutlined />
                            </BaseButton>
                        </div>
                        <Row gutter={[32, 32]}>
                            {flashSales.slice(0, 4).map(product => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    </section>
                )}

                {/* BEST SELLER - Banner tối nhưng chữ phải phản quang */}
                <section
                    className="glass-effect"
                    style={{
                        marginBottom: '120px',
                        padding: '80px 60px',
                        borderRadius: '48px',
                        boxShadow: 'var(--card-shadow)'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <Space style={{ marginBottom: '15px' }}>
                            <StarFilled style={{ color: '#fcd34d' }} />
                            <Text style={{ color: '#fcd34d', fontWeight: 600, letterSpacing: '2px' }}>TOP RATED</Text>
                            <StarFilled style={{ color: '#fcd34d' }} />
                        </Space>
                        <Title level={2} style={{ color: 'var(--text-main)', fontSize: '3rem', fontWeight: 800, margin: 0 }}>Được Ưa Chuộng Nhất</Title>
                        <Text style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '10px', display: 'block' }}>Những lựa chọn hàng đầu từ hàng triệu game thủ và người yêu công nghệ.</Text>
                    </div>
                    {/* Dùng flexbox thay Row/Col vì Ant Design Grid chia 24 đơn vị không chia hết cho 5, gây xuống dòng */}
                    <div style={{ display: 'flex', gap: '32px', flexWrap: 'nowrap', overflowX: 'auto' }} className="no-scrollbar">
                        {bestSellers.slice(0, 5).map(product => (
                            <div key={product.id} className="premium-hover" style={{ flex: '0 0 calc(20% - 26px)', minWidth: '220px' }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* BRANDS - Sidebar Layout */}
                {brandsData.map((brand, bIdx) => (
                    <section key={bIdx} style={{ marginBottom: '100px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '48px' }}>
                            <Title level={2} style={{ color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap' }}>{brand.name}</Title>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--glass-border) 0%, transparent 100%)' }}></div>
                            <BaseButton onClick={() => navigate(`/products?brand=${brand.id}`)} ghost style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontWeight: 600 }}>
                                Xem Chi Tiết
                            </BaseButton>
                        </div>
                        <Row gutter={[32, 32]}>
                            {brand.products.map(product => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    </section>
                ))}

                {/* CTN SECTION - Nâng cao chuyển đổi */}
                <section style={{
                    marginTop: '150px',
                    padding: '100px 40px',
                    background: 'var(--primary-gradient)',
                    borderRadius: '48px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <Title style={{ color: '#ffffff', fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px' }}>HÀNH TRÌNH MỚI BẮT ĐẦU</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.4rem', display: 'block', marginBottom: '48px', maxWidth: '800px', margin: '0 auto 48px' }}>
                            Đừng bỏ lỡ những cập nhật công nghệ mới nhất. Trở thành thành viên của cộng đồng Tech Nova ngay hôm nay.
                        </Text>
                        <div style={{ display: 'flex', maxWidth: '650px', margin: '0 auto', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div style={{
                                flex: 1,
                                minWidth: '300px',
                                height: '64px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '18px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 24px'
                            }}>
                                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Địa chỉ email của bạn...</Text>
                            </div>
                            <BaseButton style={{
                                height: '64px',
                                padding: '0 48px',
                                borderRadius: '18px',
                                background: '#ffffff',
                                color: 'var(--primary-color)',
                                fontWeight: 800,
                                border: 'none',
                                fontSize: '1.1rem'
                            }}>
                                ĐĂNG KÝ NGAY
                            </BaseButton>
                        </div>
                    </div>
                    {/* Abstract Circle Decor */}
                    <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(50px)' }}></div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
