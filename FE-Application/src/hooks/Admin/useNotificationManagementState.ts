import {useState} from "react";
import {Form} from "antd";
import {notificationApi} from "../../api/notificationApi";
import {NOTIF_STRINGS} from "../../constants/Admin/notification-management";
import {useAsyncAction} from "../common/useAsyncAction";

export interface NotificationHistoryItem {
    id: number;
    message: string;
    type: string;
    createdAt: string;
    recipientCount: string;
}

export const useNotificationManagementState = () => {
    const [form] = Form.useForm();
    const [history, setHistory] = useState<NotificationHistoryItem[]>([]);
    const {loading, run} = useAsyncAction();

    const handleBroadcast = async (values: { message: string }) => {
        await run(
            () => notificationApi.broadcast(values.message),
            {
                successMessage: NOTIF_STRINGS.messages.sendSuccess,
                errorMessage: NOTIF_STRINGS.messages.sendError,
                onSuccess: () => {
                    form.resetFields();
                    const newLog: NotificationHistoryItem = {
                        id: Date.now(),
                        message: values.message,
                        type: "SYSTEM",
                        createdAt: new Date().toISOString(),
                        recipientCount: NOTIF_STRINGS.recipientCountText,
                    };
                    setHistory((prev) => [newLog, ...prev]);
                },
            },
        );
    };

    return {
        loading,
        form,
        history,
        handleBroadcast,
    };
};
