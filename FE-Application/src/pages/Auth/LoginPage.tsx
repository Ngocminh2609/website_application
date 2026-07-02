import React, { useState } from 'react';
import { Form, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import BaseButton from '../../components/common/BaseButton';
import BaseInput from '../../components/common/BaseInput';
import { authApi } from '../../api/authApi';
import { notification } from '../../utils/notification';
import type { LoginRequest, AuthResponse } from '../../types/auth';
import { LOGIN_CARD_STYLE } from '../../styles/commonStyles';

const { Title, Text } = Typography;

interface LoginPageProps {
    onLoginSuccess: () => void;
}

/**
 * Trang Đăng nhập tích hợp xác thực truyền thống và Google OAuth 2.0.
 * Đã xử lý các lỗi TypeScript 'any' để đảm bảo Type-safety.
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    // Xử lý đăng nhập truyền thống
    const onFinish = async (values: LoginRequest) => {
        setLoading(true);
        try {
            const response = await authApi.login(values);
            handleAuthResponse(response);
        } catch {
            notification.auth.loginError();
        } finally {
            setLoading(false);
        }
    };

    // Xử lý sau khi Google cấp Token
    const handleGoogleSuccess = async () => {
        setLoading(true);
        try {
            await authApi.googleLogin();
        } catch {
            notification.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    // Hàm dùng chung để lưu Session với Type định nghĩa rõ ràng
    const handleAuthResponse = (response: AuthResponse) => {
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            notification.auth.loginSuccess();
            onLoginSuccess();
            navigate('/');
        }
    };

    return (
        <div style={LOGIN_CARD_STYLE} className="animate-fade-up">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Title level={2} style={{ color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>CHÀO MỪNG TRỞ LẠI</Title>
                <Text style={{ color: 'var(--text-muted)' }}>Vui lòng đăng nhập để tiếp tục</Text>
            </div>

            <Form<LoginRequest> name="login" onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <BaseInput prefix={<UserOutlined style={{ color: 'var(--primary-color)' }} />} placeholder="Tên đăng nhập" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <BaseInput.Password
                        prefix={<LockOutlined style={{ color: 'var(--primary-color)' }} />}
                        placeholder="Mật khẩu"
                    />
                </Form.Item>

                <Form.Item>
                    <BaseButton type="primary" htmlType="submit" loading={loading} style={{ width: '100%', height: '52px', borderRadius: '12px', fontWeight: 600 }}>
                        ĐĂNG NHẬP
                    </BaseButton>
                </Form.Item>

                <Divider style={{ borderColor: 'var(--glass-border)' }}>
                    <Text style={{ color: 'var(--text-muted)', fontSize: '12px' }}>HOẶC TIẾP TỤC VỚI</Text>
                </Divider>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => notification.error('Lỗi kết nối với Google')}
                        theme="filled_blue"
                        shape="pill"
                        text="signin_with"
                        width="320"
                    />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Text style={{ color: 'var(--text-muted)' }}>Chưa có tài khoản? </Text>
                    <span onClick={() => navigate('/register')} style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600 }}>Tạo tài khoản mới</span>
                </div>
            </Form>
        </div>
    );
};

export default LoginPage;
