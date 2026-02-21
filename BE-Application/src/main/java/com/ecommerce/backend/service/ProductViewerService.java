package com.ecommerce.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service quản lý số lượng người đang xem sản phẩm theo thời gian thực.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ProductViewerService {

    private final SimpMessagingTemplate messagingTemplate;

    // Map: ProductId -> Tập hợp các SessionId đang xem (Set giúp loại bỏ đếm lặp)
    private final Map<Long, Set<String>> productViewers = new ConcurrentHashMap<>();
    
    // Map: SessionId -> ProductId để dọn dẹp khi ngắt kết nối
    private final Map<String, Long> sessionProductMap = new ConcurrentHashMap<>();

    /**
     * Thêm người xem mới.
     * Sử dụng Set.add() nên nếu sessionId đã tồn tại sẽ không bị đếm tăng lên.
     */
    public void addViewer(Long productId, String sessionId) {
        // Kiểm tra nếu session này đang xem sản phẩm khác, hãy xóa ở đó trước
        Long oldProductId = sessionProductMap.get(sessionId);
        if (oldProductId != null && !oldProductId.equals(productId)) {
            removeViewer(sessionId);
        }

        sessionProductMap.put(sessionId, productId);
        
        // Lấy hoặc tạo mới Set cho sản phẩm này
        Set<String> viewers = productViewers.computeIfAbsent(productId, k -> ConcurrentHashMap.newKeySet());
        
        boolean added = viewers.add(sessionId);
        if (added) {
            int currentCount = viewers.size();
            log.info("[VIEWER-SYSTEM] +++ Người mới vào xem SP {}. Tổng thực tế: {} (Session: {})", productId, currentCount, sessionId);
            broadcastViewerCount(productId, currentCount);
        }
    }

    /**
     * Xóa người xem.
     */
    public void removeViewer(String sessionId) {
        Long productId = sessionProductMap.remove(sessionId);
        if (productId != null) {
            Set<String> viewers = productViewers.get(productId);
            if (viewers != null) {
                boolean removed = viewers.remove(sessionId);
                if (removed) {
                    int currentCount = viewers.size();
                    log.info("[VIEWER-SYSTEM] --- Người rời khỏi SP {}. Còn lại: {} (Session: {})", productId, currentCount, sessionId);
                    
                    if (currentCount <= 0) {
                        productViewers.remove(productId);
                    }
                    broadcastViewerCount(productId, currentCount);
                }
            }
        }
    }

    public int getViewerCount(Long productId) {
        Set<String> viewers = productViewers.get(productId);
        return viewers != null ? viewers.size() : 0;
    }

    private void broadcastViewerCount(Long productId, int count) {
        String destination = "/topic/product/" + productId + "/viewers";
        messagingTemplate.convertAndSend(destination, Map.of(
            "productId", productId,
            "viewerCount", count
        ));
    }
}
