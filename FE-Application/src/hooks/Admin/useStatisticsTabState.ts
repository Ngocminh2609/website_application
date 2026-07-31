import {useCallback, useEffect, useState} from "react";
import {statisticsApi} from "../../api/statisticsApi";
import type {OrderStatistic} from "../../types/statistics";
import {STATS_STRINGS} from "../../constants/Admin/statistics-tab";
import {useAsyncList} from "../common/useFetchOnMount";

type StatisticsPeriod = "daily" | "weekly" | "monthly" | "yearly";

export const useStatisticsTabState = () => {
    const [period, setPeriod] = useState<StatisticsPeriod>("monthly");

    const fetchStats = useCallback(async (): Promise<OrderStatistic[]> => {
        let res: OrderStatistic[] = [];
        switch (period) {
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
        return [...res].reverse();
    }, [period]);

    const {data, loading, refetch} = useAsyncList(
        fetchStats,
        STATS_STRINGS.error.loadError,
        [] as OrderStatistic[],
        false,
    );

    useEffect(() => {
        void refetch();
    }, [period, refetch]);

    return {
        data,
        loading,
        period,
        setPeriod,
    };
};
