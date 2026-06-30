import React, { useCallback, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button, notification } from 'antd';
import { CloudDownloadOutlined, CloseOutlined } from '@ant-design/icons';

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
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = useCallback(() => {
        setOfflineReady(false);
        setNeedRefresh(false);
    }, [setOfflineReady, setNeedRefresh]);

    useEffect(() => {
        if (offlineReady) {
            notification.success({
                message: 'Trình duyệt ngoại tuyến',
                description: 'Ứng dụng đã sẵn sàng hoạt động ngoại tuyến.',
                placement: 'bottomRight',
                icon: <CloudDownloadOutlined style={{ color: '#52c41a' }} />,
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
                    Cập nhật ngay
                </Button>
            );

            notification.info({
                message: 'Bản cập nhật mới!',
                description: 'Đã có phiên bản mới. Vui lòng cập nhật để trải nghiệm những tính năng mới nhất.',
                btn,
                key,
                duration: 0,
                placement: 'bottomRight',
                onClose: close,
                icon: <CloudDownloadOutlined style={{ color: '#1890ff' }} />,
                closeIcon: <CloseOutlined onClick={() => {
                    close();
                    notification.destroy(key);
                }} />,
            });
        }
    }, [close, needRefresh, updateServiceWorker]);

    return null; // Component này không render UI trực tiếp mà dùng Ant Design Notification
};

export default ReloadPrompt;
