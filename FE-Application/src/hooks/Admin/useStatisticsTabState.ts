import { useState, useEffect } from "react";
import { statisticsApi, type OrderStatistic } from "../../api/statisticsApi";
import { notification } from "../../utils/notification";
import { STATS_STRINGS } from "../../constants/Admin/statistics-tab";

export const useStatisticsTabState = () => {
  const [data, setData] = useState<OrderStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");

  const fetchStats = async (selectedPeriod: string) => {
    setLoading(true);
    try {
      let res: OrderStatistic[] = [];
      switch (selectedPeriod) {
        case "daily":
          res = await statisticsApi.getDailyStats();
          break;
        case "weekly":
          res = await statisticsApi.getWeeklyStats();
          break;
        case "monthly":
          res = await statisticsApi.getMonthlyStats();
          break;
        case "yearly":
          res = await statisticsApi.getYearlyStats();
          break;
      }
      setData([...res].reverse());
    } catch (error) {
      notification.error(STATS_STRINGS.error.loadError);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  return {
    data,
    loading,
    period,
    setPeriod,
  };
};
