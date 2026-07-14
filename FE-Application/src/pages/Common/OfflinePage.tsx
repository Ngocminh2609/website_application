import React from "react";
import { Result, Button } from "antd";
import { WifiOutlined } from "@ant-design/icons";
import {
  containerStyle,
  iconStyle,
  titleStyle,
  subtitleStyle,
} from "./styles/offlineStyles";
import { COMMON_STRINGS } from "../../constants/Common/common";

/**
 * Trang thông báo khi người dùng không có kết nối internet.
 * Hiển thị thiết kế chuyên nghiệp thay vì màn hình lỗi mặc định của trình duyệt.
 */
const OfflinePage: React.FC = () => {
  const { offlinePage } = COMMON_STRINGS;

  return (
    <div style={containerStyle}>
      <Result
        icon={<WifiOutlined style={iconStyle} />}
        title={
          <span style={titleStyle}>
            {offlinePage.title}
          </span>
        }
        subTitle={
          <span style={subtitleStyle}>
            {offlinePage.subtitle}
          </span>
        }
        extra={
          <Button type="primary" onClick={() => window.location.reload()}>
            {offlinePage.retryBtn}
          </Button>
        }
      />
    </div>
  );
};

export default OfflinePage;
