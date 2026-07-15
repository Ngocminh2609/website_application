import { createContext } from "react";

export interface ChatMessage {
  id?: number;
  /** UUID ổn định — dùng để sửa / đồng bộ */
  messageKey?: string;
  sender: string;
  senderId: string;
  recipientId?: string;
  content: string;
  type: "CHAT" | "JOIN" | "LEAVE" | "TYPING" | "EDIT" | "RECALL";
  email?: string;
  fullName?: string;
  isBotResponse?: boolean;
  /** Epoch millis */
  createdAt?: number;
  edited?: boolean;
  recalled?: boolean;
}

export interface ChatSession {
  id: string;
  name: string;
  lastMessage?: string;
  timestamp: number;
  senderId?: string;
  unreadCount?: number;
}

export interface AdminChatContextType {
  conversations: Record<string, ChatMessage[]>;
  sessions: ChatSession[];
  typingSessions: Record<string, boolean>;
  connected: boolean;
  addMessage: (clientKey: string, message: ChatMessage) => void;
  updateSession: (session: ChatSession) => void;
  sendMessage: (recipientId: string, content: string) => void;
  editMessage: (
    recipientId: string,
    messageKey: string,
    content: string,
  ) => void;
  recallMessage: (recipientId: string, messageKey: string) => void;
  sendTypingStatus: (recipientId: string) => void;
  markSessionRead: (sessionId: string) => void;
  loadChatHistory: (clientKey: string) => Promise<void>;
  totalUnread: number;
}

export const AdminChatContext = createContext<AdminChatContextType | undefined>(
  undefined,
);
