import { apiClient } from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderStatistic {
    label: string;
    revenue: number;
    orderCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PATH = '/statistics';

type StatsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fetchStats = (period: StatsPeriod): Promise<OrderStatistic[]> =>
    apiClient.fetch<OrderStatistic[]>(`${BASE_PATH}/${period}`);

// ─── API ─────────────────────────────────────────────────────────────────────

/**
 * Service quản lý các yêu cầu liên quan đến Thống kê.
 */
export const statisticsApi = {
    /** Lấy thống kê theo ngày. */
    getDailyStats: (): Promise<OrderStatistic[]> => fetchStats('daily'),

    /** Lấy thống kê theo tuần. */
    getWeeklyStats: (): Promise<OrderStatistic[]> => fetchStats('weekly'),

    /** Lấy thống kê theo tháng. */
    getMonthlyStats: (): Promise<OrderStatistic[]> => fetchStats('monthly'),

    /** Lấy thống kê theo năm. */
    getYearlyStats: (): Promise<OrderStatistic[]> => fetchStats('yearly'),
};
