import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { EyeOutlined } from "@ant-design/icons";
import { Typography, Space } from "antd";
import { getWsUrl } from "../../utils/url";
import { styles } from "./styles/RealTimeViewerCount.styles";
import { PRODUCT_STRINGS } from "../../constants/Product/product";

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
    <div style={styles.container}>
      <Space size={6}>
        <EyeOutlined
          className="animate-pulse-slow"
          style={styles.icon}
        />
        <Typography.Text style={styles.text}>
          {PRODUCT_STRINGS.realTimeViewer.prefix}{" "}
          <span style={styles.count}>
            {displayCount}
          </span>{" "}
          {PRODUCT_STRINGS.realTimeViewer.suffix}
        </Typography.Text>
      </Space>
    </div>
  );
};

export default RealTimeViewerCount;
