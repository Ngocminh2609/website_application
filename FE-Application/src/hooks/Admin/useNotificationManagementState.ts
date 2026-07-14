import { useState } from "react";
import { Form } from "antd";
import { getBaseApiUrl } from "../../utils/url";
import { notification } from "../../utils/notification";
import { NOTIF_STRINGS } from "../../constants/Admin/notification-management";

export interface NotificationHistoryItem {
  id: number;
  message: string;
  type: string;
  createdAt: string;
  recipientCount: string;
}

export const useNotificationManagementState = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);

  const handleBroadcast = async (values: { message: string }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = getBaseApiUrl();
      const response = await fetch(`${baseUrl}/notifications/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        notification.success(NOTIF_STRINGS.messages.sendSuccess);
        form.resetFields();
        const newLog: NotificationHistoryItem = {
          id: Date.now(),
          message: values.message,
          type: "SYSTEM",
          createdAt: new Date().toISOString(),
          recipientCount: NOTIF_STRINGS.recipientCountText,
        };
        setHistory((prev) => [newLog, ...prev]);
      } else {
        notification.error(NOTIF_STRINGS.messages.sendError);
      }
    } catch (error) {
      console.error("Lỗi gửi thông báo:", error);
      notification.error(NOTIF_STRINGS.messages.connectionError);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    history,
    handleBroadcast,
  };
};
