package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.OrderStatisticDTO;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.util.jdbc.JdbcValueUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final OrderRepository orderRepository;

    @Autowired
    public StatisticsService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<OrderStatisticDTO> getDailyStats() {
        return mapToDTO(orderRepository.getDailyStatisticsRaw());
    }

    public List<OrderStatisticDTO> getWeeklyStats() {
        return mapToDTO(orderRepository.getWeeklyStatisticsRaw());
    }

    public List<OrderStatisticDTO> getMonthlyStats() {
        return mapToDTO(orderRepository.getMonthlyStatisticsRaw());
    }

    public List<OrderStatisticDTO> getYearlyStats() {
        return mapToDTO(orderRepository.getYearlyStatisticsRaw());
    }

    private List<OrderStatisticDTO> mapToDTO(List<Object[]> rows) {
        return rows.stream().map(row -> new OrderStatisticDTO(
                String.valueOf(row[0]),
                JdbcValueUtil.toBigDecimal(row[1]),
                JdbcValueUtil.toLong(row[2])
        )).collect(Collectors.toList());
    }
}
