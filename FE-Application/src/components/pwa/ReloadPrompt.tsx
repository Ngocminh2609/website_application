import React, { useCallback, useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button, notification } from "antd";
import { CloudDownloadOutlined, CloseOutlined } from "@ant-design/icons";
import { styles } from "./styles/ReloadPrompt.styles";
import { PWA_STRINGS } from "../../constants/Pwa/pwa";

/**
 * Component xử lý thông báo cập nhật PWA.
 * Sẽ hiển thị một thông báo (toast) khi có phiên bản mới của ứng dụng được tải về nền.
 * Cho phép người dùng làm mới trang để áp dụng các thay đổi ngay lập tức.
 */
const ReloadPrompt: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const close = useCallback(() => {
    setOfflineReady(false);
    setNeedRefresh(false);
  }, [setOfflineReady, setNeedRefresh]);

  useEffect(() => {
    if (offlineReady) {
      notification.success({
        message: PWA_STRINGS.reloadPrompt.offlineReady.message,
        description: PWA_STRINGS.reloadPrompt.offlineReady.description,
        placement: "bottomRight",
        icon: <CloudDownloadOutlined style={styles.offlineIcon} />,
      });
    }
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) {
      const key = `open${Date.now()}`;
      const btn = (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            updateServiceWorker(true);
            notification.destroy(key);
          }}
          icon={<CloudDownloadOutlined />}
        >
          {PWA_STRINGS.reloadPrompt.needRefresh.btnText}
        </Button>
      );

      notification.info({
        message: PWA_STRINGS.reloadPrompt.needRefresh.message,
        description: PWA_STRINGS.reloadPrompt.needRefresh.description,
        btn,
        key,
        duration: 0,
        placement: "bottomRight",
        onClose: close,
        icon: <CloudDownloadOutlined style={styles.refreshIcon} />,
        closeIcon: (
          <CloseOutlined
            onClick={() => {
              close();
              notification.destroy(key);
            }}
          />
        ),
      });
    }
  }, [close, needRefresh, updateServiceWorker]);

  return null; // Component này không render UI trực tiếp mà dùng Ant Design Notification
};

export default ReloadPrompt;
