package com.ecommerce.backend.controller;

import com.ecommerce.backend.config.VNPayConfig;
import com.ecommerce.backend.dto.PaymentResponse;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.CurrentUser;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.util.http.HttpRequestUtil;
import com.ecommerce.backend.util.http.IpAddressUtil;
import com.ecommerce.backend.util.money.MoneyUtil;
import com.ecommerce.backend.util.payment.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.ecommerce.backend.constant.controller.PaymentConstants.*;
import static com.ecommerce.backend.constant.domain.PaymentMethodConstants.METHOD_COD;
import static com.ecommerce.backend.constant.domain.PaymentMethodConstants.METHOD_VNPAY;
import static com.ecommerce.backend.constant.domain.VnPayConstants.VNP_RESPONSE_CODE_SUCCESS;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayConfig vnPayConfig;
    private final OrderService orderService;

    @PostMapping("/create-order-payment")
    public ResponseEntity<?> createOrderPayment(
            HttpServletRequest request,
            @CurrentUser User user,
            @RequestParam("shippingAddress") String shippingAddress,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam(value = "couponCode", required = false) String couponCode,
            @RequestParam(value = "paymentMethod", defaultValue = METHOD_VNPAY) String paymentMethod
    ) {
        Order order = orderService.createOrderFromCart(user, shippingAddress, phoneNumber, couponCode, paymentMethod);

        String vnp_TxnRef = String.valueOf(order.getId());
        long amountWithVnd = MoneyUtil.toMinorUnits(order.getTotalAmount());

        if (METHOD_COD.equalsIgnoreCase(paymentMethod)) {
            return ResponseEntity.ok(PaymentResponse.ok(
                    MSG_COD_SUCCESS,
                    "ORDER_ID=" + vnp_TxnRef + "&amount=" + amountWithVnd
            ));
        }

        Map<String, String> vnp_Params = VNPayUtil.buildPayParams(
                vnPayConfig.getVnp_TmnCode(),
                order.getTotalAmount(),
                vnp_TxnRef,
                order.getId(),
                vnPayConfig.getVnp_ReturnUrl(),
                IpAddressUtil.getClientIp(request)
        );

        String paymentUrl = VNPayUtil.buildPaymentUrl(
                vnPayConfig.getVnp_PayUrl(),
                vnp_Params,
                vnPayConfig.getVnp_HashSecret()
        );

        return ResponseEntity.ok(PaymentResponse.ok(MSG_VNPAY_INIT_SUCCESS, paymentUrl));
    }

    @GetMapping("/vnpay-callback")
    public ResponseEntity<?> payCallbackHandler(HttpServletRequest request) {
        Map<String, String> fields = HttpRequestUtil.toParameterMap(request);

        String vnp_SecureHash = request.getParameter(VNP_SECURE_HASH);
        fields.remove(VNP_SECURE_HASH_TYPE);
        fields.remove(VNP_SECURE_HASH);

        String responseCode = request.getParameter(VNP_RESPONSE_CODE);
        String txnRef = request.getParameter(VNP_TXN_REF);

        if (VNPayUtil.verifySecureHash(fields, vnPayConfig.getVnp_HashSecret(), vnp_SecureHash)) {
            orderService.processPaymentResponse(txnRef, responseCode, fields, vnp_SecureHash);

            if (VNP_RESPONSE_CODE_SUCCESS.equals(responseCode)) {
                return ResponseEntity.status(HttpStatus.OK).body(PaymentResponse.ok(MSG_PAYMENT_SUCCESS));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(PaymentResponse.failed(MSG_PAYMENT_FAILED));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(PaymentResponse.failed(MSG_INVALID_SIGNATURE));
    }

    @GetMapping("/create-payment")
    @Deprecated
    public ResponseEntity<?> createPayment() {
        return ResponseEntity.ok().build();
    }
}
