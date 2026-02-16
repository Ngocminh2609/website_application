package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.OrderStatisticDTO;
import com.ecommerce.backend.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Autowired
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/daily")
    public List<OrderStatisticDTO> getDailyStats() {
        return statisticsService.getDailyStats();
    }

    @GetMapping("/weekly")
    public List<OrderStatisticDTO> getWeeklyStats() {
        return statisticsService.getWeeklyStats();
    }

    @GetMapping("/monthly")
    public List<OrderStatisticDTO> getMonthlyStats() {
        return statisticsService.getMonthlyStats();
    }

    @GetMapping("/yearly")
    public List<OrderStatisticDTO> getYearlyStats() {
        return statisticsService.getYearlyStats();
    }
}
