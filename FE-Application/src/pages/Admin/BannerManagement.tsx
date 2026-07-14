import React, { useState, useEffect } from "react";
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
import type { UploadFile } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { bannerApi } from "../../api/bannerApi";
import { fileApi } from "../../api/fileApi";
import type { Banner } from "../../types/banner";
import { notification } from "../../utils/notification";
import BaseButton from "../../components/common/BaseButton";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm<Partial<Banner>>();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await bannerApi.getAll();
      setBanners(data);
    } catch {
      notification.error("Không thể tải danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreateOrUpdate = async (values: Partial<Banner>) => {
    try {
      setLoading(true);
      let imageUrl = values.imageUrl || "";

      // Nếu có tải ảnh lên từ máy tính
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploadRes = await fileApi.uploadImage(
          fileList[0].originFileObj as File,
          "banner",
        );
        imageUrl = uploadRes.url;
      }

      if (!imageUrl) {
        notification.error("Vui lòng tải lên hoặc nhập URL ảnh banner");
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        imageUrl,
      };

      if (editingId) {
        await bannerApi.update(editingId, payload);
        notification.success("Cập nhật banner thành công");
      } else {
        await bannerApi.create(payload);
        notification.success("Tạo banner mới thành công");
      }

      setIsModalVisible(false);
      setEditingId(null);
      form.resetFields();
      setFileList([]);
      fetchBanners();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Lỗi khi thực hiện thao tác";
      notification.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    form.setFieldsValue({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    });
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleStatusChange = async (
    id: number,
    banner: Banner,
    active: boolean,
  ) => {
    try {
      await bannerApi.update(id, { ...banner, isActive: active });
      notification.success("Đã cập nhật trạng thái hoạt động");
      fetchBanners();
    } catch {
      notification.error("Thao tác thất bại");
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xóa banner quảng cáo",
      content:
        "Bạn có chắc chắn muốn xóa banner này? Tệp tin liên quan trên MinIO cũng sẽ được dọn dẹp. Hành động này không thể hoàn tác.",
      okType: "danger",
      onOk: async () => {
        try {
          await bannerApi.delete(id);
          notification.success("Đã xóa banner");
          fetchBanners();
        } catch {
          notification.error("Không thể xóa banner");
        }
      },
    });
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ sortOrder: 0, isActive: true });
    setFileList([]);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<Banner> = [
    {
      title: "Hình ảnh",
      key: "image",
      width: 200,
      render: (_, record: Banner) => (
        <img
          src={record.imageUrl}
          alt={record.title || "Banner"}
          style={{
            width: "150px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid var(--glass-border)",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=300";
          }}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title: string) => (
        <Text strong style={{ color: "var(--text-main)" }}>
          {title || <Text type="secondary">Không có tiêu đề</Text>}
        </Text>
      ),
    },
    {
      title: "Liên kết (Link)",
      dataIndex: "linkUrl",
      key: "linkUrl",
      render: (link: string) => (
        <Text style={{ color: "var(--text-muted)" }}>{link || "-"}</Text>
      ),
    },
    {
      title: "Thứ tự",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 100,
      sorter: (a, b) => a.sortOrder - b.sortOrder,
      render: (order: number) => <Tag color="blue">{order}</Tag>,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_, record: Banner) => (
        <Select
          value={record.isActive}
          onChange={(val) => handleStatusChange(record.id, record, val)}
          size="small"
          style={{ width: 110 }}
          options={[
            { label: "Kích hoạt", value: true },
            { label: "Tạm dừng", value: false },
          ]}
          status={record.isActive ? undefined : "warning"}
        />
      ),
    },
    {
      title: "Thao tác",
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
    <div style={{ padding: "10px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h3 style={{ color: "var(--text-main)", margin: 0 }}>
            Quản lý Banners Quảng Cáo
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
            Thiết lập các slide banner xuất hiện tại trang chủ trang web
          </p>
        </div>
        <BaseButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
        >
          Thêm banner mới
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
            {editingId ? "Cập nhật banner quảng cáo" : "Tạo banner mới"}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText={editingId ? "Cập nhật" : "Tạo mới"}
        confirmLoading={loading}
        width={600}
      >
        <Form<Partial<Banner>>
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdate}
        >
          <Form.Item name="title" label="Tiêu đề Banner">
            <Input placeholder="Ví dụ: Chương trình khuyến mãi hè 2026" />
          </Form.Item>

          <Form.Item
            name="linkUrl"
            label="Liên kết chuyển hướng khi click (Link URL)"
          >
            <Input placeholder="Ví dụ: /products?brand=Apple hoặc https://..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sortOrder"
                label="Thứ tự hiển thị"
                rules={[{ required: true, message: "Vui lòng nhập thứ tự" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Trạng thái hiển thị"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: "Hiển thị (Kích hoạt)", value: true },
                    { label: "Tạm ẩn (Tạm dừng)", value: false },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <Space>
                <UploadOutlined /> Hình ảnh Banner (Tỷ lệ khuyến nghị 3:1)
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
                      <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                  )}
                </Upload>
              </Col>
              <Col span={16}>
                <Form.Item name="imageUrl">
                  <Input.TextArea
                    placeholder="Hoặc dán URL ảnh trực tiếp vào đây..."
                    style={{ height: 102 }}
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
