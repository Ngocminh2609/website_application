package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String recipientId; // ID của người nhận (User ID hoặc "admin")
    
    private String message;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    
    @JsonProperty("isRead")
    private boolean isRead = false;
    
    private LocalDateTime createdAt;
    
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
    
    public enum NotificationType {
        MESSAGE, ORDER, SYSTEM
    }
}
