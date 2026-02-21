import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Tag, Rate, Space, Divider, Spin, Empty, Breadcrumb, Image, Avatar, Progress } from 'antd';
import {
    ShoppingCartOutlined,
    ArrowLeftOutlined,
    CheckCircleFilled,
    RocketOutlined,
    SafetyCertificateOutlined,
    SwapOutlined,
    UserOutlined,
    DeleteOutlined,
    StarFilled
} from '@ant-design/icons';
import { StarRating } from '../../components/common/ProductCard';
import { productApi } from '../../api/productApi';
import { cartApi } from '../../api/cartApi';
import { reviewApi } from '../../api/reviewApi';
import { useCart } from '../../hooks/useCart';
import type { Product } from '../../types/product';
import type { ProductReview } from '../../types/coupon-review';
import BaseButton from '../../components/common/BaseButton';
import BaseInput from '../../components/common/BaseInput';
import { notification } from '../../utils/notification';
import PersonalizedRecommendations from '../../components/common/PersonalizedRecommendations';



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
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');
    const currentUser = (() => { try { const s = localStorage.getItem('user'); return s ? JSON.parse(s) : null; } catch { return null; } })();

    const fetchReviews = async (productId: number) => {
        try {
            setReviewLoading(true);
            const data = await reviewApi.getByProduct(productId);
            setReviews(data);
        } catch {
            // Không cần hiện lỗi khi review rỗng
        } finally {
            setReviewLoading(false);
        }
    };

    useEffect(() => {
        const fetchProductDetail = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await productApi.getProductById(parseInt(id));
                setProduct(data);
                setMainImage(data.imageUrl);

                // Theo dõi hành vi người dùng
                import('../../utils/tracking').then(({ trackingUtils }) => {
                    trackingUtils.trackProductView(data.id);
                    if (data.category?.name) {
                        trackingUtils.trackCategoryView(data.category.name);
                    }
                });

                await fetchReviews(parseInt(id));
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [id]);

    const imageContainerRef = React.useRef<HTMLDivElement>(null);

    const handleAddToCart = async () => {
        if (!product) return;
        const token = localStorage.getItem('token');
        if (!token) {
            notification.error('Vui lòng đăng nhập để thực hiện');
            return;
        }

        try {
            // Thực hiện hiệu ứng bay
            if (imageContainerRef.current) {
                const imgElement = imageContainerRef.current.querySelector('img');
                if (imgElement) {
                    const { flyToCart } = await import('../../utils/cartAnimation');
                    flyToCart(imgElement);
                }
            }

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
                <Empty description={<span style={{ color: 'var(--text-main)' }}>Sản phẩm không tồn tại hoặc đã bị xóa</span>} />
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

    const discountPercent = product.discountPercent || (product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0);

    const handleSubmitReview = async () => {
        if (!currentUser) { notification.error('Vui lòng đăng nhập để gửi đánh giá'); return; }
        if (!id) return;
        try {
            setSubmitLoading(true);
            await reviewApi.create(parseInt(id), userRating, userComment);
            notification.success('Gửi đánh giá thành công!');
            setUserComment('');
            setUserRating(5);
            await fetchReviews(parseInt(id));
        } catch (err: unknown) {
            notification.error(err instanceof Error ? err.message : 'Gửi đánh giá thất bại');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        try {
            await reviewApi.delete(reviewId);
            notification.success('Xóa đánh giá thành công');
            if (id) await fetchReviews(parseInt(id));
        } catch (err: unknown) {
            notification.error(err instanceof Error ? err.message : 'Xóa thất bại');
        }
    };

    // Tính phân bố số sao để hiển thị progress bar
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => Math.round(r.rating) === star).length,
        percent: reviews.length > 0
            ? Math.round((reviews.filter(r => Math.round(r.rating) === star).length / reviews.length) * 100)
            : 0
    }));

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : (product?.rating || 5).toFixed(1);

    return (
        <Layout style={{ background: 'transparent', minHeight: '100vh', paddingTop: '100px' }}>
            <div className="main-content">
                {/* Breadcrumb hiện đại */}
                <Breadcrumb
                    items={[
                        { title: <Link to="/" style={{ color: 'var(--text-muted)' }}>Trang chủ</Link> },
                        { title: <Link to="/products" style={{ color: 'var(--text-muted)' }}>Sản phẩm</Link> },
                        { title: <span style={{ color: 'var(--text-main)' }}>{product.name}</span> },
                    ]}
                    style={{ marginBottom: '30px' }}
                />

                <Row gutter={[48, 48]} style={{ marginBottom: '60px' }}>
                    {/* KHỐI HÌNH ẢNH */}
                    <Col xs={24} lg={12}>
                        <div style={{ position: 'sticky', top: '120px' }}>
                            {/* Ảnh chính lớn */}
                            <div
                                ref={imageContainerRef}
                                style={{
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
                                <Space split={<Divider type="vertical" style={{ borderColor: 'var(--glass-border)' }} />}>
                                    <Typography.Text style={{ color: 'var(--primary-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                        {product.brand || 'NO BRAND'}
                                    </Typography.Text>
                                    <Tag color="blue" bordered={false} style={{ borderRadius: '4px', fontWeight: 600 }}>CHÍNH HÃNG</Tag>
                                    {product.isBestSeller && <Tag color="gold" bordered={false} style={{ borderRadius: '4px', fontWeight: 600 }}>BÁN CHẠY</Tag>}
                                </Space>

                                <Typography.Title level={1} style={{ color: 'var(--text-main)', fontSize: '2.5rem', marginBottom: '8px' }}>{product.name}</Typography.Title>

                                {/* Rating */}
                                <Space size="large" style={{ marginBottom: '10px' }}>
                                    <StarRating value={parseFloat(avgRating)} size={20} />
                                    <Typography.Text style={{ color: 'var(--text-muted)' }}>( {reviews.length} đánh giá từ người dùng )</Typography.Text>
                                </Space>

                                {/* Giá cả */}
                                <div style={{
                                    background: 'rgba(99, 102, 241, 0.05)',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    borderLeft: '4px solid var(--primary-color)'
                                }}>
                                    <Space align="baseline" size="middle">
                                        <Typography.Title level={2} style={{ color: 'var(--text-main)', margin: 0, fontSize: '2rem' }}>
                                            {product.price?.toLocaleString('vi-VN')} ₫
                                        </Typography.Title>
                                        {product.originalPrice && (
                                            <Typography.Text delete style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                                                {product.originalPrice?.toLocaleString('vi-VN')} ₫
                                            </Typography.Text>
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
                                            <Space><RocketOutlined style={{ color: 'var(--primary-color)' }} /> <Typography.Text style={{ color: 'var(--text-main)' }}>Giao hàng nhanh 2h</Typography.Text></Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space><SafetyCertificateOutlined style={{ color: 'var(--primary-color)' }} /> <Typography.Text style={{ color: 'var(--text-main)' }}>Bảo hành 24 tháng</Typography.Text></Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space><SwapOutlined style={{ color: 'var(--primary-color)' }} /> <Typography.Text style={{ color: 'var(--text-main)' }}>Lỗi 1 đổi 1 trong 30 ngày</Typography.Text></Space>
                                        </Col>
                                        <Col span={12}>
                                            <Space><CheckCircleFilled style={{ color: 'var(--primary-color)' }} /> <Typography.Text style={{ color: 'var(--text-main)' }}>Cam kết 100% chính hãng</Typography.Text></Space>
                                        </Col>
                                    </Row>
                                </div>

                                <Divider style={{ borderColor: 'var(--glass-border)' }} />

                                {/* Mô tả ngắn */}
                                <div>
                                    <Typography.Title level={5} style={{ color: 'var(--text-main)' }}>Mô tả sản phẩm</Typography.Title>
                                    <Typography.Paragraph style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.8' }}>
                                        {product.description}
                                    </Typography.Paragraph>
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

                {/* THÔNG SỐ KỸ THUẬT & REVIEW */}
                <div style={{
                    background: 'var(--glass-bg)',
                    borderRadius: '24px',
                    padding: '40px',
                    border: '1px solid var(--glass-border)',
                    marginBottom: '80px'
                }}>
                    <Row gutter={[48, 48]}>
                        {/* THÔNG SỐ KỸ THUẬT */}
                        <Col xs={24} md={12}>
                            <Typography.Title level={3} style={{ color: 'var(--text-main)', marginBottom: '30px' }}>Thông số kỹ thuật</Typography.Title>
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
                                                borderBottom: '1px solid var(--glass-border)'
                                            }}>
                                                <Typography.Text style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label.trim()}</Typography.Text>
                                                <Typography.Text style={{ color: 'var(--text-main)', fontWeight: 600 }}>{value ? value.trim() : ''}</Typography.Text>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Typography.Text style={{ color: 'var(--text-muted)' }}>Đang cập nhật thông tin...</Typography.Text>
                            )}
                        </Col>

                        {/* ĐÁNH GIÁ SẢN PHẨM */}
                        <Col xs={24} md={12}>
                            <Typography.Title level={3} style={{ color: 'var(--text-main)', marginBottom: '30px' }}>Đánh giá từ khách hàng</Typography.Title>

                            {/* Tổng quan rating */}
                            <div style={{
                                background: 'var(--bg-secondary)',
                                borderRadius: 16,
                                padding: '24px',
                                marginBottom: 24
                            }}>
                                <Row gutter={24} align="middle">
                                    <Col xs={8} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{avgRating}</div>
                                        <StarRating value={parseFloat(avgRating)} size={14} />
                                        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{reviews.length} đánh giá</div>
                                    </Col>
                                    <Col xs={16}>
                                        {ratingDistribution.map(({ star, count, percent }) => (
                                            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                <Typography.Text style={{ color: 'var(--text-muted)', fontSize: 12, width: 10 }}>{star}</Typography.Text>
                                                <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
                                                <Progress percent={percent} showInfo={false} strokeColor="#fadb14" trailColor="var(--glass-border)" style={{ flex: 1, margin: 0 }} />
                                                <Typography.Text style={{ color: 'var(--text-muted)', fontSize: 12, width: 20 }}>{count}</Typography.Text>
                                            </div>
                                        ))}
                                    </Col>
                                </Row>
                            </div>

                            {/* Form gửi đánh giá */}
                            {currentUser ? (
                                <div style={{
                                    background: 'rgba(99,102,241,0.05)',
                                    border: '1px solid rgba(99,102,241,0.2)',
                                    borderRadius: 16,
                                    padding: 20,
                                    marginBottom: 24
                                }}>
                                    <Typography.Text style={{ color: 'var(--text-main)', display: 'block', marginBottom: 12, fontWeight: 600 }}>Viết đánh giá của bạn</Typography.Text>
                                    <Rate value={userRating} onChange={setUserRating} style={{ marginBottom: 12 }} />
                                    <BaseInput
                                        placeholder="Nhập nhận xét của bạn..."
                                        value={userComment}
                                        onChange={(e) => setUserComment(e.target.value)}
                                        style={{ marginBottom: 12 }}
                                    />
                                    <BaseButton type="primary" onClick={handleSubmitReview} loading={submitLoading} style={{ width: '100%' }}>
                                        Gửi đánh giá
                                    </BaseButton>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '16px', marginBottom: 16 }}>
                                    <Typography.Text style={{ color: 'var(--text-muted)' }}>
                                        <Link to="/login" style={{ color: 'var(--primary-color)' }}>Đăng nhập</Link> để viết đánh giá
                                    </Typography.Text>
                                </div>
                            )}

                            {/* Danh sách review */}
                            {reviewLoading ? (
                                <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
                            ) : reviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 24 }}>
                                    <Typography.Text style={{ color: 'var(--text-muted)' }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</Typography.Text>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {reviews.map((review) => (
                                        <div key={review.id} style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: 12,
                                            padding: '16px 20px',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Space>
                                                    <Avatar src={review.user.avatarUrl} icon={<UserOutlined />} size={36} />
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <Typography.Text style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                                                                {review.user.fullName || review.user.username}
                                                            </Typography.Text>
                                                            {review.isVerifiedPurchase && (
                                                                <Tag color="green" bordered={false} style={{ fontSize: 11, padding: '0 6px' }}>
                                                                    <CheckCircleFilled /> Đã mua
                                                                </Tag>
                                                            )}
                                                        </div>
                                                        <StarRating value={review.rating} size={12} />
                                                    </div>
                                                </Space>
                                                <Space>
                                                    <Typography.Text style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                    </Typography.Text>
                                                    {(currentUser?.id === review.user.id || currentUser?.role === 'ADMIN') && (
                                                        <DeleteOutlined
                                                            style={{ color: '#ef4444', cursor: 'pointer', fontSize: 14 }}
                                                            onClick={() => handleDeleteReview(review.id)}
                                                        />
                                                    )}
                                                </Space>
                                            </div>
                                            {review.comment && (
                                                <Typography.Paragraph style={{ color: 'var(--text-muted)', margin: '10px 0 0 44px', fontSize: 14 }}>
                                                    {review.comment}
                                                </Typography.Paragraph>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>

                {/* GỢI Ý CÁ NHÂN HÓA */}
                <PersonalizedRecommendations
                    title="Có Thể Bạn Cũng Thích"
                    description="Sản phẩm được gợi ý riêng dựa trên lịch sử xem của bạn."
                    limit={5}
                />
            </div>
        </Layout>
    );
};

export default ProductDetailPage;
