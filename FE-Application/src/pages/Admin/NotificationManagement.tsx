import React, { useState } from 'react';
import { Card, Typography, Form, Input, List, Tag, Badge } from 'antd';
import { NotificationOutlined, SendOutlined, HistoryOutlined } from '@ant-design/icons';
import BaseButton from '../../components/common/BaseButton';
import { notification } from '../../utils/notification';

const { Title, Text } = Typography;

interface NotificationHistoryItem {
    id: number;
    message: string;
    type: string;
    createdAt: string;
    recipientCount: string;
}

/**
 * Quản lý thông báo hệ thống (Admin)
 * Cho phép Admin tạo thông báo và gửi cho tất cả người dùng (Broadcast)
 */
const NotificationManagement: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [history, setHistory] = useState<NotificationHistoryItem[]>([]);

    // Hàm gửi thông báo broadcast
    const handleBroadcast = async (values: { message: string }) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
            const response = await fetch(`${baseUrl}/notifications/broadcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                notification.success('Đã gửi thông báo cho tất cả người dùng!');
                form.resetFields();
                // Tạm thời thêm vào lịch sử ảo để admin thấy
                const newLog: NotificationHistoryItem = {
                    id: Date.now(),
                    message: values.message,
                    type: 'SYSTEM',
                    createdAt: new Date().toISOString(),
                    recipientCount: 'Toàn bộ hệ thống'
                };
                setHistory(prev => [newLog, ...prev]);
            } else {
                notification.error('Gửi thông báo thất bại');
            }
        } catch (error) {
            console.error('Lỗi gửi thông báo:', error);
            notification.error('Có lỗi xảy ra khi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px 0' }}>
            <Title level={4} style={{ color: '#fff', marginBottom: '24px' }}>
                <NotificationOutlined style={{ marginRight: '8px' }} />
                Gửi Thông Báo Hệ Thống
            </Title>

            <Card className="glass-effect" style={{ marginBottom: '32px' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleBroadcast}
                >
                    <Form.Item
                        name="message"
                        label={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Nội dung thông báo (Ví dụ: Black Friday, Noel, Tết...)</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Nhập thông báo bạn muốn gửi đến tất cả khách hàng..."
                            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <BaseButton
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<SendOutlined />}
                            style={{ width: '100%', height: '45px' }}
                        >
                            Gửi Thông Báo Ngay
                        </BaseButton>
                    </Form.Item>
                </Form>
            </Card>

            <Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>
                <HistoryOutlined style={{ marginRight: '8px' }} />
                Lịch sử gửi (Phiên làm việc này)
            </Title>

            <List
                dataSource={history}
                renderItem={(item) => (
                    <Card
                        size="small"
                        className="glass-effect"
                        style={{ marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <Badge status="processing" text={<Text strong style={{ color: '#fff' }}>{item.message}</Text>} />
                                <div style={{ marginTop: '8px' }}>
                                    <Text type="secondary" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                                        {new Date(item.createdAt).toLocaleString('vi-VN')}
                                    </Text>
                                </div>
                            </div>
                            <Tag color="blue">{item.recipientCount}</Tag>
                        </div>
                    </Card>
                )}
                locale={{ emptyText: <Text style={{ color: 'rgba(255,255,255,0.3)' }}>Chưa có thông báo nào được gửi trong phiên này</Text> }}
            />
        </div>
    );
};

export default NotificationManagement;
