import React, { useState, useEffect } from 'react';
import { Input, Button, List, Avatar, Typography, Badge, Space } from 'antd';
import { SendOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { useAdminChat } from '../../context/useAdminChat';

const { Text, Title } = Typography;

const AdminChat: React.FC = () => {
    // Sử dụng context để lấy conversations, sessions và sendMessage
    const { conversations, sessions, connected, sendMessage, markSessionRead } = useAdminChat();
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');

    // Tự động đánh dấu đã đọc khi đang xem session đó
    useEffect(() => {
        if (activeSessionId) {
            const currentSession = sessions.find(s => s.id === activeSessionId);
            if (currentSession?.unreadCount && currentSession.unreadCount > 0) {
                markSessionRead(activeSessionId);
            }
        }
    }, [sessions, activeSessionId, markSessionRead]);

    const handleSend = () => {
        if (inputValue.trim() && activeSessionId) {
            // Lấy senderId từ session để gửi tin nhắn
            const activeSession = sessions.find(s => s.id === activeSessionId);
            const recipientSenderId = activeSession?.senderId || activeSessionId;

            // Gửi tin nhắn qua context
            sendMessage(recipientSenderId, inputValue);
            setInputValue('');
        }
    };

    const currentMessages = activeSessionId ? conversations[activeSessionId] || [] : [];

    return (
        <div style={{ display: 'flex', height: '600px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            {/* Sidebar: Danh sách khách hàng đang chat */}
            <div style={{ width: '300px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Title level={5} style={{ color: '#fff', margin: 0 }}>Hội thoại khách hàng</Title>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <List
                        dataSource={sessions}
                        renderItem={item => (
                            <div
                                onClick={() => {
                                    setActiveSessionId(item.id);
                                    if (item.unreadCount && item.unreadCount > 0) {
                                        markSessionRead(item.id);
                                    }
                                }}
                                style={{
                                    padding: '15px 20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    background: activeSessionId === item.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                    borderLeft: activeSessionId === item.id ? '3px solid #6366f1' : '3px solid transparent'
                                }}
                            >
                                <Space>
                                    <Badge count={item.unreadCount || 0} size="small" offset={[-2, 2]}>
                                        <Avatar icon={<UserOutlined />} style={{ background: '#6366f1' }} />
                                    </Badge>
                                    <div style={{ display: 'flex', flexDirection: 'column', width: '180px' }}>
                                        <Text strong style={{ color: '#fff' }}>{item.name}</Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }} ellipsis>{item.lastMessage}</Text>
                                    </div>
                                </Space>
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Main Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {activeSessionId ? (
                    <>
                        <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong style={{ color: '#fff' }}>Đang chat với: </Text>
                                <Text style={{ color: '#6366f1' }}>{sessions.find(s => s.id === activeSessionId)?.name}</Text>
                            </div>
                            <Badge status={connected ? "success" : "error"} text={connected ? "Máy chủ sẵn sàng" : "Mất kết nối"} style={{ color: 'rgba(255,255,255,0.6)' }} />
                        </div>

                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {currentMessages.map((msg, index) => (
                                <div key={index} style={{
                                    alignSelf: msg.senderId === 'admin' ? 'flex-end' : 'flex-start',
                                    maxWidth: '75%',
                                    padding: '10px 15px',
                                    background: msg.senderId === 'admin' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    borderBottomRightRadius: msg.senderId === 'admin' ? '2px' : '12px',
                                    borderBottomLeftRadius: msg.senderId === 'admin' ? '12px' : '2px',
                                }}>
                                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{msg.sender}</div>
                                    <div style={{ color: '#fff' }}>{msg.content}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input
                                    placeholder="Gửi câu trả lời cho khách hàng..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onPressEnter={handleSend}
                                />
                                <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>Gửi ngay</Button>
                            </Space.Compact>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                        <MessageOutlined style={{ fontSize: '48px', color: '#6366f1', marginBottom: '20px' }} />
                        <Text style={{ color: '#fff' }}>Chọn một khách hàng để bắt đầu tư vấn</Text>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
