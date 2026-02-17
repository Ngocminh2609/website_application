package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ChatMessage;
import com.ecommerce.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatRestController {

    private final ChatService chatService;

    /**
     * Lấy lịch sử chat của một client cụ thể.
     */
    @GetMapping("/history/{clientKey}")
    public List<ChatMessage> getChatHistory(@PathVariable String clientKey) {
        return chatService.getChatHistory(clientKey);
    }
}
