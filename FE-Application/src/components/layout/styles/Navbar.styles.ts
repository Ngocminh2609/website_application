import React from "react";
import {
  ICON_WRAPPER_STYLE,
  themeText,
  themeBorder,
  getNavbarNotificationMenuStyle,
} from "../../../styles/commonStyles";

export const styles = {
  notificationMenu: (isDarkMode: boolean): React.CSSProperties =>
    getNavbarNotificationMenuStyle(isDarkMode),

  notificationHeader: (isDarkMode: boolean): React.CSSProperties => ({
    padding: "16px",
    borderBottom: `1px solid ${themeBorder(isDarkMode)}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),

  notificationTitle: (isDarkMode: boolean): React.CSSProperties => ({
    color: themeText(isDarkMode),
    fontSize: "16px",
  }),

  markAllReadBtn: {
    color: "var(--primary-color)",
    fontSize: "12px",
    padding: 0,
  },

  notificationListContainer: {
    maxHeight: "400px",
    overflowY: "auto" as const,
  },

  notificationListItem: (
    isDarkMode: boolean,
    isRead: boolean,
  ): React.CSSProperties => ({
    padding: "12px 16px",
    borderBottom: `1px solid ${themeBorder(isDarkMode)}`,
    cursor: "pointer",
    backgroundColor: isRead
      ? "transparent"
      : isDarkMode
        ? "rgba(99, 102, 241, 0.05)"
        : "rgba(99, 102, 241, 0.02)",
    transition: "all 0.3s",
  }),

  notificationItemContent: {
    display: "flex",
    gap: "12px",
    width: "100%",
  },

  notificationDot: (isRead: boolean): React.CSSProperties => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: isRead ? "transparent" : "var(--primary-color)",
    marginTop: "6px",
  }),

  notificationMessageText: (
    isDarkMode: boolean,
    isRead: boolean,
  ): React.CSSProperties => ({
    color: isRead
      ? isDarkMode
        ? "rgba(255,255,255,0.6)"
        : "rgba(0,0,0,0.45)"
      : themeText(isDarkMode),
    fontSize: "14px",
    display: "block",
  }),

  notificationTimeText: (isDarkMode: boolean): React.CSSProperties => ({
    color: isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
    fontSize: "11px",
  }),

  noNotificationContainer: {
    padding: "40px 20px",
    textAlign: "center" as const,
  },

  noNotificationIcon: (isDarkMode: boolean): React.CSSProperties => ({
    fontSize: "32px",
    color: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
    marginBottom: "12px",
  }),

  noNotificationText: (isDarkMode: boolean): React.CSSProperties => ({
    color: isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
  }),

  searchOptionHeader: (isDarkMode: boolean): React.CSSProperties => ({
    color: isDarkMode ? "var(--text-muted)" : "rgba(0,0,0,0.45)",
    fontSize: "12px",
  }),

  searchOptionItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 0",
  },

  searchOptionImage: (isDarkMode: boolean): React.CSSProperties => ({
    width: "40px",
    height: "40px",
    objectFit: "cover" as const,
    borderRadius: "8px",
    border: `1px solid ${themeBorder(isDarkMode)}`,
  }),

  searchOptionInfo: {
    flex: 1,
    minWidth: 0,
  },

  searchOptionName: (isDarkMode: boolean): React.CSSProperties => ({
    fontWeight: 500,
    color: themeText(isDarkMode),
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  }),

  searchOptionPrice: {
    fontSize: "12px",
    color: "var(--primary-color)",
  },

  searchOptionFireIcon: {
    marginLeft: "8px",
    color: "#ff4d4f",
  },

  viewAllResultsBtn: (isDarkMode: boolean): React.CSSProperties => ({
    padding: "10px",
    textAlign: "center" as const,
    cursor: "pointer",
    color: "var(--primary-color)",
    fontWeight: 600,
    borderTop: `1px solid ${themeBorder(isDarkMode)}`,
    marginTop: "4px",
  }),

  searchIconMargin: {
    marginRight: "8px",
  },

  header: {
    position: "fixed" as const,
    zIndex: 1010,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 var(--container-padding)",
    height: "70px",
    lineHeight: "70px",
  },

  mobileMenuIcon: {
    fontSize: "20px",
    color: "var(--text-main)",
    cursor: "pointer",
  },

  logo: {
    cursor: "pointer",
  },

  searchContainer: {
    flex: 1,
    maxWidth: "500px",
    margin: "0 40px",
  },

  searchIcon: {
    color: "var(--primary-color)",
    fontSize: "18px",
    cursor: "pointer",
  },

  searchDropdown: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--glass-border)",
    padding: "8px",
    backdropFilter: "blur(10px)",
  },

  searchSelect: {
    width: "100%",
  },

  themeToggleBtn: {
    ...ICON_WRAPPER_STYLE,
    backgroundColor: "var(--glass-border)",
  },

  sunIcon: {
    fontSize: "20px",
    color: "#fbbf24",
  },

  moonIcon: {
    fontSize: "20px",
    color: "#6366f1",
  },

  badgeIcon: {
    fontSize: "22px",
    color: "var(--text-main)",
  },

  userDropdownTrigger: {
    cursor: "pointer",
  },

  avatar: {
    backgroundColor: "#6366f1",
  },

  userName: {
    color: "var(--text-main)",
    fontWeight: 500,
  },

  loginBtn: (isDarkMode: boolean): React.CSSProperties => ({
    color: themeText(isDarkMode),
  }),

  drawerLogo: (isDarkMode: boolean): React.CSSProperties => ({
    color: themeText(isDarkMode),
  }),

  drawerMenu: {
    background: "transparent",
    borderRight: "none",
  },
};
