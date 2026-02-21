package com.ecommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Đối tượng gói tin nhắn chat.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String sender; // Tên hiển thị
    private String senderId; // ID người gửi
    private String recipientId; // ID người nhận
    private String content; // Nội dung tin nhắn
    private MessageType type; // Loại tin nhắn
    
    // Thông tin bổ sung để phân biệt client theo email
    private String email; // Email của client (dùng làm key phân biệt)
    private String fullName; // Tên đầy đủ của client
    
    // Đánh dấu tin nhắn có phải từ bot hay không
    private Boolean isBotResponse; // true nếu là câu trả lời từ bot, false/null nếu là tin nhắn thật cần admin xử lý

    public enum MessageType {
        CHAT, JOIN, LEAVE, TYPING
    }
}
