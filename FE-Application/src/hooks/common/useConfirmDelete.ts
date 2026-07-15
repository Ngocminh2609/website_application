import { Modal } from "antd";
import { notification } from "../../utils/notification";
import { getErrorMessage } from "../../utils/error";

interface ConfirmDeleteOptions {
  title: string;
  content: string;
  onDelete: () => Promise<void>;
  successMessage: string;
  errorMessage: string;
  onSuccess?: () => void | Promise<void>;
}

/**
 * Hiển thị Modal.confirm rồi gọi API xóa + toast + callback refetch.
 */
export const confirmDelete = ({
  title,
  content,
  onDelete,
  successMessage,
  errorMessage,
  onSuccess,
}: ConfirmDeleteOptions): void => {
  Modal.confirm({
    title,
    content,
    okType: "danger",
    onOk: async () => {
      try {
        await onDelete();
        notification.success(successMessage);
        await onSuccess?.();
      } catch (error: unknown) {
        notification.error(getErrorMessage(error, errorMessage));
      }
    },
  });
};
