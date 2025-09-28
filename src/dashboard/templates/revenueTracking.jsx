// RevenueTracking.jsx — React + Ant Design
import React, { useMemo, useState } from "react";
import { Table, DatePicker, Button, Space, Input } from "antd";
import { SearchOutlined, BarChartOutlined, ReloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

// Demo data
const seedRevenue = [
  { id: 1, date: "2025-09-01", orderCount: 15, revenue: 2500000 },
  { id: 2, date: "2025-09-05", orderCount: 8, revenue: 1200000 },
  { id: 3, date: "2025-09-10", orderCount: 20, revenue: 3600000 },
  { id: 4, date: "2025-09-15", orderCount: 5, revenue: 800000 },
];

export default function RevenueTracking() {
  const [list, setList] = useState(seedRevenue);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter((r) =>
      r.date.toLowerCase().includes(s)
    );
  }, [q, list]);

  const columns = [
    { title: "DATE", dataIndex: "date", width: 120 },
    { title: "ORDERS", dataIndex: "orderCount", width: 120 },
    { title: "REVENUE (VND)", dataIndex: "revenue", width: 160 },
  ];

  return (
    <div className="panel" style={{ padding: 16 }}>
      <div className="panel__header">
        <h2><BarChartOutlined /> Revenue Tracking & Sales Dashboard</h2>
        <Space>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search by date..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 240 }}
          />
          <RangePicker />
          <Button icon={<ReloadOutlined />}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 5 }}
        size="middle"
      />
    </div>
  );
}
