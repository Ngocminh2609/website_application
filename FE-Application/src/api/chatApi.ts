import { getBaseApiUrl } from "../utils/url";

export interface ChatAiResponse {
  reply: string;
  escalate: boolean;
  /** Bot chủ động chuyển tư vấn viên — FE phải gửi tin qua WebSocket tới admin */
  handoff?: boolean;
  error?: string | null;
}

const BASE_PATH = "/chat";

/**
 * Gọi NovaBot AI — endpoint public (guest không cần JWT).
 * Dùng fetch trực tiếp để tránh apiClient redirect login khi không có token.
 */
export const chatApi = {
  askBot: async (message: string): Promise<ChatAiResponse> => {
    const response = await fetch(`${getBaseApiUrl()}${BASE_PATH}/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        (errorData as { message?: string }).message ||
          `Lỗi hệ thống (${response.status})`,
      );
    }

    return response.json();
  },
};
