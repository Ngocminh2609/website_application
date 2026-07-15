package com.ecommerce.backend.util.http;

import com.ecommerce.backend.util.text.StringUtil;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Tiện ích lấy địa chỉ IP client từ HTTP request.
 */
public final class IpAddressUtil {

    private static final String HEADER_X_FORWARDED_FOR = "X-FORWARDED-FOR";
    private static final String LOCALHOST_IPV4 = "127.0.0.1";
    private static final String LOCALHOST_IPV6 = "0:0:0:0:0:0:0:1";

    private IpAddressUtil() {
    }

    /**
     * Lấy IP thực của client (ưu tiên X-Forwarded-For khi đi qua proxy/load balancer).
     */
    public static String getClientIp(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader(HEADER_X_FORWARDED_FOR);
            if (StringUtil.isBlank(ipAddress)) {
                ipAddress = request.getRemoteAddr();
            } else {
                // X-Forwarded-For có thể chứa nhiều IP: client, proxy1, proxy2...
                int commaIndex = ipAddress.indexOf(',');
                if (commaIndex > 0) {
                    ipAddress = ipAddress.substring(0, commaIndex).trim();
                }
            }
        } catch (Exception e) {
            ipAddress = LOCALHOST_IPV4;
        }

        if (LOCALHOST_IPV6.equals(ipAddress)) {
            ipAddress = LOCALHOST_IPV4;
        }
        return ipAddress;
    }
}
