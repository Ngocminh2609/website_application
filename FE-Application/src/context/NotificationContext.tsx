import React, { createContext, useState, useContext, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getBaseApiUrl, getWsUrl } from '../utils/url';
import type { Notification } from '../types/notification';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const NotificationProvider: React.FC<{ children: React.ReactNode; userId: string | null }> = ({ children, userId }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        if (!userId) return;

        const fetchNotifications = async () => {
            try {
                const baseUrl = getBaseApiUrl();
                const response = await fetch(`${baseUrl}/notifications/${userId}`, {
                    headers: getAuthHeaders()
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error('Lỗi tải thông báo:', error);
            }
        };

        fetchNotifications();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        let client: Client | null = null;
        try {
            client = new Client({
                webSocketFactory: () => {
                    const url = getWsUrl();
                    // Nếu đang chạy HTTPS mà URL lại là HTTP, SockJS sẽ ném lỗi SecurityError đồng bộ
                    // Chúng ta chặn luôn từ đây để không làm sập ứng dụng.
                    if (window.location.protocol === 'https:' && url.startsWith('http:')) {
                        console.error('Chặn khởi tạo WebSocket không an toàn từ trang HTTPS');
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return null as any;
                    }
                    try {
                        return new SockJS(url);
                    } catch (e) {
                        console.error('Lỗi khởi tạo SockJS:', e);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return null as any;
                    }
                },
                onConnect: () => {
                    client?.subscribe(`/topic/notifications/${userId}`, (msg) => {
                        const newNotification: Notification = JSON.parse(msg.body);
                        setNotifications(prev => [newNotification, ...prev]);
                    });
                },
                reconnectDelay: 5000,
            });

            client.activate();
        } catch (error) {
            console.error('Không thể kích hoạt kết nối thông báo:', error);
        }

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [userId]);

    const markAsRead = async (id: number) => {
        try {
            const baseUrl = getBaseApiUrl();
            await fetch(`${baseUrl}/notifications/${id}/read`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Lỗi đánh dấu đã đọc:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!userId) return;
        try {
            const baseUrl = getBaseApiUrl();
            await fetch(`${baseUrl}/notifications/read-all/${userId}`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Lỗi đánh dấu tất cả đã đọc:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
