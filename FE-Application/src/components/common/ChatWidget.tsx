import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, Button, Badge } from "antd";
import {
  SendOutlined,
  CloseOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getWsUrl } from "../../utils/url";
import type { User } from "../../types/auth";
import { styles } from "./styles/ChatWidget.styles";
import { COMMON_STRINGS } from "../../constants/Common/common";

const { chatWidget: cwStrings } = COMMON_STRINGS;

interface Message {
  id: string | number;
  text: string;
  sender: "bot" | "user" | "admin";
  timestamp: number;
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
): Message => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).slice(2, 7);
  return {
    id: `${sender}-${timestamp}-${randomStr}`,
    text,
    sender,
    timestamp,
  };
};

/** Tìm câu trả lời bot dựa trên text người dùng nhập. */
const findBotAnswer = (text: string) => {
  const lowerText = text.toLowerCase();
  return cwStrings.defaultQuestions.find(
    (item) =>
      lowerText.includes(item.q.toLowerCase()) ||
      item.q.toLowerCase().includes(lowerText),
  );
};

interface ChatWidgetProps {
  user?: User | null;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const lastTypingTime = useRef<number>(0);
  const adminTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // 1. Init Session (Support Props & LocalStorage Fallback)
  const [chatSession] = useState(() => {
    try {
      const storageUser = localStorage.getItem("user");
      const userData = user || (storageUser ? JSON.parse(storageUser) : null);

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

  const simulateBotResponse = useCallback(
    (userText: string) => {
      if (isAdminActive) return;

      const found = findBotAnswer(userText);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response = found ? found.a : cwStrings.botFallbackResponse;
        const botMsg = createMessageObject(response, "bot");
        setMessages((prev) => [...prev, botMsg]);
      }, 800);

      return found !== undefined;
    },
    [isAdminActive],
  );

  const publishChatMessage = useCallback(
    (text: string, type: "CHAT" | "TYPING" = "CHAT") => {
      if (!stompClientRef.current?.connected) return;
      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify({
          sender: chatSession.name,
          senderId: chatSession.id,
          email: chatSession.email,
          fullName: chatSession.fullName,
          content: text,
          type,
          isBotResponse: false,
        }),
      });
    },
    [chatSession],
  );

  const handleSend = (text: string, sender: "user" | "bot" = "user") => {
    if (!text.trim()) return;

    const newMessage = createMessageObject(text, sender);
    setMessages((prev) => [...prev, newMessage]);

    if (sender === "user") {
      setInputValue("");

      if (!isAdminActive) {
        const found = findBotAnswer(text);
        if (!found) {
          publishChatMessage(text);
        }
        setTimeout(() => {
          simulateBotResponse(text);
        }, 1000);
      } else {
        publishChatMessage(text);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      return;
    }

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

            if (receivedMsg.type === "CHAT") {
              setIsAdminActive(true);
              setIsAdminTyping(false);
              localStorage.setItem(
                `last_admin_time_${chatSession.id}`,
                Date.now().toString(),
              );
              if (adminTypingTimeoutRef.current)
                clearTimeout(adminTypingTimeoutRef.current);
              const newMsg = createMessageObject(receivedMsg.content, "admin");
              setMessages((prev) => [...prev, newMsg]);
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
  }, [isOpen, chatSession]);

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-window" style={styles.chatWindow}>
          <div className="chat-header">
            <AnimatedRobot />
            <div style={styles.headerTextContainer}>
              <div style={styles.title}>{cwStrings.title}</div>
              <div style={styles.statusText(isAdminActive)}>
                {isAdminActive
                  ? cwStrings.adminStatusActive
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
            {messages.map((msg) => (
              <div key={msg.id} className={`message message-${msg.sender}`}>
                {msg.sender === "admin" && (
                  <div style={styles.adminBadge}>{cwStrings.adminLabel}</div>
                )}
                {msg.text}
              </div>
            ))}
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
              !isTyping &&
              messages[messages.length - 1]?.sender === "bot" && (
                <div className="auto-options">
                  {DEFAULT_QUESTIONS.map((item, index) => (
                    <div
                      key={index}
                      className="option-tag"
                      onClick={() => handleSend(item.q)}
                    >
                      {item.q}
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
          <Badge dot status="processing" offset={[-5, 5]}>
            <MessageOutlined style={{ fontSize: "28px", color: "#fff" }} />
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
