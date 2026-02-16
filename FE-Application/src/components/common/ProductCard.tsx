import React from 'react';
import { Card, Typography, Tag, Rate, Tooltip, Space } from 'antd';
import { ShoppingCartOutlined, FireOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import BaseButton from '../common/BaseButton';
import { notification } from '../../utils/notification';
import { cartApi } from '../../api/cartApi';
import { useCart } from '../../hooks/useCart';

const { Paragraph, Title, Text } = Typography;

interface ProductCardProps {
    product: Product;
}

/**
 * Thẻ hiển thị sản phẩm cao cấp (Premium Card)
 * Hỗ trợ hiển thị Rating, Flash Sale, Brand và giá gốc gạch ngang.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { refreshCart } = useCart();

    // Tính toán phần trăm giảm giá nếu có
    const discountPercent = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = async () => {
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

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;

        // Bản đồ ảnh dự phòng theo danh mục (Sử dụng link Unsplash uy tín)
        const replacements: Record<string, string> = {
            'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
            'smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
            'smartwatch': 'https://images.unsplash.com/photo-1508685096489-77a5ad2ba8e4?auto=format&fit=crop&q=80&w=800',
            'default': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'
        };

        const categoryName = product.category?.name?.toLowerCase() || 'default';
        target.src = replacements[categoryName] || replacements['default'];
    };

    return (
        <Card
            hoverable
            className="animate-fade-up product-card"
            cover={
                <div style={{ position: 'relative', overflow: 'hidden', height: '260px', background: '#0f172a' }}>
                    {/* Badge Flash Sale */}
                    {discountPercent > 0 && (
                        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                            <Tag color="#ef4444" style={{ borderRadius: '6px', fontWeight: 700, padding: '4px 8px', border: 'none' }}>
                                <FireOutlined /> {discountPercent}% OFF
                            </Tag>
                        </div>
                    )}

                    {/* Badge Best Seller */}
                    {product.isBestSeller && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                            <Tag color="#f59e0b" style={{ borderRadius: '6px', fontWeight: 700, padding: '4px 8px', border: 'none' }}>
                                BÁN CHẠY
                            </Tag>
                        </div>
                    )}

                    <Link to={`/product/${product.id}`}>
                        <img
                            alt={product.name}
                            src={product.imageUrl}
                            onError={handleImgError}
                            className="product-image"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        />
                    </Link>
                </div>
            }
            style={{
                borderRadius: '20px',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
            }}
            styles={{
                body: {
                    padding: '20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }
            }}
        >
            <div>
                {/* Brand & Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <Text style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {product.brand || 'TECH'}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Rate disabled defaultValue={product.rating || 5} style={{ fontSize: '10px' }} />
                        <Text style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({product.reviewCount || 0})</Text>
                    </div>
                </div>

                {/* Tiêu đề */}
                <Tooltip title={product.name}>
                    <Link to={`/product/${product.id}`}>
                        <Title
                            level={4}
                            style={{
                                marginBottom: '10px',
                                color: '#fff',
                                fontSize: '1.1rem',
                                height: '1.4em',
                                overflow: 'hidden',
                                fontWeight: 600
                            }}
                            ellipsis={{ rows: 1 }}
                        >
                            {product.name}
                        </Title>
                    </Link>
                </Tooltip>

                {/* Mô tả */}
                <Paragraph
                    type="secondary"
                    style={{
                        marginBottom: '16px',
                        color: 'var(--text-muted)',
                        height: '3.2em',
                        lineHeight: '1.6em',
                        overflow: 'hidden',
                        fontSize: '0.9rem'
                    }}
                    ellipsis={{ rows: 2 }}
                >
                    {product.description}
                </Paragraph>
            </div>

            {/* Footer: Giá & Nút */}
            <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <Title level={3} style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>
                        {product.price?.toLocaleString('vi-VN')} ₫
                    </Title>
                    {product.originalPrice && (
                        <Text delete style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {product.originalPrice?.toLocaleString('vi-VN')} ₫
                        </Text>
                    )}
                </div>

                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <BaseButton
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={handleAddToCart}
                        style={{ width: '100%', height: '42px', borderRadius: '10px', fontWeight: 600 }}
                    >
                        Thêm Vào Giỏ
                    </BaseButton>
                    <Link to={`/product/${product.id}`} style={{ width: '100%' }}>
                        <BaseButton
                            icon={<EyeOutlined />}
                            style={{ width: '100%', height: '42px', borderRadius: '10px', fontWeight: 600, background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                        >
                            Xem Chi Tiết
                        </BaseButton>
                    </Link>
                </Space>
            </div>
        </Card>
    );
};

export default ProductCard;
