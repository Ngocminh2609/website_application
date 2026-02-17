package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {

    /**
     * Lấy lịch sử hội thoại giữa admin và một client dựa trên email hoặc senderId.
     */
    @Query("SELECT c FROM ChatMessageEntity c WHERE " +
           "(c.email = :clientKey OR c.senderId = :clientKey OR c.recipientId = :clientKey) " +
           "ORDER BY c.createdAt ASC")
    List<ChatMessageEntity> findChatHistory(@Param("clientKey") String clientKey);

    /**
     * Lấy danh sách các tin nhắn mới nhất để hiển thị thông báo offline.
     */
    List<ChatMessageEntity> findTop100ByOrderByCreatedAtDesc();
}
