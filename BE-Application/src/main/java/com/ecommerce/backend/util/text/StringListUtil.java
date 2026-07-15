package com.ecommerce.backend.util.text;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Tiện ích tách chuỗi phân cách thành danh sách đã trim.
 */
public final class StringListUtil {

    private StringListUtil() {
    }

    /**
     * Tách theo delimiter, trim từng phần, bỏ phần rỗng.
     * Trả về list rỗng nếu value null/blank.
     */
    public static List<String> splitAndTrim(String value, String delimiter) {
        if (StringUtil.isBlank(value)) {
            return Collections.emptyList();
        }
        return Arrays.stream(value.split(delimiter))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
