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
    /** ID trong DB (nếu đã lưu) */
    private Long id;

    /** Key ổn định do FE tạo (UUID) — dùng để sửa tin */
    private String messageKey;

    private String sender;
    private String senderId;
    private String recipientId;
    private String content;
    private MessageType type;

    private String email;
    private String fullName;
    private Boolean isBotResponse;

    /** Epoch millis lúc tạo */
    private Long createdAt;

    /** true nếu tin đã được chỉnh sửa */
    private Boolean edited;

    /** true nếu tin đã thu hồi */
    private Boolean recalled;

    public enum MessageType {
        CHAT, JOIN, LEAVE, TYPING, EDIT, RECALL
    }
}
