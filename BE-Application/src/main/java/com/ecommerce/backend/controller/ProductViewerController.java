package com.ecommerce.backend.controller;

import com.ecommerce.backend.service.ProductViewerService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

/**
 * Controller xử lý các sự kiện người dùng xem sản phẩm qua WebSocket.
 */
@Controller
@RequiredArgsConstructor
public class ProductViewerController {

    private final ProductViewerService productViewerService;

    /**
     * Thông báo rằng người dùng đã vào trang chi tiết sản phẩm.
     *
     * @param productId      ID sản phẩm
     * @param headerAccessor Header để lấy sessionId
     */
    @MessageMapping("/product/{productId}/view")
    public void startViewing(@DestinationVariable Long productId, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        if (sessionId != null) {
            productViewerService.addViewer(productId, sessionId);
        }
    }
}
