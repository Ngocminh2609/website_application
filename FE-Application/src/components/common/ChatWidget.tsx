import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input, Button, Badge } from 'antd';
import { SendOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { User } from '../../types/auth';

interface Message {
    id: string | number;
    text: string;
    sender: 'bot' | 'user' | 'admin';
    timestamp: number;
}

const DEFAULT_QUESTIONS = [
    { q: "Tech Nova là gì?", a: "Tech Nova là hệ thống bán lẻ công nghệ hàng đầu, chuyên cung cấp Laptop, Gaming Gear và linh kiện PC cao cấp với mức giá ưu đãi nhất!" },
    { q: "Làm sao để đặt hàng?", a: "Bạn chỉ cần chọn sản phẩm ưng ý, thêm vào giỏ hàng và tiến hành thanh toán. Chúng tôi hỗ trợ giao hàng toàn quốc trong 2-4 ngày." },
    { q: "Chính sách bảo hành?", a: "Tất cả sản phẩm tại Tech Nova đều bảo hành chính hãng từ 12-36 tháng. 1 đổi 1 trong 30 ngày nếu có lỗi từ nhà sản xuất." },
    { q: "Phương thức thanh toán?", a: "Chúng tôi hỗ trợ Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng và các ví điện tử phổ biến như Momo, VNPay." },
    { q: "Liên hệ hỗ trợ?", a: "Bạn có thể gọi Hotline 1900 xxxx hoặc chat trực tiếp tại đây để được tư vấn viên hỗ trợ nhanh nhất!" }
];

const AnimatedRobot = () => (
    <svg viewBox="0 0 100 100" className="robot-canvas">
        <rect x="20" y="35" width="60" height="50" rx="10" className="robot-head" />
        <rect x="35" y="45" width="10" height="10" rx="2" className="robot-eye" />
        <rect x="55" y="45" width="10" height="10" rx="2" className="robot-eye" />
        <path d="M40 70 Q50 75 60 70" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="25" r="5" fill="#6366f1" />
        <line x1="50" y1="25" x2="50" y2="35" stroke="#6366f1" strokeWidth="2" />
    </svg>
);

const INITIAL_MESSAGE: Message = {
    id: 'init',
    text: "Xin chào! Tôi là NovaBot. Tôi có thể giúp gì cho bạn hôm nay?",
    sender: 'bot',
    timestamp: 0
};

const createMessageObject = (text: string, sender: 'user' | 'bot' | 'admin'): Message => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).slice(2, 7);
    return {
        id: `${sender}-${timestamp}-${randomStr}`,
        text,
        sender,
        timestamp
    };
};

interface ChatWidgetProps {
    user?: User | null;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Move Refs up (For use in effects)
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const stompClientRef = useRef<Client | null>(null);

    // 1. Init Session (Support Props & LocalStorage Fallback)
    const [chatSession] = useState(() => {
        // Priority: Prop User > LocalStorage User > Guest
        const storageUser = localStorage.getItem('user');
        const userData = user || (storageUser ? JSON.parse(storageUser) : null);

        if (userData) {
            return {
                id: `user-${userData.id}`,
                name: userData.fullName,
                email: userData.email,
                fullName: userData.fullName
            };
        }

        // Guest persistence
        let gId = localStorage.getItem('guest_chat_id');
        let gName = localStorage.getItem('guest_chat_name');

        if (!gId || !gName) {
            gId = `guest-${Math.random().toString(36).slice(2, 7)}`;
            gName = `Khách ${Math.floor(Math.random() * 1000)}`;
            localStorage.setItem('guest_chat_id', gId);
            localStorage.setItem('guest_chat_name', gName);
        }

        return {
            id: gId,
            name: gName,
            email: null,
            fullName: gName
        };
    });

