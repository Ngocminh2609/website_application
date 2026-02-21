import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Typography, Row, Col, Space, Card, Tag, Empty, Spin, Checkbox, Slider, Breadcrumb } from 'antd';
import { SearchOutlined, FilterOutlined, RocketOutlined, HomeOutlined } from '@ant-design/icons';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types/product';
import ProductCard from '../../components/common/ProductCard';

const { Title, Text } = Typography;

/**
 * Trang Kết quả tìm kiếm sản phẩm chuyên nghiệp.
 * Hỗ trợ tìm kiếm thời gian thực qua URL và lọc kết quả thông minh.
 */
const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const query = searchParams.get('q') || '';

    const { categories, initializeHomeData } = useProducts();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Trạng thái bộ lọc
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Nếu query là số, thử tìm theo ID trước để hỗ trợ khách hàng tìm kiếm chính xác
                const isNumeric = /^\d+$/.test(query);
                let searchData: Product[] = [];

                if (isNumeric) {
                    try {
                        const productById = await productApi.getProductById(parseInt(query));
                        if (productById) searchData = [productById];
                    } catch {
                        // Nếu không tìm thấy theo ID thì bỏ qua để tìm theo tên
                    }
                }

                // Luôn tìm kiếm theo tên để mở rộng kết quả
                const resultsByName = await productApi.searchProducts(query);

                // Kết hợp kết quả (loại bỏ trùng lặp nếu có)
                const combined = [...searchData];
                resultsByName.forEach(p => {
                    if (!combined.some(cp => cp.id === p.id)) {
                        combined.push(p);
                    }
                });

                setProducts(combined);

                // Đảm bảo categories được load cho sidebar
                await initializeHomeData();
            } catch (error) {
                console.error("Lỗi khi tìm kiếm sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, initializeHomeData, location.key]);

    // Trích xuất danh sách thương hiệu duy nhất từ kết quả
    const brands = useMemo(() => {
        const uniqueBrands = new Set(products.map(p => p.brand).filter(Boolean) as string[]);
        return Array.from(uniqueBrands);
    }, [products]);

    // Logic lọc sản phẩm tại Client
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchBrand = selectedBrands.length === 0 || (p.brand && selectedBrands.includes(p.brand));
            const matchCategory = selectedCategories.length === 0 || (p.category && selectedCategories.includes(p.category.id));
            const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
            return matchBrand && matchCategory && matchPrice;
        });
    }, [products, selectedBrands, selectedCategories, priceRange]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '150px 0', minHeight: '100vh' }}>
                <Spin size="large" tip={<Text style={{ color: 'var(--text-muted)', marginTop: '20px', display: 'block' }}>Vũ trụ Tech Nova đang tìm kiếm...</Text>} />
            </div>
        );
    }

    return (
        <Layout style={{ background: 'transparent', minHeight: '100vh', paddingTop: '100px' }}>
            <div className="main-content">
                {/* BREADCRUMB */}
                <Breadcrumb
                    items={[
                        { title: <Link to="/"><HomeOutlined /> Trang chủ</Link> },
                        { title: <span style={{ color: 'var(--text-main)' }}>Tìm kiếm: "{query}"</span> },
                    ]}
                    style={{ marginBottom: '24px' }}
                />

                <Row gutter={[40, 40]}>
                    {/* BỘ LỌC (SIDEBAR) */}
                    <Col xs={24} lg={6}>
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <Card
                                title={<Title level={4} style={{ margin: 0, color: 'var(--text-main)' }}><FilterOutlined /> LỌC KẾT QUẢ</Title>}
                                className="glass-effect"
                                bordered={false}
                                styles={{ body: { padding: '24px' } }}
                            >
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    {brands.length > 0 && (
                                        <div>
                                            <Text strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '15px' }}>THƯƠNG HIỆU</Text>
                                            <Checkbox.Group
                                                options={brands}
                                                value={selectedBrands}
                                                onChange={(vals) => setSelectedBrands(vals as string[])}
                                                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                                                className="premium-checkbox"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <Text strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '15px' }}>CHUYÊN MỤC</Text>
                                        <Checkbox.Group
                                            value={selectedCategories}
                                            onChange={(vals) => setSelectedCategories(vals as number[])}
                                            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                                            className="premium-checkbox"
                                        >
                                            {categories.map(cat => (
                                                <Checkbox key={cat.id} value={cat.id} style={{ color: 'var(--text-muted)' }}>
                                                    {cat.name}
                                                </Checkbox>
                                            ))}
                                        </Checkbox.Group>
                                    </div>

                                    <div>
                                        <Text strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '15px' }}>KHOẢNG GIÁ (VND)</Text>
                                        <Slider
                                            range
                                            min={0}
                                            max={100000000}
                                            step={1000000}
                                            value={priceRange}
                                            onChange={(val) => setPriceRange(val as [number, number])}
                                            trackStyle={[{ backgroundColor: 'var(--primary-color)' }]}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                            <Text style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{priceRange[0].toLocaleString()} ₫</Text>
                                            <Text style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{priceRange[1].toLocaleString()} ₫</Text>
                                        </div>
                                    </div>
                                </Space>
                            </Card>
                        </div>
                    </Col>

                    {/* DANH SÁCH KẾT QUẢ */}
                    <Col xs={24} lg={18}>
                        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <Title level={2} style={{ color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <SearchOutlined style={{ color: 'var(--primary-color)' }} />
                                    Kết quả tìm kiếm
                                </Title>
                                <Text style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                                    Tìm thấy <b>{filteredProducts.length}</b> sản phẩm cho từ khóa "<b>{query}</b>"
                                </Text>
                            </div>
                            <Space className="desktop-only">
                                <Tag color="blue" icon={<RocketOutlined />}>Chính hãng</Tag>
                                <Tag color="purple">Giao nhanh</Tag>
                            </Space>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <Row gutter={[24, 32]}>
                                {filteredProducts.map(product => (
                                    <Col xs={24} sm={12} md={8} xl={6} key={product.id}>
                                        <ProductCard product={product} />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div style={{
                                padding: '100px 40px',
                                textAlign: 'center',
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '32px'
                            }}>
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                                    description={
                                        <Space direction="vertical" size="small">
                                            <Text style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 600 }}>
                                                Rất tiếc, Tech Nova không tìm thấy sản phẩm nào!
                                            </Text>
                                            <Text style={{ color: 'var(--text-muted)' }}>
                                                Hãy thử điều chỉnh lại từ khóa hoặc bộ lọc để có kết quả tốt hơn.
                                            </Text>
                                        </Space>
                                    }
                                />
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default SearchPage;
