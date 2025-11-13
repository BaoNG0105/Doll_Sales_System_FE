import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom"; // Thêm Navigate
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HeartFilled,
  OpenAIFilled,
  ShoppingCartOutlined,
  LogoutOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Typography } from "antd";
import "../static/css/AdminLayout.css";
import { logout } from "../../redux/authSlice";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const allItems = [
  { key: "overview", icon: <BarChartOutlined />, label: "Overview", roles: ["manager"] },
  { key: "manage-doll-types", icon: <HeartFilled />, label: "Doll Types Management", roles: ["admin"] },
  { key: "manage-doll-models", icon: <HeartFilled />, label: "Doll Models Management", roles: ["admin"] },
  { key: "manage-doll-variants", icon: <HeartFilled />, label: "Doll Variants Management", roles: ["admin"] },
  { key: "manage-characters", icon: <OpenAIFilled />, label: "Characters Management", roles: ["admin"] },
  { key: "manage-doll-orders", icon: <ShoppingCartOutlined />, label: "Doll Orders Management", roles: ["admin"] },
  { key: "manage-character-orders", icon: <ShoppingCartOutlined />, label: "Character Orders Management", roles: ["admin"] },
  { key: "manage-users", icon: <UserOutlined />, label: "Users Management", roles: ["manager"] },
];

const AdminLayouts = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { role: userRole } = useSelector((state) => state.auth);

  const processedRole = useMemo(() => {
    if (!userRole) return "loading";
    return userRole.toLowerCase();
  }, [userRole]);

  const filteredItems = useMemo(() => {
    if (processedRole === "loading") return [];
    return allItems.filter((item) => item.roles.includes(processedRole));
  }, [processedRole]);

  const currentPathKey = location.pathname.split("/dashboard/")[1];

  // --- THÊM MỚI: LOGIC CHẶN TRUY CẬP TRỰ TIẾP ---
  const isAllowedOnCurrentRoute = useMemo(() => {
    // 1. Nếu vai trò đang tải, tạm thời cho phép
    if (processedRole === "loading") {
      return true;
    }

    // 2. Nếu ở trang /dashboard gốc, cho phép (để DashboardIndex xử lý)
    if (!currentPathKey) {
      return true;
    }

    // 3. Tìm cấu hình route từ danh sách 'allItems'
    const routeConfig = allItems.find(item => item.key === currentPathKey);

    // 4. Nếu route không tồn tại (ví dụ: /dashboard/abc), chặn
    if (!routeConfig) {
      return false;
    }

    // 5. Kiểm tra xem vai trò của người dùng có trong danh sách 'roles' của route không
    //
    return routeConfig.roles.includes(processedRole);
    
  }, [currentPathKey, processedRole]); // Kiểm tra lại mỗi khi URL hoặc vai trò thay đổi


  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const handleMenuClick = (e) => {
    if (e.key === "home") {
      navigate("/");
    } else {
      navigate(`/dashboard/${e.key}`);
    }
  };

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
          {!collapsed && (
            <Title level={5} className="admin__brandText">
              {userRole ? `${userRole.toUpperCase()} DB` : "DASHBOARD"}
            </Title>
          )}
        </div>
        <Menu
          className="admin__sideMenu"
          mode="inline"
          selectedKeys={currentPathKey ? [currentPathKey] : []}
          items={filteredItems}
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
            {/* --- THAY ĐỔI: CHỈ RENDER <Outlet /> NẾU ĐƯỢC PHÉP --- */}
            {isAllowedOnCurrentRoute ? (
              <Outlet />
            ) : (
              // Nếu không được phép, điều hướng về /dashboard
              // DashboardIndex.jsx sẽ bắt và chuyển về trang mặc định của họ
              <Navigate to="/dashboard" replace />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayouts;