package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.PaymentTransactionRepository;
import com.ecommerce.backend.util.money.MoneyUtil;
import com.ecommerce.backend.util.notification.RecipientIdUtil;
import com.ecommerce.backend.util.persistence.EntityLookupUtil;
import com.ecommerce.backend.util.text.StringUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.ecommerce.backend.constant.domain.OrderStatusConstants.*;
import static com.ecommerce.backend.constant.domain.PaymentMethodConstants.METHOD_COD;
import static com.ecommerce.backend.constant.domain.PaymentMethodConstants.METHOD_VNPAY;
import static com.ecommerce.backend.constant.domain.VnPayConstants.VNP_RESPONSE_CODE_SUCCESS;
import static com.ecommerce.backend.constant.service.OrderServiceConstants.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final NotificationService notificationService;
    private final CouponService couponService;
    private final CartService cartService;

    @Transactional
    public Order createOrderFromCart(User user, String shippingAddress, String phoneNumber, String couponCode, String paymentMethod) {
        Cart cart = EntityLookupUtil.require(cartRepository.findByUserId(user.getId()), ERROR_CART_NOT_FOUND);

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException(ERROR_CART_EMPTY);
        }

        BigDecimal subtotal = cart.getItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discountAmount = BigDecimal.ZERO;
        String validatedCode = null;

        if (StringUtil.hasText(couponCode)) {
            try {
                var couponResult = couponService.validateCoupon(couponCode, subtotal);
                discountAmount = couponResult.getDiscountAmount();
                validatedCode = couponResult.getCode();
            } catch (Exception e) {
                throw new BadRequestException(ERROR_COUPON_INVALID_PREFIX + e.getMessage());
            }
        }

        BigDecimal totalAmount = MoneyUtil.clampNonNegative(subtotal.subtract(discountAmount));

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

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> OrderItem.builder()
                        .order(order)
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getProduct().getPrice())
                        .build())
                .collect(Collectors.toList());

        order.setItems(orderItems);

        if (METHOD_COD.equalsIgnoreCase(paymentMethod)) {
            cartService.clearCart(user.getId());
        }

        return orderRepository.save(order);
    }

    @Transactional
    public void processPaymentResponse(String txnRef, String responseCode, Map<String, String> allParams, String secureHash) {
        Long orderId = Long.parseLong(txnRef);
        Order order = EntityLookupUtil.require(
                orderRepository.findById(orderId),
                ERROR_ORDER_NOT_FOUND_PREFIX + txnRef
        );

        if (VNP_RESPONSE_CODE_SUCCESS.equals(responseCode)) {
            order.setStatus(STATUS_PAID);
            cartService.clearCart(order.getUser().getId());

            notificationService.sendToUser(
                    RecipientIdUtil.forUser(order.getUser().getId()),
                    MSG_PAID_PREFIX + order.getId() + MSG_PAID_SUFFIX,
                    Notification.NotificationType.ORDER
            );

            if (order.getAppliedCouponCode() != null) {
                try {
                    couponService.consumeCoupon(order.getAppliedCouponCode());
                } catch (Exception e) {
                    System.err.println(LOG_COUPON_CONSUME_FAILED + e.getMessage());
                }
            }
        } else {
            order.setStatus(STATUS_FAILED);
        }
        orderRepository.save(order);

        PaymentTransaction transaction = PaymentTransaction.builder()
                .order(order)
                .vnp_TxnRef(txnRef)
                .vnp_TransactionNo(allParams.get(VNP_KEY_TXN_NO))
                .vnp_ResponseCode(responseCode)
                .vnp_Amount(MoneyUtil.fromMinorUnits(allParams.get(VNP_KEY_AMOUNT)))
                .vnp_BankCode(allParams.get(VNP_KEY_BANK_CODE))
                .vnp_PayDate(allParams.get(VNP_KEY_PAY_DATE))
                .vnp_TransactionStatus(allParams.get(VNP_KEY_TXN_STATUS))
                .secureHash(secureHash)
                .rawData(allParams.toString())
                .build();

        transactionRepository.save(transaction);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        Order order = EntityLookupUtil.require(
                orderRepository.findById(orderId),
                ERROR_ORDER_NOT_FOUND_PREFIX + orderId
        );
        order.setStatus(status);
        orderRepository.save(order);

        String message = getStatusChangeMessage(order.getId(), status);
        notificationService.sendToUser(RecipientIdUtil.forUser(order.getUser().getId()), message, Notification.NotificationType.ORDER);
    }

    private String getStatusChangeMessage(Long orderId, String status) {
        return switch (status) {
            case STATUS_SHIPPING -> MSG_ORDER_PREFIX + orderId + MSG_SHIPPING_SUFFIX;
            case STATUS_DELIVERED -> MSG_DELIVERED_PREFIX + orderId + MSG_DELIVERED_SUFFIX;
            case STATUS_CANCELLED -> MSG_ORDER_PREFIX + orderId + MSG_CANCELLED_SUFFIX;
            default -> MSG_STATUS_UPDATE_PREFIX + orderId + MSG_STATUS_UPDATE_SEPARATOR + status;
        };
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new ResourceNotFoundException(ERROR_ORDER_DELETE_NOT_FOUND);
        }
        orderRepository.deleteById(orderId);
    }
}
