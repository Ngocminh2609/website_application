import React from "react";
import {
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Tooltip,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import type { Coupon } from "../../api/couponApi";
import BaseButton from "../../components/common/BaseButton";
import type { ColumnsType } from "antd/es/table";
import { useVoucherManagementState, type VoucherFormValues } from "../../hooks/Admin/useVoucherManagementState";
import { styles } from "./styles/voucher-management.styles";
import { VOUCHER_STRINGS } from "../../constants/Admin/voucher-management";

import { formatCurrency, calculateUsagePercentage } from "./helper";

const VoucherManagement: React.FC = () => {
  const {
    coupons,
    loading,
    isModalVisible,
    setIsModalVisible,
    form,
    handleStatusChange,
    handleDelete,
    handleCreate,
  } = useVoucherManagementState();

  const columns: ColumnsType<Coupon> = [
    {
      title: VOUCHER_STRINGS.table.code,
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <Tag color="blue" style={styles.tagCode}>
          {code}
        </Tag>
      ),
    },
    {
      title: VOUCHER_STRINGS.table.type,
      dataIndex: "discountType",
      key: "discountType",
      render: (type: string, record: Coupon) => (
        <span>
          {type === "PERCENT"
            ? `${VOUCHER_STRINGS.table.percentPrefix}${record.discountValue}%`
            : `${VOUCHER_STRINGS.table.fixedPrefix}${formatCurrency(record.discountValue, false)}`}
        </span>
      ),
    },
    {
      title: VOUCHER_STRINGS.table.minOrder,
      dataIndex: "minOrderAmount",
      key: "minOrderAmount",
      render: (amt: number) => <span>{formatCurrency(amt)}</span>,
    },
    {
      title: VOUCHER_STRINGS.table.usage,
      key: "usage",
      render: (_, record: Coupon) => {
        const usagePercent = calculateUsagePercentage(record.usedCount, record.usageLimit || 1);
        return (
          <Tooltip
            title={`Đã dùng: ${record.usedCount} / Tổng: ${record.usageLimit}`}
          >
            <div style={styles.usageWrapper}>
              <div style={styles.usageProgressLabel}>
                <span>{VOUCHER_STRINGS.table.progressLabel}</span>
                <span>
                  {record.usedCount}/{record.usageLimit}
                </span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={styles.progressBarFill(usagePercent)} />
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: VOUCHER_STRINGS.table.status,
      key: "status",
      render: (_, record: Coupon) => (
        <Select
          value={record.isActive}
          onChange={(val) => handleStatusChange(record.id, val)}
          size="small"
          style={styles.statusSelect}
          options={[
            { label: VOUCHER_STRINGS.table.active, value: true },
            { label: VOUCHER_STRINGS.table.inactive, value: false },
          ]}
          status={record.isActive ? undefined : "warning"}
        />
      ),
    },
    {
      title: VOUCHER_STRINGS.table.action,
      key: "action",
      align: "right",
      render: (_, record: Coupon) => (
        <BaseButton
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.headerTitle}>
            {VOUCHER_STRINGS.headerTitle}
          </h3>
          <p style={styles.headerSubtitle}>
            {VOUCHER_STRINGS.headerSubtitle}
          </p>
        </div>
        <BaseButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          {VOUCHER_STRINGS.createBtn}
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
        title={
          <Space>
            <GiftOutlined /> {VOUCHER_STRINGS.modal.titleAdd}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText={VOUCHER_STRINGS.modal.btnSubmit}
        confirmLoading={loading}
        width={500}
      >
        <Form<VoucherFormValues>
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ discountType: "FIXED", usageLimit: 100 }}
        >
          <Form.Item
            name="code"
            label={VOUCHER_STRINGS.modal.codeLabel}
            rules={[{ required: true, message: VOUCHER_STRINGS.modal.codeRequired }]}
          >
            <Input
              placeholder={VOUCHER_STRINGS.modal.codePlaceholder}
              style={styles.inputCode}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="discountType" label={VOUCHER_STRINGS.modal.typeLabel}>
                <Select
                  options={[
                    { label: VOUCHER_STRINGS.modal.typePercent, value: "PERCENT" },
                    { label: VOUCHER_STRINGS.modal.typeFixed, value: "FIXED" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discountValue"
                label={VOUCHER_STRINGS.modal.valueLabel}
                rules={[{ required: true, message: VOUCHER_STRINGS.modal.valueRequired }]}
              >
                <InputNumber style={styles.inputNumberWidth} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="minOrderAmount"
            label={VOUCHER_STRINGS.modal.minOrderLabel}
            rules={[{ required: true, message: VOUCHER_STRINGS.modal.minOrderRequired }]}
          >
            <InputNumber
              style={styles.inputNumberWidth}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="usageLimit" label={VOUCHER_STRINGS.modal.usageLimitLabel}>
                <InputNumber style={styles.inputNumberWidth} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expiresAt" label={VOUCHER_STRINGS.modal.expiresLabel}>
                <DatePicker style={styles.inputNumberWidth} showTime />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherManagement;
