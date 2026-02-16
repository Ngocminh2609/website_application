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

    // Lấy thông tin từ VNPay trả về trên URL
    const txnRef = searchParams.get('vnp_TxnRef');
    const amount = searchParams.get('vnp_Amount');

    useEffect(() => {
        const verify = async () => {
            try {
                // Backend sẽ xác thực chữ ký và cập nhật DB
                const response = await paymentApi.verifyPayment(location.search);
                if (response.status === 'OK') {
                    setStatus('success');
                    // Đồng bộ lại giỏ hàng (Backend đã clear)
                    await refreshCart(true);
                } else {
                    setStatus('failed');
                }
            } catch {
                setStatus('failed');
            }
        };

        verify();
    }, [location.search, refreshCart]);

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
        <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
            <Card bordered={false} style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: 16 }}>
                {status === 'success' ? (
                    <Result
                        status="success"
                        icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                        title={<Title level={2}>Thanh Toán Thành Công!</Title>}
                        subTitle={
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text type="secondary">Cảm ơn bạn đã tin tưởng lựa chọn sản phẩm của chúng tôi.</Text>
                                <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f', marginTop: 16 }}>
                                    <Space split={<Divider type="vertical" />}>
                                        <Text>Mã đơn hàng: <b>#{txnRef}</b></Text>
                                        <Text>Số tiền: <b style={{ color: '#cf1322' }}>{formatCurrency(amount)}</b></Text>
                                    </Space>
                                </Card>
                            </Space>
                        }
                    />
                ) : (
                    <Result
                        status="error"
                        icon={<CloseCircleFilled style={{ color: '#ff4d4f' }} />}
                        title={<Title level={2}>Thanh Toán Không Thành Công</Title>}
                        subTitle="Giao dịch của bạn đã bị hủy hoặc gặp lỗi trong quá trình xử lý. Vui lòng thử lại hoặc liên hệ hỗ trợ."
                    />
                )}

                {status === 'success' && (
                    <div style={{ marginTop: 40, padding: '0 20px' }}>
                        <Divider>Hành trình đơn hàng</Divider>
                        <Steps
                            current={1}
                            items={[
                                { title: 'Đã thanh toán', icon: <CheckCircleFilled /> },
                                { title: 'Đang xử lý', icon: <SolutionOutlined /> },
                                { title: 'Giao hàng', icon: <TruckOutlined /> },
                                { title: 'Hoàn thành', icon: <SmileOutlined /> },
                            ]}
                        />
                        <div style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
                            <Text italic type="secondary">
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
                            style={{ borderRadius: 8, height: 48, padding: '0 32px', background: '#1890ff', border: 'none' }}
                        >
                            Xem đơn hàng
                        </Button>
                        <Button
                            size="large"
                            icon={<ShoppingOutlined />}
                            onClick={() => navigate('/products')}
                            style={{ borderRadius: 8, height: 48, padding: '0 32px' }}
                        >
                            Tiếp tục mua sắm
                        </Button>
                        <Button
                            size="large"
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                            style={{ borderRadius: 8, height: 48, padding: '0 32px' }}
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
