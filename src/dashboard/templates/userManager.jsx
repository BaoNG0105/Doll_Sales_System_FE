import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Form,
  Table,
  Space,
  Popconfirm,
  message,
  Radio,
  Tag,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  UnlockOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  getUsers,
  postUser,
  pathUser,
  deleteUser,
} from "../../service/api.user";

/* -------- Main Component -------- */
export default function UserManager() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchAndSetUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setList(data || []);
    } catch (error) {
      message.error("Failed to fetch users.");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetUsers();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return list.filter((user) => {
      const matchesRole =
        roleFilter === "all" || user.role.toLowerCase() === roleFilter;
      const matchesSearch =
        !s ||
        user.userName.toLowerCase().includes(s) ||
        user.email.toLowerCase().includes(s) ||
        (user.phones || "").toLowerCase().includes(s);
      return matchesRole && matchesSearch;
    });
  }, [q, list, roleFilter]);

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.status === "Active" ? "DeActive" : "Active";
      await pathUser(user.userID, { status: newStatus });
      message.success(`User status changed successfully!`);
      fetchAndSetUsers();
    } catch (error) {
      message.error("Failed to change user status.");
      console.error("Error toggling user status:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      message.success("User soft deleted successfully!");
      fetchAndSetUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "userID",
      key: "userID",
      width: 80,
      align: "center",
    },
    {
      title: "USER",
      dataIndex: "userName",
      key: "userName",
      align: "center",
    },
    { title: "EMAIL", dataIndex: "email", key: "email", align: "center" },
    { title: "PHONES", dataIndex: "phones", key: "phones", align: "center" },
    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role) => (
        <Tag
          color={
            role === "admin"
              ? "volcano"
              : role === "manager"
              ? "gold"
              : "geekblue"
          }
        >
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "isDeleted",
      key: "isDeleted",
      align: "center",
      render: (isDeleted) =>
        isDeleted ? (
          <Tag color="red">Blocked</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={`Are you sure to ${
              record.isDeleted ? "unlock" : "lock"
            } this user?`}
            onConfirm={() => handleToggleStatus(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="btn-pill"
              icon={record.isDeleted ? <UnlockOutlined /> : <LockOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="Delete this user permanently?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.userID)}
          >
            <Button
              className="btn-pill btn-danger"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function handleAdd() {
    form.resetFields();
    setOpen(true);
  }

  function handleOk() {
    form.validateFields().then(async (values) => {
      try {
        await postUser(values);
        message.success("User added successfully");
        setOpen(false);
        form.resetFields();
        fetchAndSetUsers();
      } catch (error) {
        console.error("Error saving user:", error);
        message.error("An error occurred. Please try again.");
      }
    });
  }

  function handleCancel() {
    setOpen(false);
  }

  return (
    <div className="panel" style={{ padding: 16 }}>
      <div className="panel__header" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: "30px", marginBottom: 16 }}>
          Users Management
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search by name, email, phone..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 320, background: "#fff" }}
          />
          <Button
            className="btn-accent btn-rounded"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add User
          </Button>
        </div>
        <Radio.Group
          onChange={(e) => setRoleFilter(e.target.value)}
          value={roleFilter}
          style={{ marginTop: 16 }}
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="admin">Admin</Radio.Button>
          <Radio.Button value="manager">Manager</Radio.Button>
          <Radio.Button value="customer">Customer</Radio.Button>
        </Radio.Group>
      </div>

      <Table
        rowKey="userID"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 5, showSizeChanger: false }}
        size="middle"
        loading={loading}
      />

      <Modal
        title="Add User"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{ role: "customer" }}
        >
          <Form.Item
            label="User Name"
            name="userName"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g., John Doe" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="e.g., john.doe@example.com" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Enter a strong password" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phones"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g., 0912345678" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="customer">Customer</Radio>
              <Radio value="manager">Manager</Radio>
              <Radio value="admin">Admin</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}