import React from "react";

export const styles = {
  chatWindow: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--glass-border)",
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 600,
    color: "#fff",
    fontSize: "16px",
  },
  statusText: (isAdminActive: boolean): React.CSSProperties => ({
    fontSize: "10px",
    color: isAdminActive ? "#10b981" : "#94a3b8",
  }),
  closeBtnIcon: {
    color: "#94a3b8",
  },
  adminBadge: {
    fontSize: "10px",
    marginBottom: "4px",
    color: "#10b981",
  },
  botTypingMessage: {
    opacity: 0.6,
    fontStyle: "italic" as const,
  },
  adminTypingMessage: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
    width: "fit-content",
  },
  typingDot: {
    background: "#10b981",
  },
};
