package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ChatMessage;
import com.ecommerce.backend.entity.ChatMessageEntity;
import com.ecommerce.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    /**
     * Lưu tin nhắn vào Database.
     */
    @Transactional
    public void saveMessage(ChatMessage chatMessage) {
        ChatMessageEntity entity = ChatMessageEntity.builder()
                .sender(chatMessage.getSender())
                .senderId(chatMessage.getSenderId())
                .recipientId(chatMessage.getRecipientId())
                .content(chatMessage.getContent())
                .type(chatMessage.getType().name())
                .email(chatMessage.getEmail())
                .fullName(chatMessage.getFullName())
                .isBotResponse(chatMessage.getIsBotResponse())
                .build();

        chatMessageRepository.save(entity);
    }

    /**
     * Lấy lịch sử chat của một khách hàng cụ thể.
     */
    public List<ChatMessage> getChatHistory(String clientKey) {
        return chatMessageRepository.findChatHistory(clientKey).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Chuyển đổi từ Entity sang DTO để gửi về FE.
     */
    private ChatMessage convertToDto(ChatMessageEntity entity) {
        return ChatMessage.builder()
                .sender(entity.getSender())
                .senderId(entity.getSenderId())
                .recipientId(entity.getRecipientId())
                .content(entity.getContent())
                .type(ChatMessage.MessageType.valueOf(entity.getType()))
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .isBotResponse(entity.getIsBotResponse())
                .build();
    }
}
