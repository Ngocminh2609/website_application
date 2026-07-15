package com.ecommerce.backend.util.payment;

import com.ecommerce.backend.util.crypto.HmacUtil;
import com.ecommerce.backend.util.money.MoneyUtil;
import com.ecommerce.backend.util.text.StringUtil;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

/**
 * Tiện ích xây dựng tham số / hash / verify theo chuẩn VNPay.
 */
public final class VNPayUtil {

    private static final String VNP_TIMEZONE = "Etc/GMT+7";
    private static final String VNP_DATE_PATTERN = "yyyyMMddHHmmss";
    private static final int DEFAULT_EXPIRE_MINUTES = 15;

    private static final String VERSION = "2.1.0";
    private static final String COMMAND_PAY = "pay";
    private static final String ORDER_TYPE = "other";
    private static final String CURR_CODE = "VND";
    private static final String LOCALE_VN = "vn";

    private VNPayUtil() {
    }

    public record EncodedParams(String hashData, String query) {
    }

    public record PaymentDates(String createDate, String expireDate) {
    }

    public static EncodedParams buildEncodedParams(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (StringUtil.hasText(fieldValue)) {
                String encodedKey = encode(fieldName);
                String encodedValue = encode(fieldValue);

                if (!hashData.isEmpty()) {
                    hashData.append('&');
                    query.append('&');
                }
                hashData.append(encodedKey).append('=').append(encodedValue);
                query.append(encodedKey).append('=').append(encodedValue);
            }
        }

        return new EncodedParams(hashData.toString(), query.toString());
    }

    public static String buildHashData(Map<String, String> params) {
        return buildEncodedParams(params).hashData();
    }

    /** Tạo createDate / expireDate theo múi giờ VNPay (GMT+7). */
    public static PaymentDates createPaymentDates() {
        return createPaymentDates(DEFAULT_EXPIRE_MINUTES);
    }

    public static PaymentDates createPaymentDates(int expireAfterMinutes) {
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone(VNP_TIMEZONE));
        SimpleDateFormat formatter = new SimpleDateFormat(VNP_DATE_PATTERN);
        String createDate = formatter.format(cld.getTime());
        cld.add(Calendar.MINUTE, expireAfterMinutes);
        String expireDate = formatter.format(cld.getTime());
        return new PaymentDates(createDate, expireDate);
    }

    /**
     * Xây dựng map tham số thanh toán VNPay chuẩn.
     */
    public static Map<String, String> buildPayParams(
            String tmnCode,
            BigDecimal totalAmount,
            String txnRef,
            Long orderId,
            String returnUrl,
            String ipAddress
    ) {
        long amountMinor = MoneyUtil.toMinorUnits(totalAmount);
        PaymentDates dates = createPaymentDates();

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", VERSION);
        params.put("vnp_Command", COMMAND_PAY);
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", String.valueOf(amountMinor));
        params.put("vnp_CurrCode", CURR_CODE);
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh toan don hang #" + orderId);
        params.put("vnp_OrderType", ORDER_TYPE);
        params.put("vnp_Locale", LOCALE_VN);
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", ipAddress);
        params.put("vnp_CreateDate", dates.createDate());
        params.put("vnp_ExpireDate", dates.expireDate());
        return params;
    }

    /**
     * Xác minh chữ ký callback: bỏ SecureHash khỏi fields rồi so khớp HMAC.
     */
    public static boolean verifySecureHash(Map<String, String> fields, String hashSecret, String receivedHash) {
        if (receivedHash == null) {
            return false;
        }
        String hashData = buildHashData(fields);
        String checkSum = HmacUtil.hmacSHA512(hashSecret, hashData);
        return checkSum.equalsIgnoreCase(receivedHash);
    }

    /**
     * Tạo payment URL đầy đủ (payUrl + query + secureHash).
     */
    public static String buildPaymentUrl(String payUrl, Map<String, String> params, String hashSecret) {
        EncodedParams encoded = buildEncodedParams(params);
        String secureHash = HmacUtil.hmacSHA512(hashSecret, encoded.hashData());
        return payUrl + "?" + encoded.query() + "&vnp_SecureHash=" + secureHash;
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }
}
