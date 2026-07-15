package com.ecommerce.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import static com.ecommerce.backend.constant.service.ProductViewerServiceConstants.*;

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
        if (oldProductId != null && !Objects.equals(oldProductId, productId)) {
            removeViewer(sessionId);
        }

        sessionProductMap.put(sessionId, productId);

        // Lấy hoặc tạo mới Set cho sản phẩm này
        Set<String> viewers = productViewers.computeIfAbsent(productId, k -> ConcurrentHashMap.newKeySet());

        boolean added = viewers.add(sessionId);
        if (added) {
            int currentCount = viewers.size();
            log.info(LOG_VIEWER_JOIN, productId, currentCount, sessionId);
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
                    log.info(LOG_VIEWER_LEAVE, productId, currentCount, sessionId);

                    if (currentCount == 0) {
                        productViewers.remove(productId);
                    }
                    broadcastViewerCount(productId, currentCount);
                }
            }
        }
    }

    private void broadcastViewerCount(Long productId, int count) {
        String destination = TOPIC_PRODUCT_PREFIX + productId + TOPIC_PRODUCT_SUFFIX;
        messagingTemplate.convertAndSend(destination, Map.of(
                KEY_PRODUCT_ID, productId,
                KEY_VIEWER_COUNT, count
        ));
    }
}
