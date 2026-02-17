import { createContext } from 'react';

export interface ChatMessage {
    sender: string;
    senderId: string;
    recipientId?: string;
    content: string;
    type: 'CHAT' | 'JOIN' | 'LEAVE';
    email?: string;
    fullName?: string;
    isBotResponse?: boolean;
}

export interface ChatSession {
    id: string; // Sử dụng email làm ID
    name: string; // Hiển thị fullName
    lastMessage?: string;
    timestamp: number;
    senderId?: string; // Lưu senderId để gửi tin nhắn lại
    unreadCount?: number;
}

export interface AdminChatContextType {
    conversations: Record<string, ChatMessage[]>;
    sessions: ChatSession[];
    connected: boolean;
    addMessage: (clientKey: string, message: ChatMessage) => void;
    updateSession: (session: ChatSession) => void;
    sendMessage: (recipientId: string, content: string) => void;
    markSessionRead: (sessionId: string) => void;
    totalUnread: number;
}

export const AdminChatContext = createContext<AdminChatContextType | undefined>(undefined);
