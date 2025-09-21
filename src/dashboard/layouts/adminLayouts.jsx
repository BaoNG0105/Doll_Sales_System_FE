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
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Content, Sider } = Layout;

/* SideNav: Admin / Manager / Staff (English) */
const sideNav = [
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
  const navigate = useNavigate();
  const location = useLocation();

  // sync chọn menu theo URL (đơn giản)
  const selectedKey =
    location.pathname.includes("/dashboard/dollsManager") ? "admin-1" : "";

  // điều hướng khi click menu
  const onMenuClick = (e) => {
    switch (e.key) {
      case "admin-1":
        navigate("/dashboard/dollsManager");
        break;
      case "admin-2":
        navigate("/dashboard/feedback"); // tạo route khi bạn có trang này
        break;
      case "admin-3":
        navigate("/dashboard/orders");   // tạo route khi bạn có trang này
        break;
      default:
        // các mục khác bạn map thêm nếu cần
        break;
    }
  };

  return (
    <Layout className="admin">
      {/* Header minimal: only brand on the left */}
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
            defaultOpenKeys={["admin"]}
            items={sideNav}
            onClick={onMenuClick}
          />

          {/* Mascot at the bottom of the sider */}
          <div className="admin__siderBottom">
            <div className="charBadge">
              <span className="charBadge__emoji">🧸</span>
            </div>
            {!collapsed && <div className="charBadge__label">Doll Mascot</div>}
          </div>
        </Sider>

        {/* Main content: chỉ còn Outlet để render trang con */}
        <Layout className="admin__contentWrap">
          <Content className="admin__content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
