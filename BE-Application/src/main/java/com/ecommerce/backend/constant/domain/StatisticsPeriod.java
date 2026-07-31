package com.ecommerce.backend.constant.domain;

import lombok.Getter;

/**
 * Kỳ thống kê doanh thu — whitelist format DATE_FORMAT để tránh SQL injection.
 */
@Getter
public enum StatisticsPeriod {
    DAY("%Y-%m-%d"),
    WEEK("%Y-W%v"),
    MONTH("%Y-%m"),
    YEAR("%Y");

    private final String dateFormat;

    StatisticsPeriod(String dateFormat) {
        this.dateFormat = dateFormat;
    }

}
