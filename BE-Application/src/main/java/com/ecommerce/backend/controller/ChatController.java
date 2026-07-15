package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ChatMessage;
import com.ecommerce.backend.util.text.StringUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import static com.ecommerce.backend.constant.controller.ChatConstants.*;

/**
 * Controller xử lý các tin nhắn từ người dùng qua WebSocket.
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final com.ecommerce.backend.service.ChatService chatService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        if (chatMessage.getType() == ChatMessage.MessageType.EDIT) {
            handleMutation(chatMessage, true);
            return;
        }
        if (chatMessage.getType() == ChatMessage.MessageType.RECALL) {
            handleMutation(chatMessage, false);
            return;
        }

        if (chatMessage.getType() == ChatMessage.MessageType.CHAT) {
            ChatMessage saved = chatService.saveMessage(chatMessage);
            chatMessage.setId(saved.getId());
            chatMessage.setCreatedAt(saved.getCreatedAt());
            chatMessage.setEdited(false);
            chatMessage.setRecalled(false);
            if (chatMessage.getMessageKey() == null) {
                chatMessage.setMessageKey(saved.getMessageKey());
            }
        }

        routeChatOrTyping(chatMessage);
    }

    private void handleMutation(ChatMessage chatMessage, boolean isEdit) {
        try {
            ChatMessage updated = isEdit
                    ? chatService.editMessage(chatMessage)
                    : chatService.recallMessage(chatMessage);
            // Luôn đẩy về CẢ admin topic lẫn client topic
            routeMutationToBothSides(updated);
        } catch (IllegalArgumentException e) {
            log.warn("{} tin nhắn thất bại: {}", isEdit ? "Sửa" : "Thu hồi", e.getMessage());
            sendMutationError(chatMessage, isEdit, e.getMessage());
        } catch (Exception e) {
            log.error("{} tin nhắn lỗi hệ thống: {}", isEdit ? "Sửa" : "Thu hồi", e.getMessage(), e);
            sendMutationError(chatMessage, isEdit, "Lỗi hệ thống khi thao tác tin nhắn");
        }
    }

    private void sendMutationError(ChatMessage chatMessage, boolean isEdit, String message) {
        ChatMessage errorMsg = ChatMessage.builder()
                .type(isEdit ? ChatMessage.MessageType.EDIT : ChatMessage.MessageType.RECALL)
                .messageKey(chatMessage.getMessageKey())
                .senderId("system")
                .content(message)
                .edited(false)
                .recalled(false)
                .isBotResponse(true)
                .build();
        if (StringUtil.hasText(chatMessage.getSenderId())
                && !"admin".equals(chatMessage.getSenderId())) {
            messagingTemplate.convertAndSend(
                    TOPIC_USER_PREFIX + chatMessage.getSenderId(),
                    errorMsg
            );
        } else {
            messagingTemplate.convertAndSend(TOPIC_ADMIN, errorMsg);
        }
    }

    /**
     * EDIT/RECALL: luôn gửi cho admin panel + client để hai bên đồng bộ.
     */
    private void routeMutationToBothSides(ChatMessage msg) {
        messagingTemplate.convertAndSend(TOPIC_ADMIN, msg);

        String clientId;
        if ("admin".equals(msg.getSenderId())) {
            clientId = msg.getRecipientId();
        } else {
            clientId = msg.getSenderId();
        }

        if (StringUtil.hasText(clientId) && !"admin".equals(clientId)) {
            messagingTemplate.convertAndSend(TOPIC_USER_PREFIX + clientId, msg);
            log.info("Đã gửi {} messageKey={} tới client topic={}",
                    msg.getType(), msg.getMessageKey(), clientId);
        } else {
            log.warn("Không xác định được clientId để gửi {} messageKey={}",
                    msg.getType(), msg.getMessageKey());
        }
    }

    private void routeChatOrTyping(ChatMessage chatMessage) {
        if (StringUtil.hasText(chatMessage.getRecipientId())) {
            messagingTemplate.convertAndSend(
                    TOPIC_USER_PREFIX + chatMessage.getRecipientId(),
                    chatMessage
            );
        } else if (chatMessage.getIsBotResponse() == null || !chatMessage.getIsBotResponse()) {
            messagingTemplate.convertAndSend(TOPIC_ADMIN, chatMessage);
        }
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        if (headerAccessor.getSessionAttributes() != null) {
            headerAccessor.getSessionAttributes().put(SESSION_KEY_USERNAME, chatMessage.getSender());
            headerAccessor.getSessionAttributes().put(SESSION_KEY_SENDER_ID, chatMessage.getSenderId());
            if (chatMessage.getEmail() != null) {
                headerAccessor.getSessionAttributes().put(SESSION_KEY_EMAIL, chatMessage.getEmail());
            }
        }
        messagingTemplate.convertAndSend(TOPIC_ADMIN, chatMessage);
    }
}
