package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Notification;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.NotificationRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.ecommerce.backend.constant.service.NotificationServiceConstants.*;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Gửi thông báo cho một người dùng cụ thể (Real-time + DB).
     */
    @Transactional
    public void sendToUser(String userId, String message, Notification.NotificationType type) {
        Notification notification = Notification.builder()
                .recipientId(userId)
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        // 1. Lưu vào DB để quản lý trạng thái đọc
        notification = notificationRepository.save(notification);

        // 2. Đẩy qua WebSocket ngay lập tức (Real-time)
        // Lưu ý: User subscribe vào /topic/notifications/{userId}
        messagingTemplate.convertAndSend(TOPIC_NOTIFICATION_PREFIX + userId, notification);
    }

    /**
     * Phát thông báo cho TẤT CẢ người dùng (Broadcast).
     * Mỗi người dùng sẽ có một bản ghi riêng trong DB để quản lý trạng thái Đã đọc/Chưa đọc độc lập.
     */
    @Transactional
    public void broadcastToAll(String message) {
        List<User> allUsers = userRepository.findAll();

        // Tạo danh sách thông báo cho từng user
        List<Notification> notifications = allUsers.stream().map(user -> {
            String recipientId = (user.getRole().equals(ROLE_ADMIN)) ? RECIPIENT_ADMIN : RECIPIENT_USER_PREFIX + user.getId();
            return Notification.builder()
                    .recipientId(recipientId)
                    .message(message)
                    .type(Notification.NotificationType.SYSTEM)
                    .isRead(false)
                    .build();
        }).collect(Collectors.toList());

        // Lưu vào DB (Batch Insert)
        notificationRepository.saveAll(notifications);

        // Đẩy tin nhắn qua WebSocket cho từng người đang online
        for (Notification n : notifications) {
            messagingTemplate.convertAndSend(TOPIC_NOTIFICATION_PREFIX + n.getRecipientId(), n);
        }
    }

    /**
     * Lấy toàn bộ thông báo của một user (sắp xếp mới nhất lên đầu).
     */
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
