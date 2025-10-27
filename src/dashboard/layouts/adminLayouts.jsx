import "../../dashboard/static/css/dashboard.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import {
  OpenAIFilled,
  HeartFilled,
  ShoppingCartOutlined,
  LaptopOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  DollarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Row,
  Col,
  Card,
  Statistic,
} from "antd";
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

// ================== SIDE NAV ==================
const sideNav = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard Overview",
  },

  // --- Dolls Management (chia thành 3 trang) ---
  { key: "admin-type", icon: <HeartFilled />, label: "Manage Doll Types" },
  { key: "admin-model", icon: <HeartFilled />, label: "Manage Doll Models" },
  { key: "admin-variant", icon: <HeartFilled />, label: "Manage Doll Variants" },

  // --- Other Management ---
  { key: "admin-2", icon: <OpenAIFilled />, label: "Characters Management" },
  { key: "admin-3", icon: <ShoppingCartOutlined />, label: "Orders Management" },
  { key: "admin-4", icon: <ShoppingCartOutlined />, label: "Character Orders Management" },
  { key: "manager-1", icon: <UserOutlined />, label: "Users Management" },
];

// ================== DEMO DATA ==================
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

// ================== MAIN COMPONENT ==================
export default function Adminlayouts() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync menu selection theo URL
  const selectedKey =
    location.pathname.includes("/dashboard/manage-doll-types")
      ? "admin-type"
      : location.pathname.includes("/dashboard/manage-doll-models")
        ? "admin-model"
        : location.pathname.includes("/dashboard/manage-doll-variants")
          ? "admin-variant"
          : location.pathname.includes("/dashboard/manage-characters")
            ? "admin-2"
            : location.pathname.includes("/dashboard/manage-orders")
              ? "admin-3"
              : location.pathname.includes("/dashboard/manage-character-orders")
                ? "admin-4"
                : location.pathname.includes("/dashboard/manage-users")
                  ? "manager-1"
                  : "dashboard";

  // Điều hướng menu
  const onMenuClick = (e) => {
    switch (e.key) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "admin-type":
        navigate("/dashboard/manage-doll-types");
        break;
      case "admin-model":
        navigate("/dashboard/manage-doll-models");
        break;
      case "admin-variant":
        navigate("/dashboard/manage-doll-variants");
        break;
      case "admin-2":
        navigate("/dashboard/manage-characters");
        break;
      case "admin-3":
        navigate("/dashboard/manage-orders");
        break;
      case "admin-4":
        navigate("/dashboard/manage-character-orders");
        break;
      case "manager-1":
        navigate("/dashboard/manage-users");
        break;
      default:
        break;
    }
  };

  // ================== DASHBOARD DEFAULT CONTENT ==================
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

  // ================== RENDER ==================
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
          trigger={null}
        >
          {/* Toggle button */}
          <div className="admin__siderTop">
            <Button
              size="small"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>

          {/* Menu */}
          <Menu
            className="admin__sideMenu"
            mode="inline"
            selectedKeys={[selectedKey]}
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
          <Content className="admin__content" style={{ background: colorBgContainer }}>
            {location.pathname === "/dashboard" || location.pathname === "/dashboard/"
              ? renderDashboardContent()
              : <Outlet />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
