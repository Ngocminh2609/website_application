import React, { useEffect, useState } from 'react';
import {
    Typography, Form, Input, Avatar, Upload, Tabs, Spin, Divider, Row, Col
} from 'antd';
import {
    UserOutlined, EditOutlined, LockOutlined, UploadOutlined, CameraOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { User } from '../../types/auth';
import { userApi } from '../../api/userApi';
import { fileApi } from '../../api/fileApi';
import { useLocation } from 'react-router-dom';
import { notification } from '../../utils/notification';
import BaseButton from '../../components/common/BaseButton';

const { Title, Text } = Typography;

interface ProfilePageProps {
    onUserUpdate: (updated: Partial<User>) => void;
}

/**
 * Trang hồ sơ cá nhân - Cho phép người dùng cập nhật thông tin và đổi mật khẩu.
 * Tách form thành 2 tab để tránh submit chung gây nhầm lẫn giữa đổi info và đổi password.
 */
const ProfilePage: React.FC<ProfilePageProps> = ({ onUserUpdate }) => {
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userApi.getProfile();
                setUser(data);
                setAvatarUrl(data.avatarUrl);
                profileForm.setFieldsValue({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    username: data.username,
                });
            } catch {
                notification.error('Không thể tải thông tin hồ sơ');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [profileForm, location.key]);

    const handleSaveProfile = async (values: { fullName: string; email: string; phone: string }) => {
        setSavingProfile(true);
        try {
            const updated = await userApi.updateProfile({ ...values, avatarUrl });
            // Đồng bộ lại localStorage và notify App để Navbar render lại ngay lập tức
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                localStorage.setItem('user', JSON.stringify({ ...parsed, ...updated }));
            }
            setUser(updated);
            onUserUpdate(updated);
            notification.success('Cập nhật hồ sơ thành công');
        } catch (err: unknown) {
            notification.error(err instanceof Error ? err.message : 'Cập nhật thất bại');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (values: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        if (values.newPassword !== values.confirmPassword) {
            notification.error('Mật khẩu xác nhận không khớp');
            return;
        }
        setSavingPassword(true);
        try {
            await userApi.changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            notification.success('Đổi mật khẩu thành công');
            passwordForm.resetFields();
        } catch (err: unknown) {
            notification.error(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại');
        } finally {
            setSavingPassword(false);
        }
    };

    // Upload ảnh đại diện: tải lên storage rồi lưu ngay vào DB, không cần bấm Lưu thay đổi
    const uploadProps: UploadProps = {
        showUploadList: false,
        accept: 'image/*',
        beforeUpload: async (file) => {
            setUploadingAvatar(true);
            try {
                const res = await fileApi.uploadImage(file, 'user');
                // Lưu ngay vào DB để tránh mất ảnh nếu người dùng không bấm Lưu thay đổi
                await userApi.updateProfile({ avatarUrl: res.url });
                setAvatarUrl(res.url);
                onUserUpdate({ avatarUrl: res.url });
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    localStorage.setItem('user', JSON.stringify({ ...parsed, avatarUrl: res.url }));
                }
                notification.success('Cập nhật ảnh đại diện thành công');
            } catch {
                notification.error('Tải ảnh lên thất bại');
            } finally {
                setUploadingAvatar(false);
            }
            return false; // Ngăn ant design tự upload
        },
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    const cardStyle: React.CSSProperties = {
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '24px',
        padding: '40px',
        backdropFilter: 'blur(10px)',
    };

    const inputStyle: React.CSSProperties = {
        borderRadius: '10px',
        height: '46px',
    };

    return (
        <div
            className="main-content animate-fade-in"
            style={{ paddingTop: '100px', paddingBottom: '80px', color: 'var(--text-main)' }}
        >
            {/* Header */}
            <div style={{ marginBottom: '48px' }}>
                <Text style={{ color: 'var(--primary-color)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                    TÀI KHOẢN CỦA TÔI
                </Text>
                <Title level={2} style={{ color: 'var(--text-main)', margin: '8px 0 0', fontWeight: 800 }}>
                    Hồ Sơ Cá Nhân
                </Title>
            </div>

            <Row gutter={[48, 48]}>
                {/* Cột trái: Avatar + thông tin nhanh */}
                <Col xs={24} lg={7}>
                    <div style={{ ...cardStyle, textAlign: 'center' }}>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                            <Avatar
                                size={120}
                                src={avatarUrl}
                                icon={!avatarUrl && <UserOutlined />}
                                style={{ background: 'var(--primary-color)', fontSize: '48px' }}
                                onError={() => {
                                    setAvatarUrl(undefined);
                                    return false;
                                }}
                            />
                            <Upload {...uploadProps}>
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    width: '36px',
                                    height: '36px',
                                    background: 'var(--primary-color)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid #0f172a',
                                }}>
                                    {uploadingAvatar
                                        ? <Spin size="small" />
                                        : <CameraOutlined style={{ color: '#fff', fontSize: '16px' }} />
                                    }
                                </div>
                            </Upload>
                        </div>

                        <Title level={4} style={{ color: 'var(--text-main)', margin: '0 0 4px' }}>
                            {user?.fullName || user?.username}
                        </Title>
                        <Text style={{ color: 'var(--text-muted)' }}>{user?.email}</Text>

                        <Divider style={{ borderColor: 'var(--glass-border)', margin: '24px 0' }} />

                        <div style={{ textAlign: 'left' }}>
                            {[
                                { label: 'Tên đăng nhập', value: user?.username },
                                { label: 'Vai trò', value: user?.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng' },
                                { label: 'Ngày tham gia', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-' },
                            ].map(item => (
                                <div key={item.label} style={{ marginBottom: '16px' }}>
                                    <Text style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>{item.label}</Text>
                                    <Text style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item.value}</Text>
                                </div>
                            ))}
                        </div>

                        <Upload {...uploadProps}>
                            <BaseButton
                                icon={<UploadOutlined />}
                                style={{
                                    width: '100%',
                                    marginTop: '8px',
                                    background: 'var(--glass-bg)',
                                    borderColor: 'var(--glass-border)',
                                    color: 'var(--text-main)',
                                    height: '42px',
                                    borderRadius: '10px'
                                }}
                                loading={uploadingAvatar}
                            >
                                Thay ảnh đại diện
                            </BaseButton>
                        </Upload>
                    </div>
                </Col>

                {/* Cột phải: Tabs form */}
                <Col xs={24} lg={17}>
                    <div style={cardStyle}>
                        <Tabs
                            defaultActiveKey="profile"
                            items={[
                                {
                                    key: 'profile',
                                    label: (
                                        <span style={{ color: 'inherit' }}>
                                            <EditOutlined style={{ marginRight: '8px' }} />
                                            Thông tin cá nhân
                                        </span>
                                    ),
                                    children: (
                                        <Form
                                            form={profileForm}
                                            layout="vertical"
                                            onFinish={handleSaveProfile}
                                            style={{ marginTop: '24px' }}
                                        >
                                            <Row gutter={[24, 0]}>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        label={<Text style={{ color: 'var(--text-main)' }}>Tên đầy đủ</Text>}
                                                        name="fullName"
                                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                                    >
                                                        <Input style={inputStyle} placeholder="Nguyễn Văn A" />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        label={<Text style={{ color: 'var(--text-main)' }}>Tên đăng nhập</Text>}
                                                        name="username"
                                                    >
                                                        <Input style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} disabled />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        label={<Text style={{ color: 'var(--text-main)' }}>Email</Text>}
                                                        name="email"
                                                        rules={[
                                                            { required: true, message: 'Vui lòng nhập email' },
                                                            { type: 'email', message: 'Email không hợp lệ' }
                                                        ]}
                                                    >
                                                        <Input style={inputStyle} placeholder="example@email.com" />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        label={<Text style={{ color: 'var(--text-main)' }}>Số điện thoại</Text>}
                                                        name="phone"
                                                        rules={[
                                                            { pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại không hợp lệ' }
                                                        ]}
                                                    >
                                                        <Input style={inputStyle} placeholder="0901234567" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                                <BaseButton
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={savingProfile}
                                                    style={{ height: '46px', padding: '0 40px', borderRadius: '12px', fontWeight: 600 }}
                                                >
                                                    Lưu thay đổi
                                                </BaseButton>
                                            </div>
                                        </Form>
                                    ),
                                },
                                {
                                    key: 'password',
                                    label: (
                                        <span style={{ color: 'inherit' }}>
                                            <LockOutlined style={{ marginRight: '8px' }} />
                                            Đổi mật khẩu
                                        </span>
                                    ),
                                    children: (
                                        <Form
                                            form={passwordForm}
                                            layout="vertical"
                                            onFinish={handleChangePassword}
                                            style={{ marginTop: '24px', maxWidth: '480px' }}
                                        >
                                            <Form.Item
                                                label={<Text style={{ color: 'var(--text-main)' }}>Mật khẩu hiện tại</Text>}
                                                name="currentPassword"
                                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                                            >
                                                <Input.Password style={inputStyle} placeholder="Nhập mật khẩu hiện tại" />
                                            </Form.Item>

                                            <Form.Item
                                                label={<Text style={{ color: 'var(--text-main)' }}>Mật khẩu mới</Text>}
                                                name="newPassword"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                                                ]}
                                            >
                                                <Input.Password style={inputStyle} placeholder="Tối thiểu 6 ký tự" />
                                            </Form.Item>

                                            <Form.Item
                                                label={<Text style={{ color: 'var(--text-main)' }}>Xác nhận mật khẩu mới</Text>}
                                                name="confirmPassword"
                                                rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
                                            >
                                                <Input.Password style={inputStyle} placeholder="Nhập lại mật khẩu mới" />
                                            </Form.Item>

                                            <BaseButton
                                                type="primary"
                                                htmlType="submit"
                                                loading={savingPassword}
                                                style={{ height: '46px', padding: '0 40px', borderRadius: '12px', fontWeight: 600 }}
                                            >
                                                Cập nhật mật khẩu
                                            </BaseButton>
                                        </Form>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;
