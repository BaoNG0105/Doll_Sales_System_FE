import React, { useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Input, Layout, Menu, theme } from "antd";

const { Header, Content, Sider } = Layout;

const topNav = ["Dashboard", "Orders", "Settings"].map((label, i) => ({
  key: String(i + 1),
  label,
}));

const sideNav = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (Icon, i) => {
    const key = `sub${i + 1}`;
    return {
      key,
      icon: <Icon />,
      label: `Menu ${i + 1}`,
      children: Array.from({ length: 4 }).map((_, j) => {
        const subKey = i * 4 + j + 1;
        return { key: String(subKey), label: `Option ${subKey}` };
      }),
    };
  }
);

export default function Adminlayouts() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f6f7fb" }}>
      {/* Header */}
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 16px",
          background: "linear-gradient(90deg,#0ea5e9,#6366f1)",
          boxShadow: "0 6px 20px rgba(14,165,233,.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              display: "grid",
              placeItems: "center",
              borderRadius: 10,
              background: "rgba(255,255,255,.2)",
              backdropFilter: "blur(4px)",
              color: "white",
            }}
          >
            🧸
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
            Doll Admin
          </span>
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={topNav}
          style={{ flex: 1, minWidth: 0, background: "transparent" }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search…"
            style={{ borderRadius: 999, maxWidth: 220 }}
          />
          <Avatar size={36} style={{ background: "#2b90ff" }}>
            L
          </Avatar>
        </div>
      </Header>

      {/* Main Body */}
      <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
        <Sider
          width={240}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          theme="light"
          style={{
            borderRight: "1px solid #eef1f6",
            background: "#fff",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <div style={{ padding: "10px 12px" }}>
            <Button
              size="small"
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>

          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            items={sideNav}
            style={{
              height: "calc(100vh - 100px)",
              borderInlineEnd: 0,
              padding: "8px 8px 16px",
            }}
          />
        </Sider>

        <Layout style={{ background: "#f6f7fb", flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", padding: "24px 16px 0 16px" }}>
            <Breadcrumb
              items={[{ title: "Home" }, { title: "List" }, { title: "App" }]}
              style={{ margin: "16px 0", color: "#64748b" }}
            />

            <Content
              style={{
                padding: 24,
                background: "#fff",
                borderRadius: 16,
                minHeight: 280,
                boxShadow: "0 10px 30px rgba(2,6,23,.07)",
                maxWidth: 1200, // Chỉ đặt maxWidth ở đây
                margin: "0 auto", // Căn giữa Content
                width: "100%",
              }}
            >
              {/* Dashboard cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                {[
                  { title: "Revenue", value: "12,000,000 VND" },
                  { title: "Orders", value: "150" },
                  { title: "Best Seller", value: "Doll Elsa" },
                ].map((c) => (
                  <div
                    key={c.title}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 12,
                      padding: 16,
                      border: "1px solid #eef1f6",
                    }}
                  >
                    <div style={{ color: "#64748b", fontSize: 13 }}>{c.title}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>
                      {c.value}
                    </div>
                  </div>
                ))}
              </div>
              Content
            </Content>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
}