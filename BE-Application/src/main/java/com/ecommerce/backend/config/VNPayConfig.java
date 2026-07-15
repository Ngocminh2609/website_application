package com.ecommerce.backend.config;

import com.ecommerce.backend.util.text.StringUtil;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Cấu hình thuộc tính VNPay từ application properties.
 * Logic mã hóa / IP / query nằm ở package {@code util}.
 */
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
        return StringUtil.trimToEmpty(vnp_TmnCode);
    }

    public String getVnp_HashSecret() {
        return StringUtil.trimToEmpty(vnp_HashSecret);
    }
}
