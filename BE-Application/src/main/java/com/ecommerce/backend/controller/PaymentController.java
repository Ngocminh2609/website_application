package com.ecommerce.backend.controller;

import com.ecommerce.backend.config.VNPayConfig;
import com.ecommerce.backend.dto.PaymentResponse;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URLEncoder; // Keep this as it's used
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.ecommerce.backend.constant.controller.PaymentConstants.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayConfig vnPayConfig;
    private final OrderService orderService;
    private final UserRepository userRepository;

    /**
     * Endpoint mới: Tạo đơn hàng và lấy link thanh toán VNPay
     */
    @PostMapping("/create-order-payment")
    public ResponseEntity<?> createOrderPayment(
            HttpServletRequest request,
            @RequestParam("username") String username,
            @RequestParam("shippingAddress") String shippingAddress,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam(value = "couponCode", required = false) String couponCode,
            @RequestParam(value = "paymentMethod", defaultValue = METHOD_VNPAY) String paymentMethod
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(ERROR_USER_NOT_FOUND));

        // 1. Tạo đơn hàng trong DB (Trạng thái PENDING)
        Order order = orderService.createOrderFromCart(user, shippingAddress, phoneNumber, couponCode, paymentMethod);

        String vnp_TxnRef = String.valueOf(order.getId());
        long amountWithVnd = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

        // Nếu là COD, trả về thông báo thành công kèm thông tin đơn hàng
        if (METHOD_COD.equalsIgnoreCase(paymentMethod)) {
            return ResponseEntity.ok(PaymentResponse.builder()
                    .status(STATUS_OK)
                    .message(MSG_COD_SUCCESS)
                    .url("ORDER_ID=" + vnp_TxnRef + "&AMOUNT=" + amountWithVnd)
                    .build());
        }

        // 2. Chuẩn bị tham số VNPay (Nếu là VNPAY)
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        String vnp_IpAddr = vnPayConfig.getIpAddress(request);
        String vnp_TmnCode = vnPayConfig.getVnp_TmnCode();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amountWithVnd));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang #" + order.getId());
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnp_ReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Logic băm chuỗi truyền đi
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                String encodedKey = URLEncoder.encode(fieldName, StandardCharsets.UTF_8).replace("+", "%20");
                String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8).replace("+", "%20");

                if (!hashData.isEmpty()) {
                    hashData.append('&');
                    query.append('&');
                }
                hashData.append(encodedKey).append('=').append(encodedValue);
                query.append(encodedKey).append('=').append(encodedValue);
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getVnp_HashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;

        return ResponseEntity.ok(PaymentResponse.builder()
                .status(STATUS_OK)
                .message(MSG_VNPAY_INIT_SUCCESS)
                .url(paymentUrl)
                .build());
    }

    @GetMapping("/vnpay-callback")
    public ResponseEntity<?> payCallbackHandler(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter(VNP_SECURE_HASH);
        fields.remove(VNP_SECURE_HASH_TYPE);
        fields.remove(VNP_SECURE_HASH);

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                String encodedKey = URLEncoder.encode(fieldName, StandardCharsets.UTF_8).replace("+", "%20");
                String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8).replace("+", "%20");

                if (!hashData.isEmpty()) {
                    hashData.append('&');
                }
                hashData.append(encodedKey).append('=').append(encodedValue);
            }
        }

        String checkSum = vnPayConfig.hmacSHA512(vnPayConfig.getVnp_HashSecret(), hashData.toString());
        String responseCode = request.getParameter(VNP_RESPONSE_CODE);
        String txnRef = request.getParameter(VNP_TXN_REF);

        if (checkSum.equalsIgnoreCase(vnp_SecureHash)) {
            // Cập nhật trạng thái đơn hàng và lưu giao dịch vào DB
            orderService.processPaymentResponse(txnRef, responseCode, fields, vnp_SecureHash);

            if ("00".equals(responseCode)) {
                return ResponseEntity.status(HttpStatus.OK).body(
                        PaymentResponse.builder().status(STATUS_OK).message(MSG_PAYMENT_SUCCESS).build()
                );
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        PaymentResponse.builder().status(STATUS_FAILED).message(MSG_PAYMENT_FAILED).build()
                );
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    PaymentResponse.builder().status(STATUS_FAILED).message(MSG_INVALID_SIGNATURE).build()
            );
        }
    }

    @GetMapping("/create-payment")
    @Deprecated // Giữ lại cho tương thích ngược nếu cần, nên chuyển sang /create-order-payment
    public ResponseEntity<?> createPayment() {
        // Trả về OK hoặc chuyển hướng nếu cần
        return ResponseEntity.ok().build();
    }
}
