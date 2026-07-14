import React from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";
import {
  BASE_SELECT_STYLE,
  BASE_SELECT_DROPDOWN_STYLE,
} from "../../styles/commonStyles";

/**
 * Thành phần Select dùng chung.
 * Tùy chỉnh để đảm bảo hiển thị đẹp mắt trên nền tối của dự án.
 */
const BaseSelect: React.FC<SelectProps> = (props) => {
  return (
    <Select
      {...props}
      style={{ ...BASE_SELECT_STYLE, ...props.style }}
      dropdownStyle={BASE_SELECT_DROPDOWN_STYLE}
    />
  );
};

export default BaseSelect;
