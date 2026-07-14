package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    /**
     * Lấy lịch sử đơn hàng của người dùng.
     */
    @GetMapping("/user")
    public ResponseEntity<List<Order>> getOrdersByUser(@RequestParam String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        List<Order> orders = orderService.getOrdersByUserId(user.getId());
        return ResponseEntity.ok(orders);
    }

    /**
     * ADMIN: Lấy danh sách toàn bộ đơn hàng.
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * ADMIN: Cập nhật trạng thái đơn hàng (Ship, Hủy, v.v.).
     */
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }

    /**
     * ADMIN: Xóa đơn hàng.
     */
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Xóa đơn hàng thành công");
    }
}
