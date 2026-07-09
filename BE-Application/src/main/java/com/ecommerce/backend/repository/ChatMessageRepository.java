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
    @Query(value = """
            SELECT * FROM chat_messages c
            WHERE (c.email = :clientKey OR c.sender_id = :clientKey OR c.recipient_id = :clientKey)
            ORDER BY c.created_at
            """, nativeQuery = true)
    List<ChatMessageEntity> findChatHistory(@Param("clientKey") String clientKey);

}
