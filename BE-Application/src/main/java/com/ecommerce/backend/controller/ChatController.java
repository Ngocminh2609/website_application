package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import static com.ecommerce.backend.constant.controller.ChatConstants.*;

/**
 * Controller xử lý các tin nhắn từ người dùng qua WebSocket.
 * Thông báo về tin nhắn chỉ hiển thị ở FE, không lưu vào DB.
 */
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final com.ecommerce.backend.service.ChatService chatService;

    /**
     * Nhận tin nhắn và định hướng tới đích tương ứng.
     * Chỉ gửi đến admin khi tin nhắn KHÔNG phải từ bot (isBotResponse = false hoặc null).
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        // Lưu tin nhắn vào DB (luôn lưu mọi tin nhắn CHAT)
        if (chatMessage.getType() == ChatMessage.MessageType.CHAT) {
            chatService.saveMessage(chatMessage);
        }

        String recipientTopic;
        String recipientId;

        if (chatMessage.getRecipientId() != null && !chatMessage.getRecipientId().isEmpty()) {
            // Gửi tới khách hàng cụ thể
            recipientId = chatMessage.getRecipientId();
            recipientTopic = TOPIC_USER_PREFIX + recipientId;

            // Gửi tin nhắn chat từ admin đến client
            messagingTemplate.convertAndSend(recipientTopic, chatMessage);
        } else {
            // Chỉ gửi tới Admin khi KHÔNG phải tin nhắn bot
            // isBotResponse = null hoặc false nghĩa là tin nhắn thật từ user cần admin xử lý
            if (chatMessage.getIsBotResponse() == null || !chatMessage.getIsBotResponse()) {
//                recipientId = "admin";
                recipientTopic = TOPIC_ADMIN;

                // Gửi tin nhắn chat từ client đến admin
                messagingTemplate.convertAndSend(recipientTopic, chatMessage);
            }
            // Nếu isBotResponse = true, không gửi đến admin vì bot đã xử lý
        }
    }

    /**
     * Xử lý khi người dùng tham gia phòng chat.
     */
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        if (headerAccessor.getSessionAttributes() != null) {
            headerAccessor.getSessionAttributes().put(SESSION_KEY_USERNAME, chatMessage.getSender());
            headerAccessor.getSessionAttributes().put(SESSION_KEY_SENDER_ID, chatMessage.getSenderId());
            if (chatMessage.getEmail() != null) {
                headerAccessor.getSessionAttributes().put(SESSION_KEY_EMAIL, chatMessage.getEmail());
            }
        }
        // Thông báo cho admin khi có user mới tham gia
        messagingTemplate.convertAndSend(TOPIC_ADMIN, chatMessage);
    }
}
