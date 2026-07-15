import { useState, useEffect, useRef } from "react";
import { useAdminChat } from "../../context/useAdminChat";
import { canEditChatMessage } from "../../utils/chatMessage";

export const useAdminChatState = () => {
  const {
    conversations,
    sessions,
    typingSessions,
    connected,
    sendMessage,
    editMessage,
    recallMessage,
    sendTypingStatus,
    markSessionRead,
  } = useAdminChat();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const lastTypingTime = useRef<number>(0);

  useEffect(() => {
    if (activeSessionId) {
      const currentSession = sessions.find((s) => s.id === activeSessionId);
      if (currentSession?.unreadCount && currentSession.unreadCount > 0) {
        markSessionRead(activeSessionId);
      }
    }
  }, [sessions, activeSessionId, markSessionRead]);

  useEffect(() => {
    setEditingKey(null);
    setEditingValue("");
  }, [activeSessionId]);

  const resolveRecipientId = () => {
    if (!activeSessionId) return null;
    const activeSession = sessions.find((s) => s.id === activeSessionId);
    return activeSession?.senderId || activeSessionId;
  };

  const handleSend = () => {
    if (inputValue.trim() && activeSessionId) {
      const recipientSenderId = resolveRecipientId();
      if (recipientSenderId) sendMessage(recipientSenderId, inputValue);
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (activeSessionId) {
      const now = Date.now();
      if (now - lastTypingTime.current > 2000) {
        const recipientSenderId = resolveRecipientId();
        if (recipientSenderId) sendTypingStatus(recipientSenderId);
        lastTypingTime.current = now;
      }
    }
  };

  const startEdit = (messageKey: string, content: string, createdAt?: number) => {
    if (!canEditChatMessage(createdAt)) return;
    setEditingKey(messageKey);
    setEditingValue(content);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditingValue("");
  };

  const saveEdit = () => {
    if (!activeSessionId || !editingKey || !editingValue.trim()) return;
    const recipientSenderId = resolveRecipientId();
    if (recipientSenderId) editMessage(recipientSenderId, editingKey, editingValue);
    cancelEdit();
  };

  const handleRecall = (messageKey: string) => {
    const recipientSenderId = resolveRecipientId();
    if (recipientSenderId) recallMessage(recipientSenderId, messageKey);
    if (editingKey === messageKey) cancelEdit();
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
    editingKey,
    editingValue,
    setEditingValue,
    startEdit,
    cancelEdit,
    saveEdit,
    handleRecall,
  };
};
