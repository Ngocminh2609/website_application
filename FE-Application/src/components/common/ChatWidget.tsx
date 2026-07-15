import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, Button, Badge, Space, message as antdMessage } from "antd";
import {
  SendOutlined,
  CloseOutlined,
  MessageOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getWsUrl } from "../../utils/url";
import type { User } from "../../types/auth";
import { styles } from "./styles/ChatWidget.styles";
import { COMMON_STRINGS } from "../../constants/Common/common";
import { getAuthUser } from "../../utils/auth";
import { chatApi } from "../../api/chatApi";
import {
  canEditChatMessage,
  createChatMessageKey,
} from "../../utils/chatMessage";
import ChatMessageMenu from "./ChatMessageMenu";

const { chatWidget: cwStrings } = COMMON_STRINGS;

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user" | "admin";
  timestamp: number;
  edited?: boolean;
  recalled?: boolean;
  /** Đã gửi lên server (có thể sửa trong 24h) */
  persisted?: boolean;
}

const DEFAULT_QUESTIONS = cwStrings.defaultQuestions;

const AnimatedRobot = () => (
  <svg viewBox="0 0 100 100" className="robot-canvas">
    <rect x="20" y="35" width="60" height="50" rx="10" className="robot-head" />
    <rect x="35" y="45" width="10" height="10" rx="2" className="robot-eye" />
    <rect x="55" y="45" width="10" height="10" rx="2" className="robot-eye" />
    <path
      d="M40 70 Q50 75 60 70"
      stroke="white"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="50" cy="25" r="5" fill="#6366f1" />
    <line x1="50" y1="25" x2="50" y2="35" stroke="#6366f1" strokeWidth="2" />
  </svg>
);

const INITIAL_MESSAGE: Message = {
  id: "init",
  text: cwStrings.initialMessage,
  sender: "bot",
  timestamp: 0,
};

const createMessageObject = (
  text: string,
  sender: "user" | "bot" | "admin",
  extras?: Partial<Message>,
): Message => {
  const timestamp = Date.now();
  return {
    id: extras?.id || createChatMessageKey(),
    text,
    sender,
    timestamp,
    edited: extras?.edited,
    recalled: extras?.recalled,
    persisted: extras?.persisted,
  };
};

interface ChatWidgetProps {
  user?: User | null;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const lastTypingTime = useRef<number>(0);
  const adminTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isOpenRef = useRef(false);

