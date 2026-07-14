import type { NOTIFICATION_TYPES } from "../components/common/Commons";

export interface Notification {
  id: number;
  message: string;
  type:
    | typeof NOTIFICATION_TYPES.MESSAGE
    | typeof NOTIFICATION_TYPES.ORDER
    | typeof NOTIFICATION_TYPES.SYSTEM;
  isRead: boolean;
  createdAt: string;
}
