import React, { useState, useEffect } from "react";
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
import { statisticsApi, type OrderStatistic } from "../../api/statisticsApi";
import { notification } from "../../utils/notification";

const { Title, Text } = Typography;
const { Option } = Select;

const StatisticsTab: React.FC = () => {
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
      // Đảo ngược lại để hiển thị từ cũ đến mới trên biểu đồ
      setData([...res].reverse());
    } catch (error) {
      notification.error("Không thể tải dữ liệu thống kê");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <Title level={4} style={{ color: "var(--text-main)", margin: 0 }}>
          Báo cáo doanh thu & Đơn hàng
        </Title>
        <Select
          defaultValue="monthly"
          style={{ width: 200 }}
          onChange={(value) =>
            setPeriod(value as "daily" | "weekly" | "monthly" | "yearly")
          }
        >
          <Option value="daily">Theo Ngày (30 ngày gần nhất)</Option>
          <Option value="weekly">Theo Tuần</Option>
          <Option value="monthly">Theo Tháng</Option>
          <Option value="yearly">Theo Năm</Option>
        </Select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "100px" }}>
          <Spin size="large" />
        </div>
      ) : data.length === 0 ? (
        <Empty
          description={
            <Text style={{ color: "var(--text-muted)" }}>
              Chưa có dữ liệu thống kê cho kỳ này
            </Text>
          }
        />
      ) : (
        <Row gutter={[24, 24]}>
          {/* BIỂU ĐỒ DOANH THU */}
          <Col span={24}>
            <Card
              title={
                <Text strong style={{ color: "var(--text-main)" }}>
                  Biểu đồ Doanh thu (VND)
                </Text>
              }
              className="glass-effect"
              styles={{ body: { padding: "24px 24px 40px 10px" } }}
            >
              <div style={{ width: "100%", height: 400 }}>
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
                      contentStyle={{
                        backgroundColor: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "8px",
                        color: "var(--text-main)",
                      }}
                      itemStyle={{ color: "#6366f1" }}
                      formatter={(value: number | string | undefined) => [
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(value || 0)),
                        "Doanh thu",
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
                <Text strong style={{ color: "var(--text-main)" }}>
                  Thống kê lượng Đơn hàng
                </Text>
              }
              className="glass-effect"
              styles={{ body: { padding: "24px 24px 40px 10px" } }}
            >
              <div style={{ width: "100%", height: 350 }}>
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
                      contentStyle={{
                        backgroundColor: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "8px",
                        color: "var(--text-main)",
                      }}
                      itemStyle={{ color: "#a855f7" }}
                      formatter={(value: number | string | undefined) => [
                        value,
                        "Đơn hàng",
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
