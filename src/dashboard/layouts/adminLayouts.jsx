import "../../dashboard/static/css/dashboard.css";
// Adminlayouts.jsx — React + Ant Design (JavaScript)
import React, { useState } from "react";
import {
  LaptopOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Row, Col, Card, Statistic } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Header, Content, Sider } = Layout;

/* SideNav: Dashboard / Admin / Manager */
const sideNav = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard Overview",
  },
  {
    key: "admin",
    icon: <UserOutlined />,
    label: "Admin",
    children: [
      { key: "admin-1", label: "Dolls Management" },
      { key: "admin-2", label: "Feedback Management" },
      { key: "admin-3", label: "Order Management" },
    ],
  },
  {
    key: "manager",
    icon: <LaptopOutlined />,
    label: "Manager",
    children: [
      { key: "manager-1", label: "User Management" },
      { key: "manager-2", label: "Revenue Tracking & Sales Dashboard" },
      { key: "manager-3", label: "Warranty & Return Policy Setup" },
    ],
  },
];

// Demo data cho dashboard
const revenueData = [
  { name: "Jan", revenue: 12000000 },
  { name: "Feb", revenue: 18000000 },
  { name: "Mar", revenue: 15000000 },
  { name: "Apr", revenue: 22000000 },
];
const categoryData = [
  { name: "Dolls", value: 45 },
  { name: "Characters", value: 30 },
  { name: "Accessories", value: 25 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Adminlayouts() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // sync chọn menu theo URL
  const selectedKey =
    location.pathname.includes("/dashboard/dollsManager")
      ? "admin-1"
      : location.pathname.includes("/dashboard/feedback")
      ? "admin-2"
      : location.pathname.includes("/dashboard/orders")
      ? "admin-3"
      : location.pathname.includes("/dashboard/users")
      ? "manager-1"
      : location.pathname.includes("/dashboard/revenue")
      ? "manager-2"
      : location.pathname.includes("/dashboard/warranty")
      ? "manager-3"
      : "dashboard";

  // điều hướng khi click menu
  const onMenuClick = (e) => {
    switch (e.key) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "admin-1":
        navigate("/dashboard/dollsManager");
        break;
      case "admin-2":
        navigate("/dashboard/feedback");
        break;
      case "admin-3":
        navigate("/dashboard/orders");
        break;
      case "manager-1":
        navigate("/dashboard/users");
        break;
      case "manager-2":
        navigate("/dashboard/revenue");
        break;
      case "manager-3":
        navigate("/dashboard/warranty");
        break;
      default:
        break;
    }
  };

  // Nội dung dashboard báo cáo mặc định
  const renderDashboardContent = () => (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>📊 Dashboard Report</h2>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={67.5}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="M VND"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Orders" value={152} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Active Users" value={320} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={14}>
          <Card title="Monthly Revenue">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Sales by Category">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <Layout className="admin">
      {/* Header */}
      <Header className="admin__header admin__header--minimal">
        <div className="admin__brand">
          <div className="admin__logo">🧸</div>
          <span className="admin__brandText">Doll Admin</span>
        </div>
      </Header>

      <Layout className="admin__body">
        {/* Sidebar */}
        <Sider
          className="admin__sider"
          width={240}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          theme="light"
        >
          <div className="admin__siderTop">
            <Button
              size="small"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>

          <Menu
            className="admin__sideMenu"
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={["admin", "manager"]}
            items={sideNav}
            onClick={onMenuClick}
          />

          {/* Mascot */}
          <div className="admin__siderBottom">
            <div className="charBadge">
              <span className="charBadge__emoji">🧸</span>
            </div>
            {!collapsed && <div className="charBadge__label">Doll Mascot</div>}
          </div>
        </Sider>

        {/* Content */}
        <Layout className="admin__contentWrap">
          <Content
            className="admin__content"
            style={{ background: colorBgContainer }}
          >
            {/* Nếu ở /dashboard thì render báo cáo, còn route con thì render Outlet */}
            {location.pathname === "/dashboard"
              ? renderDashboardContent()
              : <Outlet />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
