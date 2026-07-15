import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { message as antdMessage } from "antd";
import { getBaseApiUrl, getWsUrl } from "../utils/url";
import { createChatMessageKey } from "../utils/chatMessage";
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

  const applyEditedMessage = (
    clientKey: string,
    messageKey: string,
    content: string,
    lastMessagePrefix = "",
    recalled = false,
  ) => {
    setConversations((prev) => {
      const list = prev[clientKey] || [];
      const next = list.map((m) =>
        m.messageKey === messageKey
          ? {
              ...m,
              content,
              edited: !recalled,
              recalled,
            }
          : m,
      );
      return { ...prev, [clientKey]: next };
    });
    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === clientKey);
      if (idx < 0) return prev;
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        lastMessage: lastMessagePrefix + content,
        timestamp: Date.now(),
      };
      return [updated[idx], ...updated.filter((_, i) => i !== idx)];
    });
  };

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
          client?.subscribe("/topic/admin", (msg) => {
            const receivedMsg: ChatMessage = JSON.parse(msg.body);

            if (
              (receivedMsg.type === "EDIT" || receivedMsg.type === "RECALL") &&
              receivedMsg.senderId === "system"
            ) {
              antdMessage.error(
                receivedMsg.content || "Không thể thao tác tin nhắn",
              );
              return;
            }

            if (
              (receivedMsg.type === "EDIT" || receivedMsg.type === "RECALL") &&
              receivedMsg.messageKey
            ) {
              const isRecall = receivedMsg.type === "RECALL";
              const recalledText =
                receivedMsg.content || "Tin nhắn đã được thu hồi";

              setConversations((prev) => {
                // Ưu tiên tìm hội thoại chứa đúng messageKey (tránh lệch email vs user-id)
                let targetKey =
                  Object.keys(prev).find((k) =>
                    prev[k]?.some(
                      (m) =>
                        String(m.messageKey) ===
                        String(receivedMsg.messageKey),
                    ),
                  ) || "";

                if (!targetKey) {
                  targetKey =
                    receivedMsg.email ||
                    (receivedMsg.senderId === "admin"
                      ? receivedMsg.recipientId
                      : receivedMsg.senderId) ||
                    "";
                }

                if (!targetKey || targetKey === "admin") {
                  return prev;
                }

                const list = prev[targetKey] || [];
                let found = false;
                const next = list.map((m) => {
                  if (String(m.messageKey) !== String(receivedMsg.messageKey)) {
                    return m;
                  }
                  found = true;
                  return {
                    ...m,
                    content: isRecall ? recalledText : receivedMsg.content,
                    edited: isRecall ? false : true,
                    recalled: isRecall ? true : Boolean(m.recalled),
                  };
                });

                // Không tìm thấy tin → không tạo conversation rỗng
                if (!found && list.length === 0) {
                  return prev;
                }
                if (!found) {
                  return prev;
                }

                setSessions((sessPrev) => {
                  const idx = sessPrev.findIndex((s) => s.id === targetKey);
                  if (idx < 0) return sessPrev;
                  const copy = [...sessPrev];
                  const prefix =
                    receivedMsg.senderId === "admin" ? "Bạn: " : "";
                  copy[idx] = {
                    ...copy[idx],
                    lastMessage:
                      prefix + (isRecall ? recalledText : receivedMsg.content),
                    timestamp: Date.now(),
                  };
                  return [copy[idx], ...copy.filter((_, i) => i !== idx)];
                });

                return { ...prev, [targetKey]: next };
              });
              return;
            }

            const clientKey = receivedMsg.email || receivedMsg.senderId;
            const clientName = receivedMsg.fullName || receivedMsg.sender;

            if (!clientKey || clientKey === "undefined" || clientKey === "null")
              return;

            if (receivedMsg.type === "TYPING") {
              if (receivedMsg.senderId === "admin") return;

              setTypingSessions((prev) => ({ ...prev, [clientKey]: true }));

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

            if (typingTimeoutRefs.current[clientKey]) {
              clearTimeout(typingTimeoutRefs.current[clientKey]);
            }
            setTypingSessions((prev) => ({ ...prev, [clientKey]: false }));

            const incoming: ChatMessage = {
              ...receivedMsg,
              createdAt: receivedMsg.createdAt || Date.now(),
              messageKey: receivedMsg.messageKey || createChatMessageKey(),
            };

            setSessions((prev) => {
              const existingIdx = prev.findIndex((s) => s.id === clientKey);
              if (existingIdx > -1) {
                const oldSession = prev[existingIdx];
                const updatedSession: ChatSession = {
                  ...oldSession,
                  lastMessage: incoming.content,
                  timestamp: Date.now(),
                  unreadCount: (oldSession.unreadCount || 0) + 1,
                };
                const updated = [...prev];
                updated[existingIdx] = updatedSession;
                return [
                  updatedSession,
                  ...updated.filter((_, i) => i !== existingIdx),
                ];
              }
              const newSession: ChatSession = {
                id: clientKey,
                name: clientName,
                senderId: receivedMsg.senderId,
                lastMessage: incoming.content,
                timestamp: Date.now(),
                unreadCount: 1,
              };
              return [newSession, ...prev];
            });

            setConversations((prev) => ({
              ...prev,
              [clientKey]: [...(prev[clientKey] || []), incoming],
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

  const resolveClientWsId = (
    recipientId: string,
    conversationKey?: string,
  ): string => {
    const session = sessions.find(
      (s) => s.senderId === recipientId || s.id === recipientId,
    );
    if (session?.senderId && session.senderId !== "admin") {
      return session.senderId;
    }
    const key = conversationKey || session?.id || recipientId;
    const msgs = conversations[key] || [];
    const fromClient = msgs.find(
      (m) => m.senderId && m.senderId !== "admin" && m.senderId !== "system",
    );
    if (fromClient?.senderId) return fromClient.senderId;
    return recipientId;
  };

  const sendMessage = (recipientId: string, content: string) => {
    if (stompClientRef.current && connected) {
      const messageKey = createChatMessageKey();
      const createdAt = Date.now();

      let conversationKey = recipientId;
      const targetSession = sessions.find(
        (s) => s.senderId === recipientId || s.id === recipientId,
      );
      if (targetSession) {
        conversationKey = targetSession.id;
      }

      const wsRecipientId = resolveClientWsId(recipientId, conversationKey);
      const chatMessage: ChatMessage = {
        messageKey,
        sender: "Admin/Tư vấn viên",
        senderId: "admin",
        recipientId: wsRecipientId,
        content: content,
        type: "CHAT",
        createdAt,
        edited: false,
        // Lưu email = session id nếu là email, giúp tra cứu sau này
        email:
          conversationKey.includes("@") ? conversationKey : undefined,
        fullName: targetSession?.name,
      };

      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage),
      });

      setConversations((prev) => ({
        ...prev,
        [conversationKey]: [...(prev[conversationKey] || []), chatMessage],
      }));

      setSessions((prev) => {
        const idx = prev.findIndex((s) => s.id === conversationKey);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            senderId: updated[idx].senderId || wsRecipientId,
            lastMessage: `Bạn: ${content}`,
            timestamp: Date.now(),
          };
          return [updated[idx], ...updated.filter((_, i) => i !== idx)];
        }
        return prev;
      });
    }
  };

  const editMessage = (
    recipientId: string,
    messageKey: string,
    content: string,
  ) => {
    if (!stompClientRef.current?.connected) {
      antdMessage.error("Chưa kết nối máy chủ chat");
      return;
    }
    const trimmed = content.trim();
    if (!trimmed) return;

    let conversationKey = recipientId;
    const targetSession = sessions.find(
      (s) => s.senderId === recipientId || s.id === recipientId,
    );
    if (targetSession) conversationKey = targetSession.id;
    const wsRecipientId = resolveClientWsId(recipientId, conversationKey);

    stompClientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({
        type: "EDIT",
        messageKey,
        content: trimmed,
        sender: "Admin/Tư vấn viên",
        senderId: "admin",
        recipientId: wsRecipientId,
        email: conversationKey.includes("@") ? conversationKey : undefined,
      }),
    });

    applyEditedMessage(conversationKey, messageKey, trimmed, "Bạn: ");
  };

  const recallMessage = (recipientId: string, messageKey: string) => {
    if (!stompClientRef.current?.connected) {
      antdMessage.error("Chưa kết nối máy chủ chat");
      return;
    }

    let conversationKey = recipientId;
    const targetSession = sessions.find(
      (s) => s.senderId === recipientId || s.id === recipientId,
    );
    if (targetSession) conversationKey = targetSession.id;
    const wsRecipientId = resolveClientWsId(recipientId, conversationKey);

    stompClientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({
        type: "RECALL",
        messageKey,
        content: "Tin nhắn đã được thu hồi",
        sender: "Admin/Tư vấn viên",
        senderId: "admin",
        recipientId: wsRecipientId,
        email: conversationKey.includes("@") ? conversationKey : undefined,
      }),
    });

    applyEditedMessage(
      conversationKey,
      messageKey,
      "Tin nhắn đã được thu hồi",
      "Bạn: ",
      true,
    );
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
          [clientKey]: history.map((m) => ({
            ...m,
            createdAt: m.createdAt || Date.now(),
            messageKey: m.messageKey || createChatMessageKey(),
          })),
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
        editMessage,
        recallMessage,
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
