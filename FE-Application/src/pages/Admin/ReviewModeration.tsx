import React from "react";
import {
  Table,
  Rate,
  Avatar,
  Space,
  Typography,
  Tag,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import type { ProductReview } from "../../types/coupon-review";
import BaseButton from "../../components/common/BaseButton";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { useReviewModerationState } from "../../hooks/Admin/useReviewModerationState";
import { styles } from "./styles/review-moderation.styles";
import { REVIEW_STRINGS } from "../../constants/Admin/review-moderation";

const { Text } = Typography;

const ReviewModeration: React.FC = () => {
  const { reviews, loading, handleApprove, handleDelete } =
    useReviewModerationState();

  const columns: ColumnsType<ProductReview> = [
    {
      title: REVIEW_STRINGS.table.customer,
      key: "user",
      render: (_, record: ProductReview) => (
        <Space>
          <Avatar
            src={record.user.avatarUrl}
            icon={<UserOutlined />}
            style={styles.avatar}
          />
          <div>
            <Text strong style={styles.fullName}>
              {record.user.fullName || record.user.username}
            </Text>
            <Text style={styles.createdAt}>
              {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: REVIEW_STRINGS.table.reviewFor,
      key: "product",
      render: (_, record: ProductReview) => (
        <Space>
          <ShopOutlined style={styles.shopIcon} />
          <Text style={styles.productId}>ID: #{record.product?.id || "?"}</Text>
        </Space>
      ),
    },
    {
      title: REVIEW_STRINGS.table.content,
      key: "content",
      width: "35%",
      render: (_, record: ProductReview) => (
        <div>
          <Rate
            disabled
            defaultValue={record.rating}
            style={styles.rate}
          />
          <div style={styles.comment}>
            {record.comment}
          </div>
          <Space style={styles.tagSpace}>
            {record.isVerifiedPurchase && (
              <Tag color="green" style={styles.tag}>
                {REVIEW_STRINGS.table.verifiedPurchase}
              </Tag>
            )}
            {!record.isApproved && (
              <Tag color="warning" style={styles.tag}>
                {REVIEW_STRINGS.table.pendingApproval}
              </Tag>
            )}
          </Space>
        </div>
      ),
    },
    {
      title: REVIEW_STRINGS.table.status,
      key: "status",
      render: (_, record: ProductReview) =>
        record.isApproved ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {REVIEW_STRINGS.table.approved}
          </Tag>
        ) : (
          <Tag color="default">{REVIEW_STRINGS.table.hidden}</Tag>
        ),
    },
    {
      title: REVIEW_STRINGS.table.actions,
      key: "action",
      align: "right",
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
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          {REVIEW_STRINGS.headerTitle}
        </h3>
        <p style={styles.subtitle}>
          {REVIEW_STRINGS.headerSubtitle}
        </p>
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
