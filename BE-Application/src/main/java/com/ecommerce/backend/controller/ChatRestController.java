package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ChatAiRequest;
import com.ecommerce.backend.dto.ChatAiResponse;
import com.ecommerce.backend.dto.ChatMessage;
import com.ecommerce.backend.service.ChatService;
import com.ecommerce.backend.service.GeminiAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatRestController {

    private final ChatService chatService;
    private final GeminiAiService geminiAiService;

    /**
     * Lấy lịch sử chat của một client cụ thể.
     */
    @GetMapping("/history/{clientKey}")
    public List<ChatMessage> getChatHistory(@PathVariable String clientKey) {
        return chatService.getChatHistory(clientKey);
    }

    /**
     * NovaBot: sinh câu trả lời AI (public — guest cũng dùng được).
     */
    @PostMapping("/ai")
    public ChatAiResponse askAi(@Valid @RequestBody ChatAiRequest request) {
        GeminiAiService.AiResult result = geminiAiService.generateReply(request.getMessage());
        return new ChatAiResponse(
                result.getReply(),
                result.isEscalate(),
                result.isHandoff(),
                result.getError()
        );
    }
}
