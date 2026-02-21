import React from 'react';
import { Card, Typography, Tag, Tooltip, Space, Button } from 'antd';
import { ShoppingCartOutlined, FireOutlined, EyeOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import BaseButton from '../common/BaseButton';
import { notification } from '../../utils/notification';
import { cartApi } from '../../api/cartApi';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const { Paragraph, Title, Text } = Typography;

import { StarFilled } from '@ant-design/icons';

interface ProductCardProps {
    product: Product;
}

/**
 * Hiển thị số sao chính xác theo tỉ lệ thực (4.3 = 4 sao + 30% sao thứ 5).
 */
export const StarRating: React.FC<{ value: number; size?: number }> = ({ value, size = 16 }) => (
    <div style={{ display: 'inline-flex', gap: 3, alignItems: 'center', lineHeight: 0 }}>
        {[1, 2, 3, 4, 5].map(star => {
            const fillPercent = Math.min(100, Math.max(0, (value - (star - 1)) * 100));
            return (
                <div key={star} style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
                    <StarFilled style={{ color: 'rgba(255,255,255,0.1)', fontSize: size, position: 'absolute', top: 0, left: 0, display: 'block' }} />
                    {fillPercent > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: `${fillPercent}%`,
                            overflow: 'hidden',
                            height: '100%',
                            display: 'block',
                            transition: 'width 0.3s ease'
                        }}>
                            <StarFilled style={{ color: '#fadb14', fontSize: size, width: size, display: 'block' }} />
                        </div>
                    )}
                </div>
            );
        })}
    </div>
);

/**
 * Thẻ hiển thị sản phẩm cao cấp (Premium Card)
 * Hỗ trợ hiển thị Rating, Flash Sale, Brand và giá gốc gạch ngang.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { refreshCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const isFav = isInWishlist(product.id);

    // Sử dụng % giảm giá từ DB hoặc tự tính toán nếu chưa có
    const discountPercent = product.discountPercent || (product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0);

    const imgRef = React.useRef<HTMLImageElement>(null);

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            notification.error('Vui lòng đăng nhập để thực hiện');
            return;
        }

        try {
            // Thực hiện hiệu ứng bay ngay lập tức để tạo cảm giác phản hồi nhanh
            if (imgRef.current) {
                const { flyToCart } = await import('../../utils/cartAnimation');
                flyToCart(imgRef.current);
            }

            await cartApi.addToCart(product.id, 1);
            await refreshCart(true);
            // Có thể bỏ qua notification nếu hiệu ứng bay đã đủ rõ ràng, 
            // hoặc giữ lại để xác nhận thành công
            notification.product.addCartSuccess();
        } catch {
            notification.error('Không thể thêm sản phẩm vào giỏ hàng');
        }
    };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFav) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;

        // Tránh vòng lặp vô tận nếu chính ảnh fallback cũng không load được
        if (target.dataset.errored === 'true') return;
        target.dataset.errored = 'true';

        target.src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800';
    };

    return (
        <Card
            hoverable
            className="animate-fade-up product-card"
            cover={
                <div style={{ position: 'relative', overflow: 'hidden', height: '260px', background: 'var(--bg-secondary)' }}>
                    {/* Badge Flash Sale */}
                    {discountPercent > 0 && (
                        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                            <Tag color="#ef4444" style={{ borderRadius: '6px', fontWeight: 700, padding: '4px 8px', border: 'none' }}>
                                <FireOutlined /> {discountPercent}% OFF
                            </Tag>
                        </div>
                    )}

                    {/* Nút Yêu thích */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 3 }}>
                        <Button
                            shape="circle"
                            icon={isFav ? <HeartFilled style={{ color: '#f43f5e' }} /> : <HeartOutlined />}
                            onClick={toggleWishlist}
                            style={{
                                background: isFav ? 'rgba(255,255,255,0.9)' : 'var(--glass-bg)',
                                border: 'none',
                                backdropFilter: 'blur(4px)',
                                color: isFav ? '#f43f5e' : 'var(--text-main)'
                            }}
                        />
                    </div>

                    {/* Badge Best Seller */}
                    {product.isBestSeller && !isFav && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                            <Tag color="#f59e0b" style={{ borderRadius: '6px', fontWeight: 700, padding: '4px 8px', border: 'none' }}>
                                BÁN CHẠY
                            </Tag>
                        </div>
                    )}

                    <Link to={`/product/${product.id}`}>
                        <img
                            ref={imgRef}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <StarRating value={product.rating || 5} size={10} />
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
                                color: 'inherit',
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
                    <Title level={3} style={{ margin: 0, color: 'inherit', fontSize: '1.2rem', fontWeight: 700 }}>
                        {(product.price ?? 0).toLocaleString('vi-VN')} ₫
                    </Title>
                    {product.originalPrice && (
                        <Text delete style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {(product.originalPrice ?? 0).toLocaleString('vi-VN')} ₫
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
                            style={{
                                width: '100%',
                                height: '42px',
                                borderRadius: '10px',
                                fontWeight: 600,
                                background: 'var(--glass-bg)',
                                borderColor: 'var(--glass-border)',
                                color: 'var(--text-main)'
                            }}
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

