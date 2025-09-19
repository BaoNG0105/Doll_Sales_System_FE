import "../../dashboard/static/css/dashboard.css";
// Adminlayouts.jsx — React + Ant Design (JavaScript)
import React, { useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Input, Layout, Menu, theme } from "antd";
const { Header, Content, Sider } = Layout;

// Top menu đã bỏ, giữ side menu
const sideNav = [
  {
    key: "admin",
    icon: <UserOutlined />,
    label: "Admin",
    children: [
      { key: "admin-1", label: "Product Management (CRUD toys, emotions)" },
      { key: "admin-2", label: "Feedback Management" },
      { key: "admin-3", label: "Order Management (set status)" },
    ],
  },
  {
    key: "manager",
    icon: <LaptopOutlined />,
    label: "Manager",
    children: [
      { key: "manager-1", label: "User Management (customer, admin)" },
      { key: "manager-2", label: "Revenue Tracking & Sales Dashboard" },
      { key: "manager-3", label: "Warranty & Return Policy Setup" },
    ],
  },
  {
    key: "staff",
    icon: <NotificationOutlined />,
    label: "Staff",
    children: [
      { key: "staff-1", label: "View Assigned Orders" },
      { key: "staff-2", label: "View Order Details" },
      { key: "staff-3", label: "Update Order Status" },
      { key: "staff-4", label: "Cash on Delivery (COD) Management" },
    ],
  },
];



export default function Adminlayouts() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="admin">
      {/* Header tối giản: chỉ còn brand bên trái */}
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
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            items={sideNav}
          />

          {/* Logo/mascot dưới cùng sidebar */}
          <div className="admin__siderBottom">
            <div className="charBadge">
              <span className="charBadge__emoji">🧸</span>
            </div>
            {!collapsed && <div className="charBadge__label">Doll Mascot</div>}
          </div>
        </Sider>

        {/* Khu nội dung */}
        <Layout className="admin__contentWrap">
          <Breadcrumb
            items={[{ title: "Home" }, { title: "List" }, { title: "App" }]}
            className="admin__breadcrumb"
          />

          <Content className="admin__content">
            {/* Dashboard cards */}
            <div className="admin__cards">
              {[
                { title: "Revenue", value: "12,000,000 VND" },
                { title: "Orders", value: "150" },
                { title: "Best Seller", value: "Doll Elsa" },
              ].map((c) => (
                <div key={c.title} className="card card--kpi">
                  <div className="card__label">{c.title}</div>
                  <div className="card__value">{c.value}</div>
                </div>
              ))}
            </div>

            <div className="admin__placeholder">Content</div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
