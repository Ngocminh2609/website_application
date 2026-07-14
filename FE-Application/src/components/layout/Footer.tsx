import React from "react";
import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

/**
 * Footer Component sử dụng Layout.Footer của Ant Design.
 */
const Footer: React.FC = () => {
  return (
    <AntFooter
      style={{
        textAlign: "center",
        background: "transparent",
        color: "#94a3b8",
        padding: "40px 0",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      Tech Nova Full Stack ©2026 Crafted with Passion by Antigravity Team
    </AntFooter>
  );
};

export default Footer;
