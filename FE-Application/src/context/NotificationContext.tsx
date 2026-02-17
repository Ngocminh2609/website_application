import React, { createContext, useState, useContext, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
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
                const response = await fetch(`http://localhost:8080/api/notifications/${userId}`, {
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

        const socket = new SockJS('http://localhost:8080/ws-chat');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/topic/notifications/${userId}`, (msg) => {
                    const newNotification: Notification = JSON.parse(msg.body);

                    // Cập nhật danh sách thông báo trên UI cho tất cả người dùng (Real-time)
                    setNotifications(prev => [newNotification, ...prev]);
                });
            },
            reconnectDelay: 5000,
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [userId]);

    const markAsRead = async (id: number) => {
        try {
            await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
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
            await fetch(`http://localhost:8080/api/notifications/read-all/${userId}`, {
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
