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

import static com.ecommerce.backend.constant.service.OrderServiceConstants.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final NotificationService notificationService;
    private final CouponService couponService;

    /**
     * Tạo đơn hàng từ giỏ hàng hiện tại của người dùng.
     */
    @Transactional
    public Order createOrderFromCart(User user, String shippingAddress, String phoneNumber, String couponCode, String paymentMethod) {
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException(ERROR_CART_NOT_FOUND));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException(ERROR_CART_EMPTY);
        }

        // Tính tổng tiền sản phẩm (chưa giảm giá)
        BigDecimal subtotal = cart.getItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discountAmount = BigDecimal.ZERO;
        String validatedCode = null;

        // Xử lý mã giảm giá nếu có
        if (couponCode != null && !couponCode.trim().isEmpty()) {
            try {
                var couponResult = couponService.validateCoupon(couponCode, subtotal);
                discountAmount = couponResult.getDiscountAmount();
                validatedCode = couponResult.getCode();
            } catch (Exception e) {
                // Nếu lỗi validate, có thể ném exception hoặc bỏ qua coupon. Ở đây ta ném exception để user biết.
                throw new RuntimeException(ERROR_COUPON_INVALID_PREFIX + e.getMessage());
            }
        }

        BigDecimal totalAmount = subtotal.subtract(discountAmount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) totalAmount = BigDecimal.ZERO;

        // Tạo Order
        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status(STATUS_PENDING)
                .shippingAddress(shippingAddress)
                .phoneNumber(phoneNumber)
                .paymentMethod(paymentMethod != null ? paymentMethod : METHOD_VNPAY)
                .appliedCouponCode(validatedCode)
                .couponDiscount(discountAmount)
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

        // Xóa giỏ hàng luôn nếu là COD
        if (METHOD_COD.equalsIgnoreCase(paymentMethod)) {
            clearCart(user.getId());
        }

        return orderRepository.save(order);
    }

    /**
     * Xóa giỏ hàng của người dùng.
     */
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
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
                .orElseThrow(() -> new RuntimeException(ERROR_ORDER_NOT_FOUND_PREFIX + txnRef));

        // 1. Cập nhật trạng thái đơn hàng
        if (VNP_RESPONSE_CODE_SUCCESS.equals(responseCode)) {
            order.setStatus(STATUS_PAID);

            // Xóa giỏ hàng của người dùng khi thanh toán thành công
            clearCart(order.getUser().getId());

            // Gửi thông báo cho khách hàng
            notificationService.sendToUser(
                    RECIPIENT_USER_PREFIX + order.getUser().getId(),
                    MSG_PAID_PREFIX + order.getId() + MSG_PAID_SUFFIX,
                    Notification.NotificationType.ORDER
            );

            // 3. Tiêu hao mã giảm giá nếu có
            if (order.getAppliedCouponCode() != null) {
                try {
                    couponService.consumeCoupon(order.getAppliedCouponCode());
                } catch (Exception e) {
                    System.err.println(LOG_COUPON_CONSUME_FAILED + e.getMessage());
                    // Không ném exception ở đây để tránh rollback nghiệp vụ chính là thanh toán
                }
            }
        } else {
            order.setStatus(STATUS_FAILED);
        }
        orderRepository.save(order);

        // 2. Lưu lịch sử giao dịch
        PaymentTransaction transaction = PaymentTransaction.builder()
                .order(order)
                .vnp_TxnRef(txnRef)
                .vnp_TransactionNo(allParams.get(VNP_KEY_TXN_NO))
                .vnp_ResponseCode(responseCode)
                .vnp_Amount(new BigDecimal(allParams.get(VNP_KEY_AMOUNT)).divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP))
                .vnp_BankCode(allParams.get(VNP_KEY_BANK_CODE))
                .vnp_PayDate(allParams.get(VNP_KEY_PAY_DATE))
                .vnp_TransactionStatus(allParams.get(VNP_KEY_TXN_STATUS))
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
                .orElseThrow(() -> new RuntimeException(ERROR_ORDER_NOT_FOUND_PREFIX + orderId));
        order.setStatus(status);
        orderRepository.save(order);

        // Gửi thông báo cho khách hàng về thay đổi trạng thái
        String message = getStatusChangeMessage(order.getId(), status);
        notificationService.sendToUser(RECIPIENT_USER_PREFIX + order.getUser().getId(), message, Notification.NotificationType.ORDER);
    }

    private String getStatusChangeMessage(Long orderId, String status) {
        return switch (status) {
            case STATUS_SHIPPING -> MSG_ORDER_PREFIX + orderId + MSG_SHIPPING_SUFFIX;
            case STATUS_DELIVERED -> MSG_DELIVERED_PREFIX + orderId + MSG_DELIVERED_SUFFIX;
            case STATUS_CANCELLED -> MSG_ORDER_PREFIX + orderId + MSG_CANCELLED_SUFFIX;
            default -> MSG_STATUS_UPDATE_PREFIX + orderId + MSG_STATUS_UPDATE_SEPARATOR + status;
        };
    }

    /**
     * Xóa đơn hàng khỏi hệ thống.
     */
    @Transactional
    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new RuntimeException(ERROR_ORDER_DELETE_NOT_FOUND);
        }
        orderRepository.deleteById(orderId);
    }
}
