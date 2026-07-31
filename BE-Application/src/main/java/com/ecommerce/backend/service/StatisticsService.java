package com.ecommerce.backend.service;

import com.ecommerce.backend.constant.domain.StatisticsPeriod;
import com.ecommerce.backend.dto.OrderStatisticDTO;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.util.jdbc.JdbcValueUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final OrderRepository orderRepository;

    public List<OrderStatisticDTO> getDailyStats() {
        return getStats(StatisticsPeriod.DAY);
    }

    public List<OrderStatisticDTO> getWeeklyStats() {
        return getStats(StatisticsPeriod.WEEK);
    }

    public List<OrderStatisticDTO> getMonthlyStats() {
        return getStats(StatisticsPeriod.MONTH);
    }

    public List<OrderStatisticDTO> getYearlyStats() {
        return getStats(StatisticsPeriod.YEAR);
    }

    public List<OrderStatisticDTO> getStats(StatisticsPeriod period) {
        return mapToDTO(orderRepository.getStatisticsRaw(period));
    }

    private List<OrderStatisticDTO> mapToDTO(List<Object[]> rows) {
        return rows.stream().map(row -> new OrderStatisticDTO(
                String.valueOf(row[0]),
                JdbcValueUtil.toBigDecimal(row[1]),
                JdbcValueUtil.toLong(row[2])
        )).collect(Collectors.toList());
    }
}