  // 1. Init Session (Support Props & LocalStorage Fallback)
  const [chatSession] = useState(() => {
    try {
      const userData = user || getAuthUser();

      if (userData) {
        return {
          id: `user-${userData.id}`,
          name: userData.fullName,
          email: userData.email,
          fullName: userData.fullName,
        };
      }
    } catch (e) {
      console.error("Error parsing user data", e);
    }

    let gId = localStorage.getItem("guest_chat_id");
    let gName = localStorage.getItem("guest_chat_name");

    if (!gId || !gName) {
      gId = `guest-${Math.random().toString(36).slice(2, 7)}`;
      gName = `${cwStrings.guestDefaultName} ${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem("guest_chat_id", gId);
      localStorage.setItem("guest_chat_name", gName);
    }

    return {
      id: gId || "guest",
      name: gName || cwStrings.guestDefaultName,
      email: null,
      fullName: gName || cwStrings.guestDefaultName,
    };
  });

  const [isAdminActive, setIsAdminActive] = useState(() => {
    try {
      const lastAdminTime = localStorage.getItem(
        `last_admin_time_${chatSession?.id}`,
      );
      if (!lastAdminTime) return false;
      const diff = Date.now() - Number(lastAdminTime);
      return diff < 3600000;
    } catch {
      return false;
    }
  });

  /** Đã xin gặp tư vấn viên — gửi tin qua WS, không gọi bot nữa cho đến khi admin trả lời */
  const [handoffPending, setHandoffPending] = useState(() => {
    try {
      return localStorage.getItem(`chat_handoff_${chatSession.id}`) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      `chat_handoff_${chatSession.id}`,
      handoffPending ? "1" : "0",
    );
  }, [handoffPending, chatSession.id]);

  // 2. Init Messages (Load History)
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(`chat_history_${chatSession.id}`);
      return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
    } catch (err) {
      console.error("Error loading chat history", err);
      return [INITIAL_MESSAGE];
    }
  });

  // 3. Persist messages when changed & Check Admin Inactivity
  useEffect(() => {
    localStorage.setItem(
      `chat_history_${chatSession.id}`,
      JSON.stringify(messages),
    );
  }, [messages, chatSession.id]);

  useEffect(() => {
    const checkInactivity = () => {
      const lastAdminTime = localStorage.getItem(
        `last_admin_time_${chatSession.id}`,
      );
      if (lastAdminTime && isAdminActive) {
        const diff = Date.now() - parseInt(lastAdminTime);
        if (diff >= 3600000) {
          setIsAdminActive(false);
        }
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isAdminActive, chatSession.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Giữ sync ref để handler WS biết chat đang mở hay đóng
  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const publishChatMessage = useCallback(
    (
      text: string,
      type: "CHAT" | "TYPING" | "EDIT" | "RECALL" = "CHAT",
      messageKey?: string,
    ) => {
      const key = messageKey || createChatMessageKey();
      const tryPublish = (attempt = 0) => {
        if (stompClientRef.current?.connected) {
          stompClientRef.current.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify({
              messageKey: type === "TYPING" ? undefined : key,
              sender: chatSession.name,
              senderId: chatSession.id,
              email: chatSession.email,
              fullName: chatSession.fullName,
              content: text,
              type,
              isBotResponse: false,
              createdAt: Date.now(),
            }),
          });
          return;
        }
        if (attempt < 8) {
          setTimeout(() => tryPublish(attempt + 1), 250);
        } else {
          console.warn("Không gửi được tin tới admin: WebSocket chưa kết nối");
        }
      };
      tryPublish();
      return key;
    },
    [chatSession],
  );

  const markPersisted = useCallback((messageKey: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageKey ? { ...m, persisted: true } : m,
      ),
    );
  }, []);

  const activateHandoff = useCallback(
    (userText: string, messageKey: string) => {
      setHandoffPending(true);
      publishChatMessage(userText, "CHAT", messageKey);
      markPersisted(messageKey);
    },
    [publishChatMessage, markPersisted],
  );

  const requestBotReply = useCallback(
    async (userText: string, messageKey: string) => {
      if (isAdminActive) return;

      setIsTyping(true);
      try {
        const { reply, escalate, handoff, error } =
          await chatApi.askBot(userText);
        const shouldHandoff = Boolean(handoff || escalate);

        if (shouldHandoff) {
          if (escalate) console.warn("NovaBot escalate:", error);
          activateHandoff(userText, messageKey);
        }

        const botMsg = createMessageObject(
          reply ||
            (shouldHandoff
              ? cwStrings.handoffWaitingResponse
              : cwStrings.botFallbackResponse),
          "bot",
        );
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error("NovaBot AI error:", err);
        activateHandoff(userText, messageKey);
        const botMsg = createMessageObject(
          cwStrings.botFallbackResponse,
          "bot",
        );
        setMessages((prev) => [...prev, botMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [isAdminActive, activateHandoff],
  );

  const handleSend = (text: string, sender: "user" | "bot" = "user") => {
    if (!text.trim()) return;

    const newMessage = createMessageObject(text, sender);
    setMessages((prev) => [...prev, newMessage]);

    if (sender === "user") {
      setInputValue("");

      if (isAdminActive || handoffPending) {
        publishChatMessage(text, "CHAT", newMessage.id);
        markPersisted(newMessage.id);
      } else {
        void requestBotReply(text, newMessage.id);
      }
    }
  };

  const startEdit = (msg: Message) => {
    if (msg.sender !== "user" || !msg.persisted || msg.recalled) return;
    if (!canEditChatMessage(msg.timestamp)) {
      antdMessage.warning(cwStrings.editExpired);
      return;
    }
    setEditingId(msg.id);
    setEditingValue(msg.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const saveEdit = () => {
    if (!editingId || !editingValue.trim()) return;
    const trimmed = editingValue.trim();
    publishChatMessage(trimmed, "EDIT", editingId);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === editingId ? { ...m, text: trimmed, edited: true } : m,
      ),
    );
    cancelEdit();
  };

  const recallMessage = (messageKey: string) => {
    publishChatMessage("", "RECALL", messageKey);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageKey
          ? {
              ...m,
              text: cwStrings.recalledLabel,
              recalled: true,
              edited: false,
            }
          : m,
      ),
    );
    if (editingId === messageKey) cancelEdit();
  };

  // Giữ WebSocket luôn kết nối (kể cả khi đóng cửa sổ chat)
  useEffect(() => {
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
          client?.subscribe(`/topic/user/${chatSession.id}`, (msg) => {
            const receivedMsg = JSON.parse(msg.body);

            if (receivedMsg.type === "TYPING") {
              setIsAdminTyping(true);
              if (adminTypingTimeoutRef.current)
                clearTimeout(adminTypingTimeoutRef.current);
              adminTypingTimeoutRef.current = setTimeout(() => {
                setIsAdminTyping(false);
              }, 3000);
              return;
            }

            if (
              (receivedMsg.type === "EDIT" || receivedMsg.type === "RECALL") &&
              receivedMsg.senderId === "system"
            ) {
              antdMessage.error(receivedMsg.content || cwStrings.editFailed);
              return;
            }

            if (
              (receivedMsg.type === "EDIT" || receivedMsg.type === "RECALL") &&
              receivedMsg.messageKey
            ) {
              const isRecall = receivedMsg.type === "RECALL";
              setMessages((prev) => {
                const key = String(receivedMsg.messageKey);
                const exists = prev.some((m) => String(m.id) === key);
                if (exists) {
                  return prev.map((m) =>
                    String(m.id) === key
                      ? {
                          ...m,
                          text: isRecall
                            ? cwStrings.recalledLabel
                            : receivedMsg.content,
                          edited: isRecall ? false : true,
                          recalled: isRecall ? true : m.recalled,
                          sender:
                            receivedMsg.senderId === "admin"
                              ? ("admin" as const)
                              : m.sender,
                        }
                      : m,
                  );
                }
                if (receivedMsg.senderId === "admin") {
                  return [
                    ...prev,
                    createMessageObject(
                      isRecall
                        ? cwStrings.recalledLabel
                        : receivedMsg.content,
                      "admin",
                      {
                        id: key,
                        edited: !isRecall,
                        recalled: isRecall,
                        persisted: true,
                      },
                    ),
                  ];
                }
                return prev;
              });
              if (
                receivedMsg.senderId === "admin" &&
                !isOpenRef.current
              ) {
                setUnreadCount((c) => c + 1);
              }
              return;
            }

            if (receivedMsg.type === "CHAT") {
              setIsAdminActive(true);
              setHandoffPending(false);
              setIsAdminTyping(false);
              localStorage.setItem(
                `last_admin_time_${chatSession.id}`,
                Date.now().toString(),
              );
              if (adminTypingTimeoutRef.current)
                clearTimeout(adminTypingTimeoutRef.current);
              const newMsg = createMessageObject(
                receivedMsg.content,
                "admin",
                {
                  id: receivedMsg.messageKey || createChatMessageKey(),
                  persisted: true,
                },
              );
              setMessages((prev) => [...prev, newMsg]);
              if (!isOpenRef.current) {
                setUnreadCount((c) => c + 1);
              }
            }
          });

          client?.publish({
            destination: "/app/chat.addUser",
            body: JSON.stringify({
              sender: chatSession.name,
              senderId: chatSession.id,
              email: chatSession.email,
              fullName: chatSession.fullName,
              type: "JOIN",
            }),
          });
        },
        reconnectDelay: 5000,
      });

      if (!isUnsafe) {
        client.activate();
        stompClientRef.current = client;
      }
    } catch (error) {
      console.error("Không thể kích hoạt WebSocket Chat Widget:", error);
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [chatSession]);

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-window" style={styles.chatWindow}>
          <div className="chat-header">
            <AnimatedRobot />
            <div style={styles.headerTextContainer}>
              <div style={styles.title}>{cwStrings.title}</div>
              <div style={styles.statusText(isAdminActive || handoffPending)}>
                {isAdminActive
                  ? cwStrings.adminStatusActive
                  : handoffPending
                    ? cwStrings.adminStatusWaiting
                    : "ID: " + chatSession.name}
              </div>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined style={styles.closeBtnIcon} />}
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="chat-messages">
            {messages.map((msg) => {
              const isEditing = editingId === msg.id;
              const showMenu =
                msg.sender === "user" &&
                !!msg.persisted &&
                !msg.recalled &&
                canEditChatMessage(msg.timestamp) &&
                !isEditing;

              return (
                <div
                  key={msg.id}
                  className="chat-msg-row"
                  style={{
                    ...styles.messageOuter(msg.sender === "user"),
                    alignSelf:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "90%",
                  }}
                >
                  <div className={`message message-${msg.sender}`}>
                    {msg.sender === "admin" && (
                      <div style={styles.adminBadge}>{cwStrings.adminLabel}</div>
                    )}
                    {isEditing ? (
                      <div>
                        <Input.TextArea
                          autoSize={{ minRows: 1, maxRows: 4 }}
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onPressEnter={(e) => {
                            if (!e.shiftKey) {
                              e.preventDefault();
                              saveEdit();
                            }
                          }}
                        />
                        <Space size={4} style={{ marginTop: 6 }}>
                          <Button
                            size="small"
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={saveEdit}
                          >
                            {cwStrings.saveEditBtn}
                          </Button>
                          <Button size="small" onClick={cancelEdit}>
                            {cwStrings.cancelEditBtn}
                          </Button>
                        </Space>
                      </div>
                    ) : (
                      <>
                        <span
                          style={
                            msg.recalled
                              ? { fontStyle: "italic", opacity: 0.75 }
                              : undefined
                          }
                        >
                          {msg.recalled ? cwStrings.recalledLabel : msg.text}
                        </span>
                        {msg.edited && !msg.recalled && (
                          <div style={styles.messageMetaRow}>
                            <span style={styles.editedLabel}>
                              ({cwStrings.editedLabel})
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {showMenu && (
                    <ChatMessageMenu
                      onEdit={() => startEdit(msg)}
                      onRecall={() => recallMessage(msg.id)}
                    />
                  )}
                </div>
              );
            })}
            {isTyping && (
              <div
                className="message message-bot"
                style={styles.botTypingMessage}
              >
                {cwStrings.botTyping}
              </div>
            )}
            {isAdminTyping && (
              <div
                className={`message message-admin`}
                style={styles.adminTypingMessage}
              >
                <div className="typing-dot" style={styles.typingDot}></div>
                <div className="typing-dot" style={styles.typingDot}></div>
                <div className="typing-dot" style={styles.typingDot}></div>
              </div>
            )}

            {!isAdminActive &&
              !handoffPending &&
              !isTyping &&
              messages[messages.length - 1]?.sender === "bot" && (
                <div className="auto-options">
                  {DEFAULT_QUESTIONS.map((question, index) => (
                    <div
                      key={index}
                      className="option-tag"
                      onClick={() => handleSend(question)}
                    >
                      {question}
                    </div>
                  ))}
                </div>
              )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <Input
              className="chat-input"
              placeholder={cwStrings.inputPlaceholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                const now = Date.now();
                if (now - lastTypingTime.current > 2000) {
                  publishChatMessage(cwStrings.typingText, "TYPING");
                  lastTypingTime.current = now;
                }
              }}
              onPressEnter={() => handleSend(inputValue)}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={() => handleSend(inputValue)}
            />
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="chat-bubble" onClick={() => setIsOpen(true)}>
          <Badge
            count={unreadCount}
            overflowCount={99}
            offset={[-2, 4]}
            size="small"
          >
            <MessageOutlined style={{ fontSize: "28px", color: "#fff" }} />
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
