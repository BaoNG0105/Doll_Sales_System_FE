import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Spin } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/charts"; 
import { getStaticRevenue, getStaticUsers, getStaticOrders } from "../../service/api.statics";

const DashboardPage = () => {
  const [revenue, setRevenue] = useState(null);
  const [users, setUsers] = useState(null);
  const [orders, setOrders] = useState(null);

  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        const prevMonthDate = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const prevYear = prevMonthDate.getFullYear();
        const prevMonth = prevMonthDate.getMonth() + 1;

        // --- Logic cho các thẻ Statistic ---
        const currentRevenueData = await getStaticRevenue({
          month: currentMonth,
          year: currentYear,
        });
        const prevRevenueData = await getStaticRevenue({
          month: prevMonth,
          year: prevYear,
        });

        const currentRevenue = currentRevenueData.totalRevenue || 0;
        const prevRevenue = prevRevenueData.totalRevenue || 0;

        let revenuePercentageChange = 0;
        if (prevRevenue > 0) {
          revenuePercentageChange =
            ((currentRevenue - prevRevenue) / prevRevenue) * 100;
        } else if (currentRevenue > 0) {
          revenuePercentageChange = 100;
        }

        setRevenue({
          total: currentRevenue,
          change: revenuePercentageChange,
        });

        // Fetch Users
        const currentUserData = await getStaticUsers({
          month: currentMonth,
          year: currentYear,
        });
        const prevUserData = await getStaticUsers({
          month: prevMonth,
          year: prevYear,
        });

        const currentUserCount = currentUserData.totalCount || 0;
        const prevUserCount = prevUserData.totalCount || 0;

        let userPercentageChange = 0;
        if (prevUserCount > 0) {
          userPercentageChange =
            ((currentUserCount - prevUserCount) / prevUserCount) * 100;
        } else if (currentUserCount > 0) {
          userPercentageChange = 100;
        }

        setUsers({
          total: currentUserCount,
          change: userPercentageChange,
        });

        // Fetch Orders
        const currentOrderData = await getStaticOrders({
          month: currentMonth,
          year: currentYear,
        });
        const prevOrderData = await getStaticOrders({
          month: prevMonth,
          year: prevYear,
        });

        const currentOrderCount = currentOrderData.totalCount || 0;
        const prevOrderCount = prevOrderData.totalCount || 0;

        let orderPercentageChange = 0;
        if (prevOrderCount > 0) {
          orderPercentageChange =
            ((currentOrderCount - prevOrderCount) / prevOrderCount) * 100;
        } else if (currentOrderCount > 0) {
          orderPercentageChange = 100;
        }

        setOrders({
          total: currentOrderCount,
          change: orderPercentageChange,
        });

        // --- Logic để lấy dữ liệu cho biểu đồ ---
        const months = Array.from({ length: 12 }, (_, i) => i + 1); 
        
        const revenuePromises = months.map(month =>
          getStaticRevenue({ month: month, year: currentYear })
        );
        
        const monthlyData = await Promise.all(revenuePromises);

        const monthNames = ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6", "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"];
        const formattedData = monthlyData.map(item => ({
          ...item,
          monthLabel: monthNames[item.month - 1] 
        }));

        setMonthlyRevenueData(formattedData);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setRevenue({ total: 0, change: 0 });
        setUsers({ total: 0, change: 0 });
        setOrders({ total: 0, change: 0 });
        setMonthlyRevenueData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-page">
      {/* Hàng chứa các thẻ Statistic */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            {loading ? (
              <Spin />
            ) : (
              <Statistic
                title="Revenue (This Month)"
                value={revenue?.total}
                formatter={(value) =>
                  `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`
                }
                valueStyle={{
                  color: revenue?.change >= 0 ? "#3f8600" : "#cf1322",
                }}
                suffix={
                  <span style={{ marginLeft: 8 }}>
                    {revenue?.change >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}
                    <span style={{ marginLeft: 4 }}>
                      {revenue?.change.toFixed(2)}%
                    </span>
                  </span>
                }
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            {loading ? (
              <Spin />
            ) : (
              <Statistic
                title="Active Users (This Month)"
                value={users?.total}
                valueStyle={{
                  color: users?.change >= 0 ? "#3f8600" : "#cf1322",
                }}
                suffix={
                  <span style={{ marginLeft: 8 }}>
                    {users?.change >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}
                    <span style={{ marginLeft: 4 }}>
                      {users?.change.toFixed(2)}%
                    </span>
                  </span>
                }
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            {loading ? (
              <Spin />
            ) : (
              <Statistic
                title="Total Orders (This Month)"
                value={orders?.total}
                valueStyle={{
                  color: orders?.change >= 0 ? "#3f8600" : "#cf1322",
                }}
                suffix={
                  <span style={{ marginLeft: 8 }}>
                    {orders?.change >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}
                    <span style={{ marginLeft: 4 }}>
                      {orders?.change.toFixed(2)}%
                    </span>
                  </span>
                }
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* 2. Hàng chứa biểu đồ Column */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title={`Monthly Revenue (${displayYear})`}>
            {loading ? (
              <Spin />
            ) : (
              <Column
                data={monthlyRevenueData}
                xField="monthLabel" 
                yField="totalRevenue"
                xAxis={{ title: { text: "Month" } }}
                yAxis={{
                  title: { text: "Revenue" },
                  label: {
                    formatter: (value) =>
                      `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`,
                  },
                }}
                tooltip={{
                  formatter: (datum) => ({
                    name: "Revenue",
                    value: `${new Intl.NumberFormat("vi-VN").format(
                      datum.totalRevenue
                    )} VNĐ`,
                  }),
                }}
                height={300}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;