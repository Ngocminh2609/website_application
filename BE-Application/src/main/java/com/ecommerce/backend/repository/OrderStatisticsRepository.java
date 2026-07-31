package com.ecommerce.backend.repository;

import com.ecommerce.backend.constant.domain.StatisticsPeriod;

import java.util.List;

/**
 * Truy vấn thống kê doanh thu theo kỳ (custom fragment của OrderRepository).
 */
public interface OrderStatisticsRepository {

    List<Object[]> getStatisticsRaw(StatisticsPeriod period);
}
