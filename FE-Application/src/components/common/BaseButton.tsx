import React from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import { BASE_BUTTON_STYLE } from "../../styles/commonStyles";

/**
 * Thành phần Button dùng chung được tùy chỉnh từ Ant Design.
 * Giúp đồng nhất phong cách nút bấm trong toàn bộ dự án.
 */
const BaseButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      {...props}
      style={{
        ...BASE_BUTTON_STYLE,
        ...props.style,
      }}
    >
      {props.children}
    </Button>
  );
};

export default BaseButton;
