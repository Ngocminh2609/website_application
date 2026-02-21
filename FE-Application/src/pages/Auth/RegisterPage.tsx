import React, { useState } from 'react';
import { Form, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BaseButton from '../../components/common/BaseButton';
import BaseInput from '../../components/common/BaseInput';
import { authApi } from '../../api/authApi';
import { notification } from '../../utils/notification';
import type { RegisterRequest } from '../../types/auth';

const { Title, Text } = Typography;

/**
 * Trang Đăng ký sử dụng thông báo tùy chỉnh trên Frontend.
 */
const RegisterPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const onFinish = async (values: RegisterRequest) => {
        setLoading(true);
        try {
            await authApi.register(values);

            // Sử dụng thông báo nghiệp vụ đăng ký thành công (DRY)
            notification.auth.registerSuccess();

            navigate('/login');
        } catch {
            // Loại bỏ biến error không sử dụng để tránh lỗi lints
            notification.auth.registerError();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '80px auto', padding: '40px', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Title level={2} style={{ color: 'var(--text-main)', margin: 0 }}>Tạo Tài Khoản</Title>
                <Text style={{ color: 'var(--text-muted)' }}>Gia nhập cộng đồng Tech Nova ngay hôm nay</Text>
            </div>

            <Form<RegisterRequest> name="register" onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <BaseInput prefix={<UserOutlined style={{ color: 'var(--primary-color)' }} />} placeholder="Tên đăng nhập" />
                </Form.Item>

                <Form.Item
                    name="fullName"
                >
                    <BaseInput prefix={<IdcardOutlined style={{ color: 'var(--primary-color)' }} />} placeholder="Họ và tên" />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không đúng định dạng!' }
                    ]}
                >
                    <BaseInput prefix={<MailOutlined style={{ color: 'var(--primary-color)' }} />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                >
                    <BaseInput.Password
                        prefix={<LockOutlined style={{ color: 'var(--primary-color)' }} />}
                        placeholder="Mật khẩu"
                    />
                </Form.Item>

                <Form.Item>
                    <BaseButton type="primary" htmlType="submit" loading={loading} style={{ width: '100%', height: '50px' }}>
                        Đăng Ký
                    </BaseButton>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Text style={{ color: 'var(--text-muted)' }}>Đã có tài khoản? </Text>
                    <span onClick={() => navigate('/login')} style={{ color: 'var(--primary-color)', cursor: 'pointer' }}>Đăng nhập</span>
                </div>
            </Form>
        </div>
    );
};

export default RegisterPage;
