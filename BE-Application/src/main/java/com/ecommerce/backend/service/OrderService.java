package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final NotificationService notificationService;

    /**
     * Tạo đơn hàng từ giỏ hàng hiện tại của người dùng.
     */
    @Transactional
    public Order createOrderFromCart(User user, String shippingAddress, String phoneNumber) {
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng!"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống!");
        }

        // Tính tổng tiền
        BigDecimal totalAmount = cart.getItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tạo Order
        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status("PENDING")
                .shippingAddress(shippingAddress)
                .phoneNumber(phoneNumber)
                .paymentMethod("VNPAY")
                .build();

        // Chuyển CartItem sang OrderItem
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> OrderItem.builder()
                        .order(order)
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getProduct().getPrice())
                        .build())
                .collect(Collectors.toList());

        order.setItems(orderItems);

        // Xóa giỏ hàng sau khi tạo đơn hàng (hoặc có thể để dành xóa sau khi thanh toán thành công)
        // Ở đây tôi chọn xóa sau khi thanh toán thành công để an toàn.
        
        return orderRepository.save(order);
    }

    /**
     * Cập nhật trạng thái đơn hàng và ghi nhận giao dịch.
     */
    @Transactional
    public void processPaymentResponse(String txnRef, String responseCode, Map<String, String> allParams, String secureHash) {
        // txnRef trong VNPay demo của chúng ta đang là số ngẫu nhiên 8 chữ số
        // Trong thực tế, nó nên là Order ID của hệ thống.
        // Giả sử txnRef chính là Order ID.
        Long orderId = Long.parseLong(txnRef);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + txnRef));

        // 1. Cập nhật trạng thái đơn hàng
        if ("00".equals(responseCode)) {
            order.setStatus("PAID");
            
            // Xóa giỏ hàng của người dùng khi thanh toán thành công
            cartRepository.findByUserId(order.getUser().getId()).ifPresent(cart -> {
                cart.getItems().clear();
                cartRepository.save(cart);
            });

            // Gửi thông báo cho khách hàng
            notificationService.sendToUser(
                "user-" + order.getUser().getId(),
                "Thanh toán thành công đơn hàng #" + order.getId() + ". Chúng tôi sẽ sớm giao hàng cho bạn!",
                Notification.NotificationType.ORDER
            );
        } else {
            order.setStatus("FAILED");
        }
        orderRepository.save(order);

        // 2. Lưu lịch sử giao dịch
        PaymentTransaction transaction = PaymentTransaction.builder()
                .order(order)
                .vnp_TxnRef(txnRef)
                .vnp_TransactionNo(allParams.get("vnp_TransactionNo"))
                .vnp_ResponseCode(responseCode)
                .vnp_Amount(new BigDecimal(allParams.get("vnp_Amount")).divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP))
                .vnp_BankCode(allParams.get("vnp_BankCode"))
                .vnp_PayDate(allParams.get("vnp_PayDate"))
                .vnp_TransactionStatus(allParams.get("vnp_TransactionStatus"))
                .secureHash(secureHash)
                .rawData(allParams.toString())
                .build();
        
        transactionRepository.save(transaction);
    }

    /**
     * Lấy danh sách đơn hàng của người dùng.
     */
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }
    /**
     * Lấy danh sách toàn bộ đơn hàng (Cho Admin).
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Cập nhật trạng thái đơn hàng thủ công (Hủy, Ship, v.v.).
     */
    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));
        order.setStatus(status);
        orderRepository.save(order);

        // Gửi thông báo cho khách hàng về thay đổi trạng thái
        String message = getStatusChangeMessage(order.getId(), status);
        notificationService.sendToUser("user-" + order.getUser().getId(), message, Notification.NotificationType.ORDER);
    }

    private String getStatusChangeMessage(Long orderId, String status) {
        switch (status) {
            case "SHIPPING": return "Đơn hàng #" + orderId + " đang trên đường giao đến bạn.";
            case "DELIVERED": return "Chúc mừng! Đơn hàng #" + orderId + " đã được giao thành công.";
            case "CANCELLED": return "Đơn hàng #" + orderId + " đã bị hủy.";
            default: return "Cập nhật trạng thái mới cho đơn hàng #" + orderId + ": " + status;
        }
    }

    /**
     * Xóa đơn hàng khỏi hệ thống.
     */
    @Transactional
    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new RuntimeException("Không tìm thấy đơn hàng để xóa");
        }
        orderRepository.deleteById(orderId);
    }
}
