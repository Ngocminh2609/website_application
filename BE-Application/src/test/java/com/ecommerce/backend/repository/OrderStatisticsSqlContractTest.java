package com.ecommerce.backend.repository;

import com.ecommerce.backend.constant.domain.OrderStatusConstants;
import com.ecommerce.backend.constant.domain.StatisticsPeriod;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Kiểm chứng whitelist format và status SQL dùng chung — không cần DB.
 */
class OrderStatisticsSqlContractTest {

    @Test
    void statisticsPeriod_exposesWhitelistFormatsOnly() {
        assertThat(StatisticsPeriod.DAY.getDateFormat()).isEqualTo("%Y-%m-%d");
        assertThat(StatisticsPeriod.WEEK.getDateFormat()).isEqualTo("%Y-W%v");
        assertThat(StatisticsPeriod.MONTH.getDateFormat()).isEqualTo("%Y-%m");
        assertThat(StatisticsPeriod.YEAR.getDateFormat()).isEqualTo("%Y");
        assertThat(StatisticsPeriod.values()).hasSize(4);
    }

    @Test
    void completedStatusesSql_matchesDomainConstants() {
        assertThat(OrderStatusConstants.SQL_IN_COMPLETED_STATUSES)
                .isEqualTo("'PAID', 'SHIPPING', 'DELIVERED'");
        assertThat(OrderStatusConstants.SQL_IN_COMPLETED_STATUSES)
                .contains(OrderStatusConstants.STATUS_PAID)
                .contains(OrderStatusConstants.STATUS_SHIPPING)
                .contains(OrderStatusConstants.STATUS_DELIVERED)
                .doesNotContain(OrderStatusConstants.STATUS_PENDING)
                .doesNotContain(OrderStatusConstants.STATUS_CANCELLED)
                .doesNotContain(OrderStatusConstants.STATUS_FAILED);
    }

    @Test
    void builtSql_includesPeriodFormatAndCompletedStatuses() {
        String dateFormat = StatisticsPeriod.DAY.getDateFormat();
        String sql = """
                SELECT DATE_FORMAT(o.order_date, '%s'), SUM(o.total_amount), COUNT(o.id)
                FROM orders o
                WHERE o.status IN (%s)
                GROUP BY DATE_FORMAT(o.order_date, '%s')
                ORDER BY DATE_FORMAT(o.order_date, '%s') DESC
                """.formatted(
                dateFormat,
                OrderStatusConstants.SQL_IN_COMPLETED_STATUSES,
                dateFormat,
                dateFormat
        );

        assertThat(sql).contains("DATE_FORMAT(o.order_date, '%Y-%m-%d')");
        assertThat(sql).contains("WHERE o.status IN ('PAID', 'SHIPPING', 'DELIVERED')");
        assertThat(sql).contains("ORDER BY DATE_FORMAT(o.order_date, '%Y-%m-%d') DESC");
    }
}
