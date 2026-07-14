package com.ecommerce.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Configuration
public class VNPayConfig {

    @Getter
    @Value("${vnp.payUrl}")
    private String vnp_PayUrl;

    @Getter
    @Value("${vnp.returnUrl}")
    private String vnp_ReturnUrl;

    @Value("${vnp.tmnCode}")
    private String vnp_TmnCode;

    @Value("${vnp.hashSecret}")
    private String vnp_HashSecret;

    public String getVnp_TmnCode() {
        return vnp_TmnCode != null ? vnp_TmnCode.trim() : "";
    }

    public String getVnp_HashSecret() {
        return vnp_HashSecret != null ? vnp_HashSecret.trim() : "";
    }

    /*
     * Hàm tạo mã băm HMAC SHA512 để bảo mật dữ liệu truyền đi
     */
    public String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes(StandardCharsets.UTF_8);
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException ex) {
            return "";
        }
    }

    /*
     * Hàm lấy địa chỉ IP của người dùng thực hiện giao dịch
     */
    public String getIpAddress(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null || ipAddress.isEmpty()) {
                ipAddress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAddress = "127.0.0.1";
        }

        if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
            ipAddress = "127.0.0.1";
        }
        return ipAddress;
    }
}
