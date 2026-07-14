import React, { useState, useEffect, useRef } from "react";
import { useAdminChat } from "../../context/useAdminChat";

export const useAdminChatState = () => {
  const {
    conversations,
    sessions,
    typingSessions,
    connected,
    sendMessage,
    sendTypingStatus,
    markSessionRead,
  } = useAdminChat();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const lastTypingTime = useRef<number>(0);

  // Tự động đánh dấu đã đọc khi đang xem session đó
  useEffect(() => {
    if (activeSessionId) {
      const currentSession = sessions.find((s) => s.id === activeSessionId);
      if (currentSession?.unreadCount && currentSession.unreadCount > 0) {
        markSessionRead(activeSessionId);
      }
    }
  }, [sessions, activeSessionId, markSessionRead]);

  const handleSend = () => {
    if (inputValue.trim() && activeSessionId) {
      // Lấy senderId từ session để gửi tin nhắn
      const activeSession = sessions.find((s) => s.id === activeSessionId);
      const recipientSenderId = activeSession?.senderId || activeSessionId;

      // Gửi tin nhắn qua context
      sendMessage(recipientSenderId, inputValue);
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (activeSessionId) {
      const now = Date.now();
      // Gửi tín hiệu typing tối đa 1 lần mỗi 2 giây để tránh làm quá tải server
      if (now - lastTypingTime.current > 2000) {
        const activeSession = sessions.find((s) => s.id === activeSessionId);
        const recipientSenderId = activeSession?.senderId || activeSessionId;
        sendTypingStatus(recipientSenderId);
        lastTypingTime.current = now;
      }
    }
  };

  const currentMessages = activeSessionId
    ? conversations[activeSessionId] || []
    : [];

  return {
    activeSessionId,
    setActiveSessionId,
    inputValue,
    setInputValue,
    currentMessages,
    sessions,
    typingSessions,
    connected,
    markSessionRead,
    handleSend,
    handleInputChange,
  };
};
