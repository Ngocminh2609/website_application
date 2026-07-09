package com.ecommerce.backend.listener;

import com.ecommerce.backend.service.ProductViewerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * Lắng nghe các sự kiện WebSocket để xử lý dọn dẹp dữ liệu.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final ProductViewerService productViewerService;

    /**
     * Tự động xóa người xem khi họ ngắt kết nối WebSocket (đóng tab, mất mạng, v.v.)
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        
        if (sessionId != null) {
            log.info("[VIEWER-SYSTEM] Ngắt kết nối socket: {}", sessionId);
            productViewerService.removeViewer(sessionId);
        }
    }
}
