import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined, //Icons for expanding sidebar
  MenuUnfoldOutlined, //Icons for collapsing sidebar
  UserOutlined, //Icon Users
  HeartFilled, //Icon Doll Types, Models, Variants
  OpenAIFilled, //Icon Characters
  ShoppingCartOutlined, //Icon Orders
  LogoutOutlined, //Icon Logout
  BarChartOutlined, //Icon Dashboard
} from "@ant-design/icons";
import { Layout, Menu, Button, Typography } from "antd"; // Thêm Typography
import "../static/css/Dashboard.css";
// Redux
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

const { Header, Sider, Content } = Layout;
const { Title } = Typography; // Thêm Title

const AdminLayouts = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleMenuClick = (e) => {
    if (e.key === "home") {
      navigate("/");
    } else {
      // Navigate relative to the /dashboard route
      navigate(`/dashboard/${e.key}`);
    }
  };
  const items = [
    { key: "overview", icon: <BarChartOutlined />, label: "Overview" },
    { key: "manage-doll-types", icon: <HeartFilled />, label: "Doll Types Management" },
    { key: "manage-doll-models", icon: <HeartFilled />, label: "Doll Models Management" },
    { key: "manage-doll-variants", icon: <HeartFilled />, label: "Doll Variants Management" },
    { key: "manage-characters", icon: <OpenAIFilled />, label: "Characters Management" },
    { key: "manage-doll-orders", icon: <ShoppingCartOutlined />, label: "Doll Orders Management" },
    { key: "manage-character-orders", icon: <ShoppingCartOutlined />, label: "Character Orders Management" },
    { key: "manage-users", icon: <UserOutlined />, label: "Users Management" },
  ];

  return (
    <Layout className="admin">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="admin__sider"
        theme="light"
      >
        <div className="admin__brand">
          <div className="admin__logo">
            <HeartFilled />
          </div>
          {!collapsed && <Title level={5} className="admin__brandText">DASHBOARD</Title>}
        </div>
        <Menu
          className="admin__sideMenu"
          mode="inline"
          defaultSelectedKeys={["overview"]}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout className="admin__body">
        <Header className="admin__header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="admin__header-trigger"
          />
          <Button
            className="admin__logoutBtn"
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
          >
            {!collapsed && <span>Logout</span>}
          </Button>
        </Header>
        <Content className="admin__contentWrap">
          <div className="admin__content">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayouts;