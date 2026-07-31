package com.ecommerce.backend.repository;

import com.ecommerce.backend.constant.domain.StatisticsPeriod;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

import static com.ecommerce.backend.constant.domain.OrderStatusConstants.SQL_IN_COMPLETED_STATUSES;

public class OrderStatisticsRepositoryImpl implements OrderStatisticsRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public List<Object[]> getStatisticsRaw(StatisticsPeriod period) {
        // period.getDateFormat() chỉ lấy từ enum whitelist — không nhận input người dùng.
        String dateFormat = period.getDateFormat();
        String sql = """
                SELECT DATE_FORMAT(o.order_date, '%s'), SUM(o.total_amount), COUNT(o.id)
                FROM orders o
                WHERE o.status IN (%s)
                GROUP BY DATE_FORMAT(o.order_date, '%s')
                ORDER BY DATE_FORMAT(o.order_date, '%s') DESC
                """.formatted(dateFormat, SQL_IN_COMPLETED_STATUSES, dateFormat, dateFormat);

        return entityManager.createNativeQuery(sql).getResultList();
    }
}
