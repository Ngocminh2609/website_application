import React from "react";
import { Card, Row, Col, Typography, Select, Spin, Empty } from "antd";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { useStatisticsTabState } from "../../hooks/Admin/useStatisticsTabState";
import { styles } from "./styles/statistics-tab.styles";
import { STATS_STRINGS } from "../../constants/Admin/statistics-tab";

const { Title, Text } = Typography;
const { Option } = Select;

const StatisticsTab: React.FC = () => {
  const { data, loading, setPeriod } = useStatisticsTabState();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Title level={4} style={styles.headerTitle}>
          {STATS_STRINGS.headerTitle}
        </Title>
        <Select
          defaultValue="monthly"
          style={styles.select}
          onChange={(value) =>
            setPeriod(value as "daily" | "weekly" | "monthly" | "yearly")
          }
        >
          <Option value="daily">{STATS_STRINGS.periods.daily}</Option>
          <Option value="weekly">{STATS_STRINGS.periods.weekly}</Option>
          <Option value="monthly">{STATS_STRINGS.periods.monthly}</Option>
          <Option value="yearly">{STATS_STRINGS.periods.yearly}</Option>
        </Select>
      </div>

      {loading ? (
        <div style={styles.spinnerContainer}>
          <Spin size="large" />
        </div>
      ) : data.length === 0 ? (
        <Empty
          description={
            <Text style={styles.emptyText}>
              {STATS_STRINGS.emptyText}
            </Text>
          }
        />
      ) : (
        <Row gutter={[24, 24]}>
          {/* BIỂU ĐỒ DOANH THU */}
          <Col span={24}>
            <Card
              title={
                <Text strong style={styles.cardTitleText}>
                  {STATS_STRINGS.revenueChartTitle}
                </Text>
              }
              className="glass-effect"
              styles={{ body: styles.cardBody }}
            >
              <div style={styles.chartContainerRevenue}>
                <ResponsiveContainer>
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--glass-border)"
                    />
                    <XAxis
                      dataKey="label"
                      stroke="var(--text-muted)"
                      tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="var(--text-muted)"
                      tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                      tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      contentStyle={styles.tooltip}
                      itemStyle={styles.tooltipItemRevenue}
                      formatter={(value: number | string | undefined) => [
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(value || 0)),
                        STATS_STRINGS.revenueLabel,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* BIỂU ĐỒ SỐ LƯỢNG ĐƠN HÀNG */}
          <Col span={24}>
            <Card
              title={
                <Text strong style={styles.cardTitleText}>
                  {STATS_STRINGS.ordersChartTitle}
                </Text>
              }
              className="glass-effect"
              styles={{ body: styles.cardBody }}
            >
              <div style={styles.chartContainerOrders}>
                <ResponsiveContainer>
                  <BarChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--glass-border)"
                    />
                    <XAxis
                      dataKey="label"
                      stroke="var(--text-muted)"
                      tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="var(--text-muted)"
                      tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={styles.tooltip}
                      itemStyle={styles.tooltipItemOrders}
                      formatter={(value: number | string | undefined) => [
                        value,
                        STATS_STRINGS.ordersLabel,
                      ]}
                    />
                    <Bar
                      dataKey="orderCount"
                      fill="#a855f7"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default StatisticsTab;
