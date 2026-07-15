import React from "react";
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  UndoOutlined,
} from "@ant-design/icons";

export interface ChatMessageMenuProps {
  onEdit: () => void;
  onRecall: () => void;
}

/**
 * Nút "..." cạnh tin nhắn — hiện khi hover row cha (.chat-msg-row).
 */
const ChatMessageMenu: React.FC<ChatMessageMenuProps> = ({
  onEdit,
  onRecall,
}) => {
  const items: MenuProps["items"] = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Sửa",
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        onEdit();
      },
    },
    {
      key: "recall",
      icon: <UndoOutlined />,
      label: "Thu hồi",
      danger: true,
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        onRecall();
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button
        type="text"
        size="small"
        className="chat-msg-menu-trigger"
        icon={<MoreOutlined style={{ fontSize: 16 }} />}
        onClick={(e) => e.stopPropagation()}
        aria-label="Tùy chọn tin nhắn"
      />
    </Dropdown>
  );
};

export default ChatMessageMenu;
