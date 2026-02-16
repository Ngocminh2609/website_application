package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.OrderStatisticDTO;
import com.ecommerce.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
        return rows.stream().map(row -> {
            String label = String.valueOf(row[0]);
            java.math.BigDecimal revenue = java.math.BigDecimal.ZERO;
            if (row[1] instanceof java.math.BigDecimal) {
                revenue = (java.math.BigDecimal) row[1];
            } else if (row[1] instanceof Number) {
                revenue = new java.math.BigDecimal(row[1].toString());
            }

            long count = 0L;
            if (row[2] instanceof Long) {
                count = (Long) row[2];
            } else if (row[2] instanceof Number) {
                count = ((Number) row[2]).longValue();
            }

            return new OrderStatisticDTO(label, revenue, count);
        }).collect(java.util.stream.Collectors.toList());
    }
}
