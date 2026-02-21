import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Form, Input, InputNumber, Select, DatePicker, Tooltip, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons';
import { couponApi, type Coupon } from '../../api/couponApi';
import { notification } from '../../utils/notification';
import BaseButton from '../../components/common/BaseButton';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';

interface VoucherFormValues extends Omit<Partial<Coupon>, 'expiresAt'> {
    expiresAt?: Dayjs | null;
}

const VoucherManagement: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm<VoucherFormValues>();

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const data = await couponApi.getAll();
            setCoupons(data);
        } catch {
            notification.error('Không thể tải danh sách mã giảm giá');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleStatusChange = async (id: number, active: boolean) => {
        try {
            await couponApi.updateStatus(id, active);
            notification.success('Đã cập nhật trạng thái');
            fetchCoupons();
        } catch {
            notification.error('Thao tác thất bại');
        }
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xóa mã giảm giá',
            content: 'Bạn có chắc chắn muốn xóa mã này? Hành động này không thể hoàn tác.',
            okType: 'danger',
            onOk: async () => {
                try {
                    await couponApi.delete(id);
                    notification.success('Đã xóa mã giảm giá');
                    fetchCoupons();
                } catch {
                    notification.error('Không thể xóa mã giảm giá');
                }
            }
        });
    };

    const handleCreate = async (values: VoucherFormValues) => {
        try {
            setLoading(true);
            const payload: Partial<Coupon> = {
                ...values,
                isActive: true,
                expiresAt: values.expiresAt ? values.expiresAt.toISOString() : undefined
            };
            await couponApi.create(payload);
            notification.success('Tạo mã giảm giá thành công');
            setIsModalVisible(false);
            form.resetFields();
            fetchCoupons();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Lỗi khi tạo mã';
            notification.error(message);
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<Coupon> = [
        {
            title: 'Mã Code',
            dataIndex: 'code',
            key: 'code',
            render: (code: string) => <Tag color="blue" style={{ fontWeight: 700, padding: '4px 10px', fontSize: 13 }}>{code}</Tag>
        },
        {
            title: 'Loại giảm giá',
            dataIndex: 'discountType',
            key: 'discountType',
            render: (type: string, record: Coupon) => (
                <span>
                    {type === 'PERCENT' ? `Giảm ${record.discountValue}%` : `Giảm ${record.discountValue.toLocaleString()}đ`}
                </span>
            )
        },
        {
            title: 'Đơn tối thiểu',
            dataIndex: 'minOrderAmount',
            key: 'minOrderAmount',
            render: (amt: number) => <span>{amt.toLocaleString()} đ</span>
        },
        {
            title: 'Lượt dùng',
            key: 'usage',
            render: (_, record: Coupon) => (
                <Tooltip title={`Đã dùng: ${record.usedCount} / Tổng: ${record.usageLimit}`}>
                    <div style={{ width: 100 }}>
                        <div style={{ fontSize: 11, marginBottom: 4, display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                            <span>Tiến độ:</span>
                            <span>{record.usedCount}/{record.usageLimit}</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--glass-border)', borderRadius: 2 }}>
                            <div style={{
                                height: '100%',
                                width: `${Math.min(100, (record.usedCount / (record.usageLimit || 1)) * 100)}%`,
                                background: 'var(--primary-color)',
                                borderRadius: 2
                            }} />
                        </div>
                    </div>
                </Tooltip>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record: Coupon) => (
                <Select
                    value={record.isActive}
                    onChange={(val) => handleStatusChange(record.id, val)}
                    size="small"
                    style={{ width: 110 }}
                    options={[
                        { label: 'Kích hoạt', value: true },
                        { label: 'Tạm dừng', value: false }
                    ]}
                    status={record.isActive ? undefined : 'warning'}
                />
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'right',
            render: (_, record: Coupon) => (
                <BaseButton type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
            )
        }
    ];

    return (
        <div style={{ padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h3 style={{ color: 'var(--text-main)', margin: 0 }}>Quản lý Chương trình Ưu đãi</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Tạo và điều chỉnh các mã giảm giá cho khách hàng</p>
                </div>
                <BaseButton type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                    Tạo mã mới
                </BaseButton>
            </div>

            <Table
                columns={columns}
                dataSource={coupons}
                rowKey="id"
                loading={loading}
                className="glass-table"
                pagination={{ pageSize: 8 }}
            />

            <Modal
                title={<Space><GiftOutlined /> Tạo mã giảm giá mới</Space>}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okText="Phát hành"
                confirmLoading={loading}
                width={500}
            >
                <Form<VoucherFormValues> form={form} layout="vertical" onFinish={handleCreate} initialValues={{ discountType: 'FIXED', usageLimit: 100 }}>
                    <Form.Item name="code" label="Mã Voucher" rules={[{ required: true, message: 'Nhập mã code' }]}>
                        <Input placeholder="Ví dụ: HELLO2024" style={{ textTransform: 'uppercase' }} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="discountType" label="Kiểu giảm giá">
                                <Select options={[
                                    { label: 'Theo phần trăm (%)', value: 'PERCENT' },
                                    { label: 'Cố định (đ)', value: 'FIXED' }
                                ]} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true, message: 'Nhập giá trị' }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="minOrderAmount" label="Giá trị đơn tối thiểu" rules={[{ required: true, message: 'Nhập giá trị' }]}>
                        <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="usageLimit" label="Tổng lượt sử dụng">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="expiresAt" label="Ngày hết hạn">
                                <DatePicker style={{ width: '100%' }} showTime />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default VoucherManagement;
