package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

/**
 * Entity lưu trữ tin nhắn chat vào Database.
 */
@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** UUID phía client — dùng để đồng bộ / sửa tin */
    @Column(name = "message_key", unique = true, length = 64)
    private String messageKey;

    @Column(nullable = false)
    private String sender;

    @Column(name = "sender_id", nullable = false)
    private String senderId;

    @Column(name = "recipient_id")
    private String recipientId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String type;

    private String email;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "is_bot_response")
    private Boolean isBotResponse;

    @Column(name = "recalled")
    private Boolean recalled;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        // Chỉ gán createdAt khi tạo mới
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        // Gán updatedAt khi có cập nhật
        this.updatedAt = LocalDateTime.now();
    }
}