    // 2. Init Messages (Load History)
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const saved = localStorage.getItem(`chat_history_${chatSession.id}`);
            return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
        } catch (err) {
            void err;
            return [INITIAL_MESSAGE];
        }
    });



    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isAdminActive, setIsAdminActive] = useState(false);


    // 3. Persist messages when changed
    useEffect(() => {
        localStorage.setItem(`chat_history_${chatSession.id}`, JSON.stringify(messages));
    }, [messages, chatSession.id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const simulateBotResponse = useCallback((userText: string) => {
        if (isAdminActive) return;

        const lowerText = userText.toLowerCase();
        const found = DEFAULT_QUESTIONS.find(item =>
            lowerText.includes(item.q.toLowerCase()) ||
            item.q.toLowerCase().includes(lowerText)
        );

        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            if (isAdminActive) return;

            const response = found ? found.a : "Tôi chưa biết câu trả lời này. Đã gửi yêu cầu tới Admin, bạn chờ một chút nhé!";
            const botMsg = createMessageObject(response, 'bot');
            setMessages(prev => [...prev, botMsg]);
        }, 800);

        // Trả về true nếu bot có câu trả lời, false nếu cần admin xử lý
        return found !== undefined;
    }, [isAdminActive]);

    const handleSend = (text: string, sender: 'user' | 'bot' = 'user') => {
        if (!text.trim()) return;

        const newMessage = createMessageObject(text, sender);
        setMessages(prev => [...prev, newMessage]);

        if (sender === 'user') {
            setInputValue('');

            if (!isAdminActive) {
                // Kiểm tra xem bot có câu trả lời không
                const lowerText = text.toLowerCase();
                const found = DEFAULT_QUESTIONS.find(item =>
                    lowerText.includes(item.q.toLowerCase()) ||
                    item.q.toLowerCase().includes(lowerText)
                );

                const isBotResponse = found !== undefined;

                // CHỈ gửi đến server khi KHÔNG phải câu hỏi bot
                if (!isBotResponse && stompClientRef.current && stompClientRef.current.connected) {
                    stompClientRef.current.publish({
                        destination: '/app/chat.sendMessage',
                        body: JSON.stringify({
                            sender: chatSession.name,
                            senderId: chatSession.id,
                            email: chatSession.email,
                            fullName: chatSession.fullName,
                            content: text,
                            type: 'CHAT',
                            isBotResponse: false // Tin nhắn thật cần admin xử lý
                        })
                    });
                }

                // Hiển thị câu trả lời bot
                setTimeout(() => {
                    simulateBotResponse(text);
                }, 1000);
            } else {
                // Admin đang active, gửi trực tiếp đến admin
                if (stompClientRef.current && stompClientRef.current.connected) {
                    stompClientRef.current.publish({
                        destination: '/app/chat.sendMessage',
                        body: JSON.stringify({
                            sender: chatSession.name,
                            senderId: chatSession.id,
                            email: chatSession.email,
                            fullName: chatSession.fullName,
                            content: text,
                            type: 'CHAT',
                            isBotResponse: false // Tin nhắn thật cần admin xử lý
                        })
                    });
                }
            }
        }
    };

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        const wsBaseUrl = apiUrl.replace(/\/api$/, '');
        const socket = new SockJS(`${wsBaseUrl}/ws-chat`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                // Đăng ký nhận tin nhắn RIÊNG cho Client này
                client.subscribe(`/topic/user/${chatSession.id}`, (msg) => {
                    const receivedMsg = JSON.parse(msg.body);
                    setIsAdminActive(true);
                    const newMsg = createMessageObject(receivedMsg.content, 'admin');
                    setMessages(prev => [...prev, newMsg]);
                });

                client.publish({
                    destination: '/app/chat.addUser',
                    body: JSON.stringify({
                        sender: chatSession.name,
                        senderId: chatSession.id,
                        email: chatSession.email,
                        fullName: chatSession.fullName,
                        type: 'JOIN'
                    })
                });
            },
            reconnectDelay: 5000,
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) stompClientRef.current.deactivate();
        };
    }, [chatSession]);

    return (
        <div className="chat-widget-container">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <AnimatedRobot />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Nova Assistant</div>
                            <div style={{ fontSize: '10px', color: isAdminActive ? '#10b981' : '#94a3b8' }}>
                                {isAdminActive ? '● Tư vấn viên đang hỗ trợ' : 'ID: ' + chatSession.name}
                            </div>
                        </div>
                        <Button
                            type="text"
                            icon={<CloseOutlined style={{ color: '#94a3b8' }} />}
                            onClick={() => setIsOpen(false)}
                        />
                    </div>

                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message message-${msg.sender}`}>
                                {msg.sender === 'admin' && <div style={{ fontSize: '10px', marginBottom: '4px', color: '#10b981' }}>Tư vấn viên</div>}
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message message-bot" style={{ opacity: 0.6, fontStyle: 'italic' }}>
                                NovaBot đang gõ...
                            </div>
                        )}

                        {!isAdminActive && !isTyping && messages[messages.length - 1]?.sender === 'bot' && (
                            <div className="auto-options">
                                {DEFAULT_QUESTIONS.map((item, index) => (
                                    <div
                                        key={index}
                                        className="option-tag"
                                        onClick={() => handleSend(item.q)}
                                    >
                                        {item.q}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <Input
                            className="chat-input"
                            placeholder="Nhập tin nhắn..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPressEnter={() => handleSend(inputValue)}
                        />
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SendOutlined />}
                            onClick={() => handleSend(inputValue)}
                        />
                    </div>
                </div>
            )}

            {!isOpen && (
                <div className="chat-bubble" onClick={() => setIsOpen(true)}>
                    <Badge dot status="processing" offset={[-5, 5]}>
                        <MessageOutlined style={{ fontSize: '28px', color: '#fff' }} />
                    </Badge>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
