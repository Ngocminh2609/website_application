import type { CSSProperties } from "react";

export const styles = {
  chatContainer: {
    display: "flex",
    height: "600px",
    background: "var(--glass-bg)",
    borderRadius: "12px",
    border: "1px solid var(--glass-border)",
    overflow: "hidden",
    minHeight: 0,
  } as CSSProperties,

  sidebar: {
    width: "300px",
    borderRight: "1px solid var(--glass-border)",
    display: "flex",
    flexDirection: "column",
  } as CSSProperties,

  sidebarHeader: {
    padding: "20px",
    borderBottom: "1px solid var(--glass-border)",
  } as CSSProperties,

  sidebarHeaderTitle: {
    color: "var(--text-main)",
    margin: 0,
  } as CSSProperties,

  sessionsListContainer: {
    flex: 1,
    overflowY: "auto",
  } as CSSProperties,

  sessionItem: (isActive: boolean): CSSProperties => ({
    padding: "15px 20px",
    cursor: "pointer",
    transition: "all 0.3s",
    background: isActive ? "rgba(99, 102, 241, 0.15)" : "transparent",
    borderLeft: isActive ? "3px solid #6366f1" : "3px solid transparent",
  }),

  avatarBadge: {
    background: "#6366f1",
  } as CSSProperties,

  sessionMeta: {
    display: "flex",
    flexDirection: "column",
    width: "180px",
  } as CSSProperties,

  sessionName: {
    color: "var(--text-main)",
  } as CSSProperties,

  sessionLastMsg: {
    fontSize: "12px",
    color: "var(--text-muted)",
  } as CSSProperties,

  mainChatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  } as CSSProperties,

  chatHeader: {
    padding: "15px 20px",
    borderBottom: "1px solid var(--glass-border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as CSSProperties,

  chatHeaderStatus: {
    color: "var(--text-muted)",
  } as CSSProperties,

  messagesContainer: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  } as CSSProperties,

  messageBubble: (isAdmin: boolean): CSSProperties => ({
    alignSelf: isAdmin ? "flex-end" : "flex-start",
    maxWidth: "75%",
    padding: "10px 15px",
    background: isAdmin ? "var(--primary-gradient)" : "var(--bg-secondary)",
    borderRadius: "12px",
    borderBottomRightRadius: isAdmin ? "2px" : "12px",
    borderBottomLeftRadius: isAdmin ? "12px" : "2px",
    border: isAdmin ? "none" : "1px solid var(--glass-border)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    position: "relative",
  }),

  messageRow: (isAdmin: boolean): CSSProperties => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 4,
    alignSelf: isAdmin ? "flex-end" : "flex-start",
    maxWidth: "85%",
    flexDirection: isAdmin ? "row-reverse" : "row",
  }),

  senderName: (isAdmin: boolean): CSSProperties => ({
    fontSize: "11px",
    color: isAdmin ? "#fff" : "var(--text-muted)",
    marginBottom: "4px",
    fontWeight: 600,
  }),

  messageContent: (isAdmin: boolean): CSSProperties => ({
    color: isAdmin ? "#fff" : "var(--text-main)",
    fontSize: "14px",
    lineHeight: "1.5",
  }),

  messageMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  } as CSSProperties,

  editedLabel: (isAdmin: boolean): CSSProperties => ({
    fontSize: 11,
    opacity: 0.75,
    color: isAdmin ? "#fff" : "var(--text-muted)",
    fontStyle: "italic",
  }),

  editLinkBtn: (isAdmin: boolean): CSSProperties => ({
    padding: 0,
    height: "auto",
    fontSize: 11,
    color: isAdmin ? "rgba(255,255,255,0.9)" : "var(--primary-color)",
  }),

  editInput: {
    marginTop: 6,
  } as CSSProperties,

  typingBubble: {
    alignSelf: "flex-start",
    padding: "10px 15px",
    background: "var(--bg-secondary)",
    borderRadius: "12px",
    borderBottomLeftRadius: "2px",
    border: "1px solid var(--glass-border)",
    display: "flex",
    gap: "4px",
    alignItems: "center",
  } as CSSProperties,

  inputArea: {
    padding: "20px",
    background: "var(--bg-secondary)",
    borderTop: "1px solid var(--glass-border)",
  } as CSSProperties,

  inputCompact: {
    width: "100%",
  } as CSSProperties,

  emptyChatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  } as CSSProperties,

  emptyChatIcon: {
    fontSize: "48px",
    color: "var(--primary-color)",
    marginBottom: "20px",
  } as CSSProperties,

  emptyChatText: {
    color: "var(--text-main)",
  } as CSSProperties,
};
