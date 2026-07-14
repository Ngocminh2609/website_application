import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { EyeOutlined } from "@ant-design/icons";
import { Typography, Space } from "antd";
import { getWsUrl } from "../../utils/url";

interface RealTimeViewerCountProps {
  productId: number;
}

/**
 * Component hiển thị số lượng người đang xem sản phẩm theo thời gian thực.
 * Sử dụng WebSocket để kết nối và nhận cập nhật từ server.
 */
const RealTimeViewerCount: React.FC<RealTimeViewerCountProps> = ({
  productId,
}) => {
  const [viewerCount, setViewerCount] = useState<number>(0);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!productId) return;

    let client: Client | null = null;
    try {
      const url = getWsUrl();
      const isUnsafe =
        window.location.protocol === "https:" && url.startsWith("http:");

      client = new Client({
        webSocketFactory: () => {
          if (isUnsafe) {
            return new WebSocket("wss://localhost:0");
          }
          return new SockJS(url);
        },
        onConnect: () => {
          // 1. Đăng ký nhận cập nhật
          client?.subscribe(`/topic/product/${productId}/viewers`, (msg) => {
            try {
              const data = JSON.parse(msg.body);
              if (data && typeof data.viewerCount === "number") {
                setViewerCount(data.viewerCount);
              }
            } catch (e) {
              console.error("Lỗi parse viewer count:", e);
            }
          });

          // 2. Gửi tín hiệu báo đang xem (Sẽ xuất hiện trong tab Network -> WS -> Messages)
          client?.publish({
            destination: `/app/product/${productId}/view`,
            body: JSON.stringify({}),
          });
        },
        reconnectDelay: 5000,
        // Heartbeat để duy trì kết nối
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      if (!isUnsafe) {
        client.activate();
        stompClientRef.current = client;
      }
    } catch (error) {
      console.error("Lỗi kết nối viewer count WebSocket:", error);
    }

    return () => {
      if (stompClientRef.current) {
        // Trước khi ngắt kết nối, chủ động báo rời khỏi (nếu socket còn sống)
        if (stompClientRef.current.connected) {
          stompClientRef.current.publish({
            destination: "/app/product/leave",
            body: JSON.stringify({}),
          });
        }
        stompClientRef.current.deactivate();
      }
    };
  }, [productId]);

  // Nếu chỉ có 1 người xem (là chính mình) hoặc 0, có thể ẩn hoặc hiển thị số 1
  // Để cho "chuyên nghiệp" và tạo hiệu ứng FOMO, chúng ta luôn hiển thị ít nhất là 1
  const displayCount = viewerCount > 0 ? viewerCount : 1;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "rgba(239, 68, 68, 0.1)", // Màu đỏ nhạt
        padding: "4px 12px",
        borderRadius: "20px",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        marginBottom: "12px",
      }}
    >
      <Space size={6}>
        <EyeOutlined
          className="animate-pulse-slow"
          style={{ color: "#ef4444", fontSize: "14px" }}
        />
        <Typography.Text
          style={{ color: "#ef4444", fontSize: "13px", fontWeight: 600 }}
        >
          Hiện có{" "}
          <span style={{ fontSize: "15px", margin: "0 2px" }}>
            {displayCount}
          </span>{" "}
          người đang xem sản phẩm này
        </Typography.Text>
      </Space>
    </div>
  );
};

export default RealTimeViewerCount;
