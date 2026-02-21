import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Result, Button, Steps, Card, Spin, Typography, Space, Divider } from 'antd';
import {
    CheckCircleFilled,
    CloseCircleFilled,
    ShoppingOutlined,
    HomeOutlined,
    LoadingOutlined,
    TruckOutlined,
    SolutionOutlined,
    SmileOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { paymentApi } from '../../api/paymentApi';
import { useCart } from '../../hooks/useCart';

const { Title, Text } = Typography;

/**
 * Trang thông báo kết quả thanh toán chuyên nghiệp.
 * Sử dụng Ant Design để tạo giao diện hiện đại, thân thiện.
 */
const PaymentSuccessPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const { refreshCart } = useCart();

    // Lấy thông tin đơn hàng (hỗ trợ cả VNPay và COD)
    const txnRef = searchParams.get('vnp_TxnRef') || searchParams.get('ORDER_ID');
    const amount = searchParams.get('vnp_Amount') || searchParams.get('AMOUNT');

    useEffect(() => {
        const verify = async () => {
            // Nếu là COD hoặc đã có tham số báo thành công trực tiếp
            if (searchParams.get('status') === 'OK') {
                setStatus('success');
                await refreshCart(true);
                return;
            }

            try {
                // Backend sẽ xác thực chữ ký VNPay
                const response = await paymentApi.verifyPayment(location.search);
                if (response.status === 'OK') {
                    setStatus('success');
                    await refreshCart(true);
                } else {
                    setStatus('failed');
                }
            } catch {
                setStatus('failed');
            }
        };

        verify();
    }, [location.search, refreshCart, searchParams]);

    const formatCurrency = (value: string | null) => {
        if (!value) return '0đ';
        const num = parseInt(value) / 100;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    };

    if (status === 'loading') {
        return (
            <div style={{ padding: '100px 0', textAlign: 'center' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} tip="Đang xác thực giao dịch..." />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '90px 20px 40px' }}>
            <Card className="glass-effect" bordered={false} style={{ boxShadow: 'var(--card-shadow)', borderRadius: 16 }}>
                {status === 'success' ? (
                    <Result
                        status="success"
                        icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                        title={<Title level={2} style={{ color: 'var(--text-main)' }}>Thanh Toán Thành Công!</Title>}
                        subTitle={
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text style={{ color: 'var(--text-muted)' }}>Cảm ơn bạn đã tin tưởng lựa chọn sản phẩm của chúng tôi.</Text>
                                <Card size="small" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', marginTop: 16 }}>
                                    <Space split={<Divider type="vertical" />} wrap>
                                        <Text style={{ color: 'var(--text-main)' }}>Mã đơn hàng: <b style={{ color: 'var(--primary-color)' }}>#{txnRef}</b></Text>
                                        <Text style={{ color: 'var(--text-main)' }}>Số tiền: <b style={{ color: '#ef4444' }}>{formatCurrency(amount)}</b></Text>
                                    </Space>
                                </Card>
                            </Space>
                        }
                    />
                ) : (
                    <Result
                        status="error"
                        icon={<CloseCircleFilled style={{ color: '#ff4d4f' }} />}
                        title={<Title level={2} style={{ color: 'var(--text-main)' }}>Thanh Toán Không Thành Công</Title>}
                        subTitle={<Text style={{ color: 'var(--text-muted)' }}>Giao dịch của bạn đã bị hủy hoặc gặp lỗi trong quá trình xử lý. Vui lòng thử lại hoặc liên hệ hỗ trợ.</Text>}
                    />
                )}

                {status === 'success' && (
                    <div style={{ marginTop: 40, padding: '0 20px' }}>
                        <Divider style={{ borderColor: 'var(--glass-border)', color: 'var(--text-main)' }}>Hành trình đơn hàng</Divider>
                        <Steps
                            current={1}
                            items={[
                                { title: <span style={{ color: 'var(--text-main)' }}>Đã thanh toán</span>, icon: <CheckCircleFilled /> },
                                { title: <span style={{ color: 'var(--text-main)' }}>Đang xử lý</span>, icon: <SolutionOutlined /> },
                                { title: <span style={{ color: 'var(--text-main)' }}>Giao hàng</span>, icon: <TruckOutlined /> },
                                { title: <span style={{ color: 'var(--text-main)' }}>Hoàn thành</span>, icon: <SmileOutlined /> },
                            ]}
                        />
                        <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--glass-border)' }}>
                            <Text italic style={{ color: 'var(--text-muted)' }}>
                                * Lưu ý: Đơn hàng sẽ bắt đầu được đóng gói và bàn giao cho đơn vị vận chuyển trong vòng 24h tới. Bạn có thể theo dõi trạng thái tại mục Đơn hàng của tôi.
                            </Text>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: 40, textAlign: 'center' }}>
                    <Space size="middle">
                        <Button
                            type="primary"
                            size="large"
                            icon={<HistoryOutlined />}
                            onClick={() => navigate('/orders')}
                            style={{ borderRadius: 8, height: 48, padding: '0 32px', background: 'var(--primary-color)', border: 'none' }}
                        >
                            Xem đơn hàng
                        </Button>
                        <Button
                            size="large"
                            icon={<ShoppingOutlined />}
                            onClick={() => navigate('/products')}
                            style={{ borderRadius: 8, height: 48, padding: '0 32px', background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-main)' }}
                        >
                            Tiếp tục mua sắm
                        </Button>
                        <Button
                            size="large"
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                            style={{ borderRadius: 8, height: 48, padding: '0 32px', background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-main)' }}
                        >
                            Trang chủ
                        </Button>
                    </Space>
                </div>
            </Card>
        </div>
    );
};

export default PaymentSuccessPage;
