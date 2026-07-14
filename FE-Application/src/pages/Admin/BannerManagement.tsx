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
  Tooltip,
  Row,
  Col,
  Upload,
  Typography,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { Banner } from "../../types/banner";
import BaseButton from "../../components/common/BaseButton";
import type { ColumnsType } from "antd/es/table";
import { useBannerManagementState } from "../../hooks/Admin/useBannerManagementState";
import { styles } from "./styles/banner-management.styles";
import { BANNER_STRINGS } from "../../constants/Admin/banner-management";

const { Text } = Typography;

const BannerManagement: React.FC = () => {
  const {
    banners,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingId,
    fileList,
    setFileList,
    form,
    handleCreateOrUpdate,
    handleEdit,
    handleStatusChange,
    handleDelete,
    handleAddNew,
  } = useBannerManagementState();

  const columns: ColumnsType<Banner> = [
    {
      title: BANNER_STRINGS.table.image,
      key: "image",
      width: 200,
      render: (_, record: Banner) => (
        <img
          src={record.imageUrl}
          alt={record.title || "Banner"}
          style={styles.bannerImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=300";
          }}
        />
      ),
    },
    {
      title: BANNER_STRINGS.table.title,
      dataIndex: "title",
      key: "title",
      render: (title: string) => (
        <Text strong style={styles.titleText}>
          {title || <Text type="secondary">{BANNER_STRINGS.table.noTitle}</Text>}
        </Text>
      ),
    },
    {
      title: BANNER_STRINGS.table.link,
      dataIndex: "linkUrl",
      key: "linkUrl",
      render: (link: string) => (
        <Text style={styles.linkText}>{link || "-"}</Text>
      ),
    },
    {
      title: BANNER_STRINGS.table.order,
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 100,
      sorter: (a, b) => a.sortOrder - b.sortOrder,
      render: (order: number) => <Tag color="blue">{order}</Tag>,
    },
    {
      title: BANNER_STRINGS.table.status,
      key: "status",
      width: 150,
      render: (_, record: Banner) => (
        <Select
          value={record.isActive}
          onChange={(val) => handleStatusChange(record.id, record, val)}
          size="small"
          style={styles.statusSelect}
          options={[
            { label: BANNER_STRINGS.table.active, value: true },
            { label: BANNER_STRINGS.table.inactive, value: false },
          ]}
          status={record.isActive ? undefined : "warning"}
        />
      ),
    },
    {
      title: BANNER_STRINGS.table.actions,
      key: "action",
      align: "right",
      width: 120,
      render: (_, record: Banner) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <BaseButton
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <BaseButton
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.headerTitle}>
            {BANNER_STRINGS.headerTitle}
          </h3>
          <p style={styles.headerSubtitle}>
            {BANNER_STRINGS.headerSubtitle}
          </p>
        </div>
        <BaseButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
        >
          {BANNER_STRINGS.addBtn}
        </BaseButton>
      </div>

      <Table
        columns={columns}
        dataSource={banners}
        rowKey="id"
        loading={loading}
        className="glass-table"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={
          <Space>
            <PictureOutlined />{" "}
            {editingId ? BANNER_STRINGS.modal.titleUpdate : BANNER_STRINGS.modal.titleAdd}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText={editingId ? BANNER_STRINGS.modal.btnUpdate : BANNER_STRINGS.modal.btnCreate}
        confirmLoading={loading}
        width={600}
      >
        <Form<Partial<Banner>>
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdate}
        >
          <Form.Item name="title" label={BANNER_STRINGS.modal.titleLabel}>
            <Input placeholder={BANNER_STRINGS.modal.titlePlaceholder} />
          </Form.Item>

          <Form.Item
            name="linkUrl"
            label={BANNER_STRINGS.modal.linkLabel}
          >
            <Input placeholder={BANNER_STRINGS.modal.linkPlaceholder} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sortOrder"
                label={BANNER_STRINGS.modal.orderLabel}
                rules={[{ required: true, message: BANNER_STRINGS.modal.orderRequired }]}
              >
                <InputNumber min={0} style={styles.inputNumberWidth} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label={BANNER_STRINGS.modal.statusLabel}
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: BANNER_STRINGS.modal.statusActive, value: true },
                    { label: BANNER_STRINGS.modal.statusInactive, value: false },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <Space>
                <UploadOutlined /> {BANNER_STRINGS.modal.imageLabel}
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={8}>
                <Upload
                  beforeUpload={() => false}
                  listType="picture-card"
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={styles.uploadButtonText}>{BANNER_STRINGS.modal.uploadBtn}</div>
                    </div>
                  )}
                </Upload>
              </Col>
              <Col span={16}>
                <Form.Item name="imageUrl">
                  <Input.TextArea
                    placeholder={BANNER_STRINGS.modal.urlPlaceholder}
                    style={styles.imageUrlInput}
                    disabled={fileList.length > 0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerManagement;
