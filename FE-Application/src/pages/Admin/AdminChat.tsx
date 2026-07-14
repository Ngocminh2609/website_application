import React from "react";
import { Input, Button, List, Avatar, Typography, Badge, Space } from "antd";
import { SendOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import { useAdminChatState } from "../../hooks/Admin/useAdminChatState";
import { styles } from "./styles/admin-chat.styles";
import { CHAT_STRINGS } from "../../constants/Admin/admin-chat";

const { Text, Title } = Typography;

const AdminChat: React.FC = () => {
  const {
    activeSessionId,
    setActiveSessionId,
    inputValue,
    currentMessages,
    sessions,
    typingSessions,
    connected,
    markSessionRead,
    handleSend,
    handleInputChange,
  } = useAdminChatState();

  return (
    <div style={styles.chatContainer}>
      {/* Sidebar: Danh sách khách hàng đang chat */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <Title level={5} style={styles.sidebarHeaderTitle}>
            {CHAT_STRINGS.sidebarTitle}
          </Title>
        </div>
        <div style={styles.sessionsListContainer}>
          <List
            dataSource={sessions}
            renderItem={(item) => (
              <div
                onClick={() => {
                  setActiveSessionId(item.id);
                  if (item.unreadCount && item.unreadCount > 0) {
                    markSessionRead(item.id);
                  }
                }}
                style={styles.sessionItem(activeSessionId === item.id)}
              >
                <Space>
                  <Badge
                    count={item.unreadCount || 0}
                    size="small"
                    offset={[-2, 2]}
                  >
                    <Avatar
                      icon={<UserOutlined />}
                      style={styles.avatarBadge}
                    />
                  </Badge>
                  <div style={styles.sessionMeta}>
                    <Text strong style={styles.sessionName}>
                      {item.name}
                    </Text>
                    <Text
                      style={styles.sessionLastMsg}
                      ellipsis
                    >
                      {item.lastMessage}
                    </Text>
                  </div>
                </Space>
              </div>
            )}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={styles.mainChatArea}>
        {activeSessionId ? (
          <>
            <div style={styles.chatHeader}>
              <div>
                <Text strong style={styles.sessionName}>
                  {CHAT_STRINGS.chattingWith}
                </Text>
                <Text style={{ color: "var(--primary-color)" }}>
                  {sessions.find((s) => s.id === activeSessionId)?.name}
                </Text>
              </div>
              <Badge
                status={connected ? "success" : "error"}
                text={connected ? CHAT_STRINGS.serverReady : CHAT_STRINGS.serverDisconnected}
                style={styles.chatHeaderStatus}
              />
            </div>

            <div style={styles.messagesContainer}>
              {currentMessages.map((msg, index) => {
                const isAdmin = msg.senderId === "admin";
                return (
                  <div
                    key={index}
                    style={styles.messageBubble(isAdmin)}
                  >
                    <div style={styles.senderName(isAdmin)}>
                      {msg.sender}
                    </div>
                    <div style={styles.messageContent(isAdmin)}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              {activeSessionId && typingSessions[activeSessionId] && (
                <div style={styles.typingBubble}>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
            </div>

            <div style={styles.inputArea}>
              <Space.Compact style={styles.inputCompact}>
                <Input
                  placeholder={CHAT_STRINGS.inputPlaceholder}
                  value={inputValue}
                  onChange={handleInputChange}
                  onPressEnter={handleSend}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                >
                  {CHAT_STRINGS.sendBtn}
                </Button>
              </Space.Compact>
            </div>
          </>
        ) : (
          <div style={styles.emptyChatArea}>
            <MessageOutlined style={styles.emptyChatIcon} />
            <Text style={styles.emptyChatText}>
              {CHAT_STRINGS.emptyStateText}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
