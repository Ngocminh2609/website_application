import { apiClient } from "./apiClient";

/**
 * API thông báo hệ thống (admin broadcast).
 */
export const notificationApi = {
  broadcast: (message: string): Promise<void> =>
    apiClient.fetch<void>("/notifications/broadcast", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
