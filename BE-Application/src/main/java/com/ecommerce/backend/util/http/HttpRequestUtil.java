package com.ecommerce.backend.util.http;

import com.ecommerce.backend.util.text.StringUtil;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * Tiện ích đọc dữ liệu từ HttpServletRequest.
 */
public final class HttpRequestUtil {

    private HttpRequestUtil() {
    }

    /**
     * Gom toàn bộ query/form params không rỗng thành Map.
     */
    public static Map<String, String> toParameterMap(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (StringUtil.hasText(fieldValue)) {
                fields.put(fieldName, fieldValue);
            }
        }
        return fields;
    }
}
