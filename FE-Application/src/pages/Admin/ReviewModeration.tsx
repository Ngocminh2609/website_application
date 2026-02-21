import React, { useState, useEffect } from 'react';
import { Table, Rate, Avatar, Space, Typography, Tag, Tooltip, Modal } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { reviewApi } from '../../api/reviewApi';
import type { ProductReview } from '../../types/coupon-review';
import { notification } from '../../utils/notification';
import BaseButton from '../../components/common/BaseButton';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

const ReviewModeration: React.FC = () => {
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAllReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewApi.getAllAdmin();
            setReviews(data);
        } catch {
            notification.error('Không thể tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllReviews();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await reviewApi.approve(id);
            notification.success('Đã duyệt đánh giá');
            fetchAllReviews();
        } catch {
            notification.error('Duyệt thất bại');
        }
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xóa đánh giá',
            content: 'Bạn có chắc chắn muốn xóa đánh giá này? Nội dung sẽ bị gỡ vĩnh viễn.',
            okType: 'danger',
            onOk: async () => {
                try {
                    await reviewApi.delete(id);
                    notification.success('Đã xóa đánh giá');
                    fetchAllReviews();
                } catch {
                    notification.error('Thanh tác thất bại');
                }
            }
        });
    };

    const columns: ColumnsType<ProductReview> = [
        {
            title: 'Khách hàng',
            key: 'user',
            render: (_, record: ProductReview) => (
                <Space>
                    <Avatar
                        src={record.user.avatarUrl}
                        icon={<UserOutlined />}
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <div>
                        <Text strong style={{ display: 'block', color: 'var(--text-main)' }}>{record.user.fullName || record.user.username}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Đánh giá cho',
            key: 'product',
            render: (_, record: ProductReview) => (
                <Space>
                    <ShopOutlined style={{ color: 'var(--primary-color)' }} />
                    <Text style={{ fontSize: 13 }}>ID: #{record.product?.id || '?'}</Text>
                </Space>
            )
        },
        {
            title: 'Nội dung',
            key: 'content',
            width: '35%',
            render: (_, record: ProductReview) => (
                <div>
                    <Rate disabled defaultValue={record.rating} style={{ fontSize: 12, marginBottom: 4 }} />
                    <div style={{ color: 'var(--text-main)', fontSize: 13, lineHeight: '1.4' }}>{record.comment}</div>
                    <Space style={{ marginTop: 8 }}>
                        {record.isVerifiedPurchase && <Tag color="green" style={{ fontSize: 10, borderRadius: 4 }}>✓ ĐÃ MUA HÀNG</Tag>}
                        {!record.isApproved && <Tag color="warning" style={{ fontSize: 10, borderRadius: 4 }}>ĐANG CHỜ DUYỆT</Tag>}
                    </Space>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record: ProductReview) => (
                record.isApproved ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">Đã hiển thị</Tag>
                ) : (
                    <Tag color="default">Ẩn</Tag>
                )
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'right',
            render: (_, record: ProductReview) => (
                <Space>
                    {!record.isApproved && (
                        <Tooltip title="Duyệt để hiển thị">
                            <BaseButton
                                type="primary"
                                size="small"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleApprove(record.id)}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Gỡ bỏ">
                        <BaseButton
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '10px 0' }}>
            <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: 'var(--text-main)', margin: 0 }}>Phê duyệt & Kiểm duyệt Đánh giá</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Đảm bảo chất lượng trải nghiệm khách hàng thông qua kiểm soát nội dung</p>
            </div>

            <Table
                columns={columns}
                dataSource={reviews}
                rowKey="id"
                loading={loading}
                className="glass-table"
                pagination={{ pageSize: 8 }}
            />
        </div>
    );
};

export default ReviewModeration;
