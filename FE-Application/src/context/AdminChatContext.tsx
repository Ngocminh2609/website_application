import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getBaseApiUrl, getWsUrl } from "../utils/url";
import {
  AdminChatContext,
  type ChatMessage,
  type ChatSession,
} from "./AdminChatContextDefinition";

/**
 * Provider để quản lý tin nhắn admin toàn cục.
 * Lắng nghe WebSocket ngay cả khi admin chưa mở màn Chat Tư Vấn.
 */
export const AdminChatProvider: React.FC<{
  children: React.ReactNode;
  isAdmin: boolean;
}> = ({ children, isAdmin }) => {
  const [conversations, setConversations] = useState<
    Record<string, ChatMessage[]>
  >(() => {
    const saved = localStorage.getItem("admin_conversations");
    return saved ? JSON.parse(saved) : {};
  });

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("admin_chat_sessions");
    let parsedSessions: ChatSession[] = saved ? JSON.parse(saved) : [];

    // Lọc bỏ session rác ngay khi load
    parsedSessions = parsedSessions.filter(
      (s) =>
        s.id &&
        s.id !== "undefined" &&
        s.id !== "null" &&
        !s.id.includes("admin") &&
        s.name !== "Admin",
    );
    return parsedSessions;
  });

  const [typingSessions, setTypingSessions] = useState<Record<string, boolean>>(
    {},
  );
  const typingTimeoutRefs = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  // Lưu vào localStorage khi có thay đổi
  useEffect(() => {
    if (Object.keys(conversations).length > 0) {
      localStorage.setItem(
        "admin_conversations",
        JSON.stringify(conversations),
      );
    }
  }, [conversations]);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("admin_chat_sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Kết nối WebSocket nếu là admin
  useEffect(() => {
    if (!isAdmin) return;

    let client: Client | null = null;
    try {
      const url = getWsUrl();
      const isUnsafe =
        window.location.protocol === "https:" && url.startsWith("http:");

      client = new Client({
        webSocketFactory: () => {
          if (isUnsafe) {
            return new WebSocket("wss://localhost:0");
          }
          return new SockJS(url);
        },
        onConnect: () => {
          setConnected(true);
          // ... subscribe logic ...
          client?.subscribe("/topic/admin", (msg) => {
            const receivedMsg: ChatMessage = JSON.parse(msg.body);
            const clientKey = receivedMsg.email || receivedMsg.senderId;
            const clientName = receivedMsg.fullName || receivedMsg.sender;

            if (!clientKey || clientKey === "undefined" || clientKey === "null")
              return;

            // Xử lý trạng thái TYPING từ client
            if (receivedMsg.type === "TYPING") {
              if (receivedMsg.senderId === "admin") return;

              setTypingSessions((prev) => ({ ...prev, [clientKey]: true }));

              // Tự động tắt trạng thái sau 3 giây nếu không nhận được tin nhắn typing tiếp theo
              if (typingTimeoutRefs.current[clientKey]) {
                clearTimeout(typingTimeoutRefs.current[clientKey]);
              }
              typingTimeoutRefs.current[clientKey] = setTimeout(() => {
                setTypingSessions((prev) => ({ ...prev, [clientKey]: false }));
              }, 3000);
              return;
            }

            if (receivedMsg.type !== "CHAT") return;
            if (receivedMsg.senderId === "admin") return;

            // Khi nhận được tin nhắn CHAT, tắt trạng thái typing ngay lập tức
            if (typingTimeoutRefs.current[clientKey]) {
              clearTimeout(typingTimeoutRefs.current[clientKey]);
            }
            setTypingSessions((prev) => ({ ...prev, [clientKey]: false }));

            setSessions((prev) => {
              const existingIdx = prev.findIndex((s) => s.id === clientKey);
              if (existingIdx > -1) {
                const oldSession = prev[existingIdx];
                const updatedSession: ChatSession = {
                  ...oldSession,
                  lastMessage: receivedMsg.content,
                  timestamp: Date.now(),
                  unreadCount: (oldSession.unreadCount || 0) + 1,
                };
                const updated = [...prev];
                updated[existingIdx] = updatedSession;
                return [
                  updatedSession,
                  ...updated.filter((_, i) => i !== existingIdx),
                ];
              } else {
                const newSession: ChatSession = {
                  id: clientKey,
                  name: clientName,
                  senderId: receivedMsg.senderId,
                  lastMessage: receivedMsg.content,
                  timestamp: Date.now(),
                  unreadCount: 1,
                };
                return [newSession, ...prev];
              }
            });

            setConversations((prev) => ({
              ...prev,
              [clientKey]: [...(prev[clientKey] || []), receivedMsg],
            }));
          });

          client?.publish({
            destination: "/app/chat.addUser",
            body: JSON.stringify({
              sender: "Admin",
              senderId: "admin",
              type: "JOIN",
            }),
          });
        },
        onDisconnect: () => setConnected(false),
        reconnectDelay: 5000,
      });

      if (!isUnsafe) {
        client.activate();
        stompClientRef.current = client;
      }
    } catch (error) {
      console.error("Không thể kích hoạt WebSocket Admin Chat:", error);
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [isAdmin]);

  const addMessage = (clientKey: string, message: ChatMessage) => {
    setConversations((prev) => ({
      ...prev,
      [clientKey]: [...(prev[clientKey] || []), message],
    }));
  };

  const updateSession = (session: ChatSession) => {
    setSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === session.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = session;
        return [
          updated[existingIdx],
          ...updated.filter((_, i) => i !== existingIdx),
        ];
      }
      return [session, ...prev];
    });
  };

  const sendMessage = (recipientId: string, content: string) => {
    if (stompClientRef.current && connected) {
      const chatMessage: ChatMessage = {
        sender: "Admin/Tư vấn viên",
        senderId: "admin",
        recipientId: recipientId,
        content: content,
        type: "CHAT",
      };

      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage),
      });

      // Cập nhật UI ngay lập tức (Vì listener đang chặn tin nhắn senderId='admin')
      // 1. Tìm key hội thoại (ưu tiên ID của session, thường là email)
      let conversationKey = recipientId;
      const targetSession = sessions.find(
        (s) => s.senderId === recipientId || s.id === recipientId,
      );
      if (targetSession) {
        conversationKey = targetSession.id;
      }

      // 2. Thêm tin nhắn vào cuộc hội thoại
      setConversations((prev) => ({
        ...prev,
        [conversationKey]: [...(prev[conversationKey] || []), chatMessage],
      }));

      // 3. Cập nhật last message trong danh sách session
      setSessions((prev) => {
        const idx = prev.findIndex((s) => s.id === conversationKey);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            lastMessage: `Bạn: ${content}`,
            timestamp: Date.now(),
          };
          // Đưa lên đầu danh sách
          return [updated[idx], ...updated.filter((_, i) => i !== idx)];
        }
        return prev;
      });
    }
  };

  const markSessionRead = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, unreadCount: 0 } : s)),
    );
  };

  const sendTypingStatus = (recipientId: string) => {
    if (stompClientRef.current && connected) {
      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify({
          sender: "Admin",
          senderId: "admin",
          recipientId: recipientId,
          content: "typing...",
          type: "TYPING",
        }),
      });
    }
  };

  const loadChatHistory = async (clientKey: string) => {
    try {
      const baseUrl = getBaseApiUrl();
      const response = await fetch(`${baseUrl}/chat/history/${clientKey}`);
      if (response.ok) {
        const history: ChatMessage[] = await response.json();
        setConversations((prev) => ({
          ...prev,
          [clientKey]: history,
        }));
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử chat:", error);
    }
  };

  const totalUnread = sessions.reduce(
    (total, session) => total + (session.unreadCount || 0),
    0,
  );

  return (
    <AdminChatContext.Provider
      value={{
        conversations,
        sessions,
        typingSessions,
        connected,
        addMessage,
        updateSession,
        sendMessage,
        sendTypingStatus,
        markSessionRead,
        loadChatHistory,
        totalUnread,
      }}
    >
      {children}
    </AdminChatContext.Provider>
  );
};
