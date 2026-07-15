package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Notification;
import com.ecommerce.backend.service.NotificationService;
import com.ecommerce.backend.util.text.StringUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Lấy toàn bộ thông báo của một người dùng.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    /**
     * Đánh dấu một thông báo đã đọc.
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Đánh dấu tất cả thông báo của người dùng đã đọc.
     */
    @PutMapping("/read-all/{userId}")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * ADMIN: Tạo thông báo hệ thống gửi cho TẤT CẢ người dùng.
     */
    @PostMapping("/broadcast")
    public ResponseEntity<Void> broadcastNotification(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        if (StringUtil.hasText(message)) {
            notificationService.broadcastToAll(message);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
