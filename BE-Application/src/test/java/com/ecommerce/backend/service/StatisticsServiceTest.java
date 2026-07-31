package com.ecommerce.backend.service;

import com.ecommerce.backend.constant.domain.StatisticsPeriod;
import com.ecommerce.backend.dto.OrderStatisticDTO;
import com.ecommerce.backend.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatisticsServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private StatisticsService statisticsService;

    @Test
    void getDailyStats_mapsJdbcRows() {
        when(orderRepository.getStatisticsRaw(StatisticsPeriod.DAY)).thenReturn(List.<Object[]>of(
                new Object[]{"2026-07-30", new BigDecimal("1500000"), 3L}
        ));

        List<OrderStatisticDTO> result = statisticsService.getDailyStats();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getLabel()).isEqualTo("2026-07-30");
        assertThat(result.get(0).getRevenue()).isEqualByComparingTo("1500000");
        assertThat(result.get(0).getOrderCount()).isEqualTo(3L);
        verify(orderRepository).getStatisticsRaw(StatisticsPeriod.DAY);
    }

    @Test
    void getWeeklyStats_mapsJdbcRows() {
        when(orderRepository.getStatisticsRaw(StatisticsPeriod.WEEK)).thenReturn(List.<Object[]>of(
                new Object[]{"2026-W30", new BigDecimal("2000000"), 5L}
        ));

        List<OrderStatisticDTO> result = statisticsService.getWeeklyStats();

        assertThat(result.get(0).getLabel()).isEqualTo("2026-W30");
        assertThat(result.get(0).getOrderCount()).isEqualTo(5L);
        verify(orderRepository).getStatisticsRaw(StatisticsPeriod.WEEK);
    }

    @Test
    void getMonthlyStats_mapsJdbcRows() {
        when(orderRepository.getStatisticsRaw(StatisticsPeriod.MONTH)).thenReturn(List.<Object[]>of(
                new Object[]{"2026-07", new BigDecimal("9000000"), 12L}
        ));

        List<OrderStatisticDTO> result = statisticsService.getMonthlyStats();

        assertThat(result.get(0).getLabel()).isEqualTo("2026-07");
        assertThat(result.get(0).getRevenue()).isEqualByComparingTo("9000000");
        verify(orderRepository).getStatisticsRaw(StatisticsPeriod.MONTH);
    }

    @Test
    void getYearlyStats_mapsJdbcRows() {
        when(orderRepository.getStatisticsRaw(StatisticsPeriod.YEAR)).thenReturn(List.<Object[]>of(
                new Object[]{"2026", new BigDecimal("50000000"), 100L}
        ));

        List<OrderStatisticDTO> result = statisticsService.getYearlyStats();

        assertThat(result.get(0).getLabel()).isEqualTo("2026");
        assertThat(result.get(0).getOrderCount()).isEqualTo(100L);
        verify(orderRepository).getStatisticsRaw(StatisticsPeriod.YEAR);
    }

    @Test
    void mapToDTO_handlesNumericPrimitivesFromJdbc() {
        when(orderRepository.getStatisticsRaw(StatisticsPeriod.DAY)).thenReturn(List.<Object[]>of(
                new Object[]{"2026-01-01", 1000, 2}
        ));

        List<OrderStatisticDTO> result = statisticsService.getDailyStats();

        assertThat(result.get(0).getRevenue()).isEqualByComparingTo("1000");
        assertThat(result.get(0).getOrderCount()).isEqualTo(2L);
    }

    @Test
    void getStats_delegatesToRepositoryWithPeriod() {
        when(orderRepository.getStatisticsRaw(StatisticsPeriod.MONTH)).thenReturn(List.of());

        statisticsService.getStats(StatisticsPeriod.MONTH);

        verify(orderRepository).getStatisticsRaw(StatisticsPeriod.MONTH);
    }
}
