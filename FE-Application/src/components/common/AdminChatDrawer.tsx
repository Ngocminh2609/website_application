import React from "react";
import { Drawer } from "antd";
import AdminChat from "../../pages/Admin/AdminChat";
import { LAYOUT_STRINGS } from "../../constants/Layout/layout";
import { styles } from "./styles/AdminChatDrawer.styles";

const { navbar: nvStrings } = LAYOUT_STRINGS;

interface AdminChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Cửa sổ chat hỗ trợ cho Admin — mở từ Header, không cần vào trang Quản trị.
 */
const AdminChatDrawer: React.FC<AdminChatDrawerProps> = ({ open, onClose }) => {
  const drawerWidth =
    typeof window !== "undefined" ? Math.min(920, window.innerWidth) : 920;

  return (
    <Drawer
      title={nvStrings.supportMessages}
      placement="right"
      width={drawerWidth}
      onClose={onClose}
      open={open}
      destroyOnClose={false}
      styles={{ body: styles.drawerBody }}
    >
      <div style={styles.chatWrapper}>
        <AdminChat height="100%" />
      </div>
    </Drawer>
  );
};

export default AdminChatDrawer;
