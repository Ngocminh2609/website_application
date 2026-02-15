import React, { useState } from 'react';
import { Form, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BaseButton from '../../components/common/BaseButton';
import BaseInput from '../../components/common/BaseInput';
import { authApi } from '../../api/authApi';
import { notification } from '../../utils/notification';
import type { LoginRequest } from '../../types/auth';

const { Title, Text } = Typography;

interface LoginPageProps {
    onLoginSuccess: () => void;
}

/**
 * Trang Đăng nhập sử dụng Custom Notification từ FE.
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const onFinish = async (values: LoginRequest) => {
        setLoading(true);
        try {
            const response = await authApi.login(values);
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Sử dụng thông báo nghiệp vụ đã được định nghĩa chung (DRY)
                notification.auth.loginSuccess();

                onLoginSuccess();
                navigate('/');
            }
        } catch {
            // Loại bỏ biến error không sử dụng để tránh lỗi lints
            notification.auth.loginError();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>Chào Mừng Trở Lại</Title>
                <Text style={{ color: '#94a3b8' }}>Vui lòng đăng nhập để tiếp tục</Text>
            </div>

            <Form<LoginRequest> name="login" onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <BaseInput prefix={<UserOutlined style={{ color: '#6366f1' }} />} placeholder="Tên đăng nhập" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <BaseInput.Password
                        prefix={<LockOutlined style={{ color: '#6366f1' }} />}
                        placeholder="Mật khẩu"
                    />
                </Form.Item>

                <Form.Item>
                    <BaseButton type="primary" htmlType="submit" loading={loading} style={{ width: '100%', height: '50px' }}>
                        Đăng Nhập
                    </BaseButton>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Text style={{ color: '#94a3b8' }}>Chưa có tài khoản? </Text>
                    <span onClick={() => navigate('/register')} style={{ color: '#6366f1', cursor: 'pointer' }}>Đăng ký ngay</span>
                </div>
            </Form>
        </div>
    );
};

export default LoginPage;
