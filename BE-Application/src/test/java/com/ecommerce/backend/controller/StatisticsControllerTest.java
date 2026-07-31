package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.OrderStatisticDTO;
import com.ecommerce.backend.service.StatisticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class StatisticsControllerTest {

    @Mock
    private StatisticsService statisticsService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new StatisticsController(statisticsService)).build();
    }

    @Test
    void getDailyStats_keepsContract() throws Exception {
        when(statisticsService.getDailyStats()).thenReturn(List.of(
                new OrderStatisticDTO("2026-07-30", new BigDecimal("1000"), 2L)
        ));

        mockMvc.perform(get("/api/statistics/daily"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].label").value("2026-07-30"))
                .andExpect(jsonPath("$[0].revenue").value(1000))
                .andExpect(jsonPath("$[0].orderCount").value(2));
    }

    @Test
    void getWeeklyStats_keepsContract() throws Exception {
        when(statisticsService.getWeeklyStats()).thenReturn(List.of(
                new OrderStatisticDTO("2026-W30", new BigDecimal("2000"), 3L)
        ));

        mockMvc.perform(get("/api/statistics/weekly"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].label").value("2026-W30"));
    }

    @Test
    void getMonthlyStats_keepsContract() throws Exception {
        when(statisticsService.getMonthlyStats()).thenReturn(List.of(
                new OrderStatisticDTO("2026-07", new BigDecimal("3000"), 4L)
        ));

        mockMvc.perform(get("/api/statistics/monthly"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].label").value("2026-07"));
    }

    @Test
    void getYearlyStats_keepsContract() throws Exception {
        when(statisticsService.getYearlyStats()).thenReturn(List.of(
                new OrderStatisticDTO("2026", new BigDecimal("4000"), 5L)
        ));

        mockMvc.perform(get("/api/statistics/yearly"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].label").value("2026"));
    }
}
