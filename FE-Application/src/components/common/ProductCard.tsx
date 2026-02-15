import React from 'react';
import { Card, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import type { Product } from '../../types/product';
import BaseButton from '../common/BaseButton';
import { notification } from '../../utils/notification';
import { cartApi } from '../../api/cartApi';
import { useCart } from '../../hooks/useCart';

const { Paragraph, Title } = Typography;

interface ProductCardProps {
    product: Product;
}

/**
 * Thẻ hiển thị sản phẩm với format đồng nhất tuyệt đối.
 * Đảm bảo mọi thẻ có cùng chiều cao, ảnh cùng tỉ lệ và văn bản được cắt gọn thông minh.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { refreshCart } = useCart();

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

    return (
        <Card
            hoverable
            className="animate-fade-up"
            cover={
                <div style={{ position: 'relative', overflow: 'hidden', height: '220px', background: '#1e293b' }}>
                    <img
                        alt={product.name}
                        src={product.imageUrl}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            }
            style={{
                borderRadius: '16px',
                overflow: 'hidden',
                height: '100%', // Đảm bảo thẻ chiếm hết chiều cao hàng của Grid
                display: 'flex',
                flexDirection: 'column'
            }}
            styles={{
                body: {
                    padding: '24px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }
            }}
        >
            <div>
                {/* Tiêu đề cố định 1 dòng */}
                <Title
                    level={4}
                    style={{
                        marginBottom: '12px',
                        color: '#fff',
                        fontSize: '1.2rem',
                        height: '1.5em', // Cố định chiều cao dòng để không bị lệch khi vắng chữ
                        overflow: 'hidden'
                    }}
                    ellipsis={{ rows: 1 }}
                >
                    {product.name}
                </Title>

                {/* Mô tả cố định đúng 2 dòng, có dấu ... nếu dài hơn */}
                <Paragraph
                    type="secondary"
                    style={{
                        marginBottom: '20px',
                        color: 'var(--text-muted)',
                        height: '3.2em', // Cố định chiều cao cho đúng 2 dòng văn bản
                        lineHeight: '1.6em',
                        overflow: 'hidden'
                    }}
                    ellipsis={{ rows: 2 }}
                >
                    {product.description}
                </Paragraph>
            </div>

            {/* Phần chân thẻ luôn nằm sát đáy nhờ flex: 1 và justify-content: space-between */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <Title level={3} style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem' }}>
                    ${product.price}
                </Title>
                <BaseButton
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    style={{ borderRadius: '8px' }}
                >
                    Thêm
                </BaseButton>
            </div>
        </Card>
    );
};

export default ProductCard;
