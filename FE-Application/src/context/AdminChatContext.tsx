import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AdminChatContext, type ChatMessage, type ChatSession } from './AdminChatContextDefinition';

/**
 * Provider để quản lý tin nhắn admin toàn cục.
 * Lắng nghe WebSocket ngay cả khi admin chưa mở màn Chat Tư Vấn.
 */
export const AdminChatProvider: React.FC<{ children: React.ReactNode; isAdmin: boolean }> = ({ children, isAdmin }) => {
    const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(() => {
        const saved = localStorage.getItem('admin_conversations');
        return saved ? JSON.parse(saved) : {};
    });

    const [sessions, setSessions] = useState<ChatSession[]>(() => {
        const saved = localStorage.getItem('admin_chat_sessions');
        let parsedSessions: ChatSession[] = saved ? JSON.parse(saved) : [];

        // Lọc bỏ session rác ngay khi load
        parsedSessions = parsedSessions.filter(s =>
            s.id &&
            s.id !== 'undefined' &&
            s.id !== 'null' &&
            !s.id.includes('admin') &&
            s.name !== 'Admin'
        );
        return parsedSessions;
    });

    const [connected, setConnected] = useState(false);
    const stompClientRef = useRef<Client | null>(null);

    // Lưu vào localStorage khi có thay đổi
    useEffect(() => {
        if (Object.keys(conversations).length > 0) {
            localStorage.setItem('admin_conversations', JSON.stringify(conversations));
        }
    }, [conversations]);

    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('admin_chat_sessions', JSON.stringify(sessions));
        }
    }, [sessions]);

    // Kết nối WebSocket nếu là admin
    useEffect(() => {
        if (!isAdmin) return;

        const socket = new SockJS('http://localhost:8080/ws-chat');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setConnected(true);

                // Admin đăng ký nhận tất cả tin nhắn từ khách hàng
                client.subscribe('/topic/admin', (msg) => {
                    const receivedMsg: ChatMessage = JSON.parse(msg.body);

                    // 1. CHỈ xử lý tin nhắn CHAT (bỏ qua JOIN, LEAVE để tránh spam)
                    if (receivedMsg.type !== 'CHAT') return;

                    // 2. Bỏ qua tin nhắn từ chính Admin
                    if (receivedMsg.senderId === 'admin') return;

                    // 3. Validate dữ liệu người gửi
                    const clientKey = receivedMsg.email || receivedMsg.senderId;
                    const clientName = receivedMsg.fullName || receivedMsg.sender;

                    if (!clientKey || clientKey === 'undefined' || clientKey === 'null') return;

                    // 4. Cập nhật hoặc thêm mới Session
                    setSessions(prev => {
                        const existingIdx = prev.findIndex(s => s.id === clientKey);
                        const newSession: ChatSession = {
                            id: clientKey,
                            name: clientName,
                            senderId: receivedMsg.senderId,
                            lastMessage: receivedMsg.content,
                            timestamp: Date.now()
                        };

                        if (existingIdx > -1) {
                            const updated = [...prev];
                            updated[existingIdx] = newSession;
                            // Đưa lên đầu danh sách
                            return [updated[existingIdx], ...updated.filter((_, i) => i !== existingIdx)];
                        } else {
                            // Tạo mới
                            return [newSession, ...prev];
                        }
                    });

                    // 5. Lưu nội dung tin nhắn
                    setConversations(prev => ({
                        ...prev,
                        [clientKey]: [...(prev[clientKey] || []), receivedMsg]
                    }));
                });

                // Thông báo Admin đã trực tuyến (Optional, có thể bor để tránh nhiễu)
                client.publish({
                    destination: '/app/chat.addUser',
                    body: JSON.stringify({
                        sender: 'Admin',
                        senderId: 'admin',
                        type: 'JOIN'
                    })
                });
            },
            onDisconnect: () => setConnected(false),
            reconnectDelay: 5000,
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [isAdmin]);

    const addMessage = (clientKey: string, message: ChatMessage) => {
        setConversations(prev => ({
            ...prev,
            [clientKey]: [...(prev[clientKey] || []), message]
        }));
    };

    const updateSession = (session: ChatSession) => {
        setSessions(prev => {
            const existingIdx = prev.findIndex(s => s.id === session.id);
            if (existingIdx > -1) {
                const updated = [...prev];
                updated[existingIdx] = session;
                return [updated[existingIdx], ...updated.filter((_, i) => i !== existingIdx)];
            }
            return [session, ...prev];
        });
    };

    const sendMessage = (recipientId: string, content: string) => {
        if (stompClientRef.current && connected) {
            const chatMessage: ChatMessage = {
                sender: 'Admin/Tư vấn viên',
                senderId: 'admin',
                recipientId: recipientId,
                content: content,
                type: 'CHAT'
            };

            stompClientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage)
            });

            // Cập nhật UI ngay lập tức (Vì listener đang chặn tin nhắn senderId='admin')
            // 1. Tìm key hội thoại (ưu tiên ID của session, thường là email)
            let conversationKey = recipientId;
            const targetSession = sessions.find(s => s.senderId === recipientId || s.id === recipientId);
            if (targetSession) {
                conversationKey = targetSession.id;
            }

            // 2. Thêm tin nhắn vào cuộc hội thoại
            setConversations(prev => ({
                ...prev,
                [conversationKey]: [...(prev[conversationKey] || []), chatMessage]
            }));

            // 3. Cập nhật last message trong danh sách session
            setSessions(prev => {
                const idx = prev.findIndex(s => s.id === conversationKey);
                if (idx > -1) {
                    const updated = [...prev];
                    updated[idx] = {
                        ...updated[idx],
                        lastMessage: `Bạn: ${content}`,
                        timestamp: Date.now()
                    };
                    // Đưa lên đầu danh sách
                    return [updated[idx], ...updated.filter((_, i) => i !== idx)];
                }
                return prev;
            });
        }
    };

    return (
        <AdminChatContext.Provider value={{ conversations, sessions, connected, addMessage, updateSession, sendMessage }}>
            {children}
        </AdminChatContext.Provider>
    );
};
