package com.ecommerce.backend.util.crypto;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

/**
 * Tiện ích mã hóa HMAC dùng chung (VNPay và các tích hợp khác).
 */
public final class HmacUtil {

    private static final String HMAC_SHA512 = "HmacSHA512";

    private HmacUtil() {
    }

    /**
     * Tạo mã băm HMAC-SHA512 để bảo mật dữ liệu truyền đi.
     *
     * @return chuỗi hex lowercase; trả về rỗng nếu thuật toán/khóa không hợp lệ
     */
    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException("key and data must not be null");
            }
            final Mac hmac512 = Mac.getInstance(HMAC_SHA512);
            byte[] hmacKeyBytes = key.getBytes(StandardCharsets.UTF_8);
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, HMAC_SHA512);
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException ex) {
            return "";
        }
    }
}
