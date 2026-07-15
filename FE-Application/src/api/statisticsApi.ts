import { apiClient } from "./apiClient";
import type { OrderStatistic } from "../types/statistics";

export type { OrderStatistic } from "../types/statistics";

const BASE_PATH = "/statistics";

type StatsPeriod = "daily" | "weekly" | "monthly" | "yearly";

const fetchStats = (period: StatsPeriod): Promise<OrderStatistic[]> =>
  apiClient.fetch<OrderStatistic[]>(`${BASE_PATH}/${period}`);

export const statisticsApi = {
  getDailyStats: (): Promise<OrderStatistic[]> => fetchStats("daily"),
  getWeeklyStats: (): Promise<OrderStatistic[]> => fetchStats("weekly"),
  getMonthlyStats: (): Promise<OrderStatistic[]> => fetchStats("monthly"),
  getYearlyStats: (): Promise<OrderStatistic[]> => fetchStats("yearly"),
};
