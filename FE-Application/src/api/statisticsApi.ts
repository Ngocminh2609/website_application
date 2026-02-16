import { apiClient } from './apiClient';

export interface OrderStatistic {
    label: string;
    revenue: number;
    orderCount: number;
}

export const statisticsApi = {
    getDailyStats: () => apiClient.fetch<OrderStatistic[]>('/statistics/daily'),
    getWeeklyStats: () => apiClient.fetch<OrderStatistic[]>('/statistics/weekly'),
    getMonthlyStats: () => apiClient.fetch<OrderStatistic[]>('/statistics/monthly'),
    getYearlyStats: () => apiClient.fetch<OrderStatistic[]>('/statistics/yearly'),
};
