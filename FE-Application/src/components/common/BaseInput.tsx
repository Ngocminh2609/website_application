import React from "react";
import { Input } from "antd";
import type { InputProps } from "antd";
import type { PasswordProps } from "antd/es/input";
import { BASE_INPUT_STYLE } from "../../styles/commonStyles";

/**
 * Thành phần Input dùng chung được tùy chỉnh từ Ant Design.
 */
const BaseInput: React.FC<InputProps> & {
  Password: React.FC<PasswordProps>;
} = (props) => {
  return <Input {...props} style={{ ...BASE_INPUT_STYLE, ...props.style }} />;
};

/**
 * Thành phần Input.Password dùng chung.
 */
BaseInput.Password = (props: PasswordProps) => {
  return (
    <Input.Password
      {...props}
      style={{ ...BASE_INPUT_STYLE, ...props.style }}
    />
  );
};

export default BaseInput;
