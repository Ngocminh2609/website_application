import React from "react";
import {
  COMPARE_BAR_CONTAINER_STYLE,
  COMPARE_BAR_CONTENT_STYLE,
} from "../../../styles/commonStyles";

export const styles = {
  container: (isExpanded: boolean): React.CSSProperties => ({
    ...COMPARE_BAR_CONTAINER_STYLE,
    width: isExpanded ? "max-content" : "60px",
  }),
  content: (isExpanded: boolean): React.CSSProperties => ({
    ...COMPARE_BAR_CONTENT_STYLE,
    padding: isExpanded ? "12px 24px" : "12px",
  }),
  toggleButton: {
    color: "#fff",
  },
  itemsContainer: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  itemWrapper: {
    position: "relative" as const,
    width: "50px",
    height: "50px",
  },
  closeIcon: {
    color: "#fff",
    fontSize: "10px",
    cursor: "pointer",
    background: "#ff4d4f",
    borderRadius: "50%",
    padding: "2px",
  },
  itemImage: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    objectFit: "cover" as const,
    border: "2px solid rgba(255, 255, 255, 0.2)",
  },
  emptyPlaceholder: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    border: "2px dashed rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255, 255, 255, 0.1)",
  },
  actionsContainer: {
    display: "flex",
    gap: "8px",
  },
  compareBtn: {
    borderRadius: "12px",
    fontWeight: 600,
  },
  clearBtn: {
    borderRadius: "12px",
  },
  collapsedIcon: {
    color: "#fff",
    fontSize: "24px",
  },
};
