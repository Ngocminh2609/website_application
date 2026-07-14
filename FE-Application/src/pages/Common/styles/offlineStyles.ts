import type { CSSProperties } from "react";

export const containerStyle: CSSProperties = {
  height: "80vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
};

export const iconStyle: CSSProperties = {
  color: "#6366f1",
  fontSize: "64px",
};

export const titleStyle: CSSProperties = {
  color: "var(--text-color, #fff)",
};

export const subtitleStyle: CSSProperties = {
  color: "var(--text-color-secondary, #94a3b8)",
};
