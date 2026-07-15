/** Cửa sổ được phép sửa tin nhắn: 24 giờ (ms). */
export const CHAT_EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export function createChatMessageKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Tin nhắn còn trong hạn 24h kể từ createdAt (epoch ms). */
export function canEditChatMessage(
  createdAt: number | undefined | null,
  now = Date.now(),
): boolean {
  if (createdAt == null || !Number.isFinite(createdAt)) return false;
  return now - createdAt < CHAT_EDIT_WINDOW_MS;
}
