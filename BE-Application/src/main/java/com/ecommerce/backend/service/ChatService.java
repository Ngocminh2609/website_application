package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ChatMessage;
import com.ecommerce.backend.entity.ChatMessageEntity;
import com.ecommerce.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

import static com.ecommerce.backend.constant.service.ChatServiceConstants.*;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    @Transactional
    public ChatMessage saveMessage(ChatMessage chatMessage) {
        ChatMessageEntity entity = ChatMessageEntity.builder()
                .messageKey(chatMessage.getMessageKey())
                .sender(chatMessage.getSender())
                .senderId(chatMessage.getSenderId())
                .recipientId(chatMessage.getRecipientId())
                .content(chatMessage.getContent())
                .type(chatMessage.getType().name())
                .email(chatMessage.getEmail())
                .fullName(chatMessage.getFullName())
                .isBotResponse(chatMessage.getIsBotResponse())
                .recalled(false)
                .build();

        ChatMessageEntity saved = chatMessageRepository.save(entity);
        return convertToDto(saved);
    }

    @Transactional
    public ChatMessage editMessage(ChatMessage editRequest) {
        if (!StringUtils.hasText(editRequest.getContent())) {
            throw new IllegalArgumentException(ERROR_EMPTY);
        }
        ChatMessageEntity entity = loadMutableMessage(
                editRequest.getMessageKey(),
                editRequest.getSenderId()
        );
        entity.setContent(editRequest.getContent().trim());
        ChatMessageEntity saved = chatMessageRepository.save(entity);
        return toRoutedDto(saved, editRequest, ChatMessage.MessageType.EDIT);
    }

    @Transactional
    public ChatMessage recallMessage(ChatMessage recallRequest) {
        ChatMessageEntity entity = loadMutableMessage(
                recallRequest.getMessageKey(),
                recallRequest.getSenderId()
        );
        entity.setRecalled(true);
        entity.setContent(RECALLED_CONTENT);
        ChatMessageEntity saved = chatMessageRepository.save(entity);
        return toRoutedDto(saved, recallRequest, ChatMessage.MessageType.RECALL);
    }

    public List<ChatMessage> getChatHistory(String clientKey) {
        return chatMessageRepository.findChatHistory(clientKey).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ChatMessageEntity loadMutableMessage(String messageKey, String senderId) {
        if (!StringUtils.hasText(messageKey)) {
            throw new IllegalArgumentException(ERROR_NOT_FOUND);
        }
        ChatMessageEntity entity = chatMessageRepository
                .findByMessageKey(messageKey)
                .orElseThrow(() -> new IllegalArgumentException(ERROR_NOT_FOUND));

        if (!"CHAT".equals(entity.getType())) {
            throw new IllegalArgumentException(ERROR_NOT_CHAT);
        }
        if (Boolean.TRUE.equals(entity.getRecalled())) {
            throw new IllegalArgumentException(ERROR_ALREADY_RECALLED);
        }
        if (!entity.getSenderId().equals(senderId)) {
            throw new IllegalArgumentException(ERROR_FORBIDDEN);
        }
        LocalDateTime created = entity.getCreatedAt();
        if (created == null || created.isBefore(LocalDateTime.now().minusHours(EDIT_WINDOW_HOURS))) {
            throw new IllegalArgumentException(ERROR_EXPIRED);
        }
        return entity;
    }

    private ChatMessage toRoutedDto(
            ChatMessageEntity saved,
            ChatMessage request,
            ChatMessage.MessageType type
    ) {
        ChatMessage dto = convertToDto(saved);
        dto.setType(type);
        // Giữ recipientId từ DB (tin admin→client); request chỉ bổ sung nếu DB trống
        if (!StringUtils.hasText(dto.getRecipientId()) && StringUtils.hasText(request.getRecipientId())) {
            dto.setRecipientId(request.getRecipientId());
        }
        if (!StringUtils.hasText(dto.getEmail()) && StringUtils.hasText(request.getEmail())) {
            dto.setEmail(request.getEmail());
        }
        if (!StringUtils.hasText(dto.getFullName()) && StringUtils.hasText(request.getFullName())) {
            dto.setFullName(request.getFullName());
        }
        return dto;
    }

    private ChatMessage convertToDto(ChatMessageEntity entity) {
        Long createdAtMs = null;
        if (entity.getCreatedAt() != null) {
            createdAtMs = entity.getCreatedAt()
                    .atZone(ZoneId.systemDefault())
                    .toInstant()
                    .toEpochMilli();
        }
        boolean recalled = Boolean.TRUE.equals(entity.getRecalled());
        boolean edited = entity.getUpdatedAt() != null && !recalled;

        return ChatMessage.builder()
                .id(entity.getId())
                .messageKey(entity.getMessageKey())
                .sender(entity.getSender())
                .senderId(entity.getSenderId())
                .recipientId(entity.getRecipientId())
                .content(entity.getContent())
                .type(ChatMessage.MessageType.CHAT)
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .isBotResponse(entity.getIsBotResponse())
                .createdAt(createdAtMs)
                .edited(edited)
                .recalled(recalled)
                .build();
    }
}
