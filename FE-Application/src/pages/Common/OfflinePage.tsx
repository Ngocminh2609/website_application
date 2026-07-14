import React from "react";
import { Result, Button } from "antd";
import { WifiOutlined } from "@ant-design/icons";

/**
 * Trang thông báo khi người dùng không có kết nối internet.
 * Hiển thị thiết kế chuyên nghiệp thay vì màn hình lỗi mặc định của trình duyệt.
 */
const OfflinePage: React.FC = () => {
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <Result
        icon={<WifiOutlined style={{ color: "#6366f1", fontSize: "64px" }} />}
        title={
          <span style={{ color: "var(--text-color, #fff)" }}>
            Mất kết nối internet
          </span>
        }
        subTitle={
          <span style={{ color: "var(--text-color-secondary, #94a3b8)" }}>
            Bạn đang ở chế độ ngoại tuyến. Một số tính năng có thể không khả
            dụng. Vui lòng kiểm tra lại đường truyền.
          </span>
        }
        extra={
          <Button type="primary" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        }
      />
    </div>
  );
};

export default OfflinePage;
