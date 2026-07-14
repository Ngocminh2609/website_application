import React from "react";
import { Card, Typography, Form, Input, List, Tag, Badge } from "antd";
import {
  NotificationOutlined,
  SendOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import BaseButton from "../../components/common/BaseButton";
import { useNotificationManagementState } from "../../hooks/Admin/useNotificationManagementState";
import { styles } from "./styles/notification-management.styles";
import { NOTIF_STRINGS } from "../../constants/Admin/notification-management";

import { formatDateTime } from "./helper";

const { Title, Text } = Typography;

/**
 * Quản lý thông báo hệ thống (Admin)
 * Cho phép Admin tạo thông báo và gửi cho tất cả người dùng (Broadcast)
 */
const NotificationManagement: React.FC = () => {
  const { loading, form, history, handleBroadcast } =
    useNotificationManagementState();

  return (
    <div style={styles.container}>
      <Title
        level={4}
        style={styles.headerTitle}
      >
        <NotificationOutlined style={styles.headerIcon} />
        {NOTIF_STRINGS.headerTitle}
      </Title>

      <Card className="glass-effect" style={styles.formCard}>
        <Form form={form} layout="vertical" onFinish={handleBroadcast}>
          <Form.Item
            name="message"
            label={
              <span style={styles.formLabel}>
                {NOTIF_STRINGS.form.messageLabel}
              </span>
            }
            rules={[
              { required: true, message: NOTIF_STRINGS.form.messageRequired },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder={NOTIF_STRINGS.form.messagePlaceholder}
            />
          </Form.Item>
          <Form.Item style={styles.formItemNoMargin}>
            <BaseButton
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SendOutlined />}
              style={styles.submitButton}
            >
              {NOTIF_STRINGS.form.submitBtn}
            </BaseButton>
          </Form.Item>
        </Form>
      </Card>

      <Title
        level={4}
        style={styles.headerTitle}
      >
        <HistoryOutlined style={styles.headerIcon} />
        {NOTIF_STRINGS.historyTitle}
      </Title>

      <List
        dataSource={history}
        renderItem={(item) => (
          <Card
            size="small"
            className="glass-effect"
            style={styles.historyCard}
          >
            <div style={styles.historyCardContent}>
              <div style={{ flex: 1 }}>
                <Badge
                  status="processing"
                  text={
                    <Text strong style={styles.historyMessage}>
                      {item.message}
                    </Text>
                  }
                />
                <div style={styles.historyTimeWrapper}>
                  <Text style={styles.historyTime}>
                    {formatDateTime(item.createdAt)}
                  </Text>
                </div>
              </div>
              <Tag color="blue">{item.recipientCount}</Tag>
            </div>
          </Card>
        )}
        locale={{
          emptyText: (
            <Text style={styles.emptyText}>
              {NOTIF_STRINGS.emptyHistory}
            </Text>
          ),
        }}
      />
    </div>
  );
};

export default NotificationManagement;
