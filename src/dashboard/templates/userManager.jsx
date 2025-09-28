// UserManager.jsx — React + Ant Design (no image imports)
import React, { useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Form,
  Table,
  Space,
  Popconfirm,
  Avatar,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

/* -------- Helpers -------- */
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function colorFromString(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsl(${hue}deg 70% 45%)`;
}

/* -------- Demo data -------- */
const seedUsers = [
  { id: 1, name: "Alice Nguyen", email: "alice@example.com", role: "Admin", avatar: "" },
  { id: 2, name: "Bob Tran", email: "bob@example.com", role: "User", avatar: "" },
  { id: 3, name: "Charlie Le", email: "charlie@example.com", role: "Editor", avatar: "" },
  { id: 4, name: "David Pham", email: "david@example.com", role: "User", avatar: "" },
];

export default function UserManager({ initial = seedUsers, onChange }) {
  const [list, setList] = useState(initial);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        (u.role || "").toLowerCase().includes(s)
    );
  }, [q, list]);

  const columns = [
    {
      title: "AVATAR",
      dataIndex: "avatar",
      width: 90,
      render: (_, record) => {
        const initials = getInitials(record.name);
        return record.avatar ? (
          <Avatar
            src={record.avatar}
            shape="circle"
            size={48}
          />
        ) : (
          <Avatar
            shape="circle"
            size={48}
            style={{
              background: colorFromString(record.name),
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
        );
      },
    },
    { title: "NAME", dataIndex: "name" },
    { title: "EMAIL", dataIndex: "email" },
    { title: "ROLE", dataIndex: "role", width: 120 },
    {
      title: "ACTIONS",
      width: 120,
      render: (_, r) => (
        <Space>
          <Button
            className="btn-pill btn-edit"
            icon={<EditOutlined />}
            onClick={() => handleEdit(r)}
          />
          <Popconfirm
            title="Delete this user?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(r.id)}
          >
            <Button className="btn-pill btn-danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  }
  function handleEdit(rec) {
    setEditing(rec);
    form.setFieldsValue(rec);
    setOpen(true);
  }
  function handleDelete(id) {
    const next = list.filter((x) => x.id !== id);
    setList(next);
    onChange?.(next);
    message.success("User deleted");
  }
  function handleOk() {
    form.validateFields().then((values) => {
      if (editing) {
        const next = list.map((x) =>
          x.id === editing.id ? { ...editing, ...values } : x
        );
        setList(next);
        onChange?.(next);
        message.success("User updated");
      } else {
        const next = [...list, { ...values, id: (list.at(-1)?.id || 0) + 1 }];
        setList(next);
        onChange?.(next);
        message.success("User added");
      }
      setOpen(false);
      setEditing(null);
      form.resetFields();
    });
  }
  function handleCancel() {
    setOpen(false);
    setEditing(null);
    form.resetFields();
  }

  return (
    <div className="panel" style={{ padding: 16 }}>
      <div className="panel__header">
        <h2>Users</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search by name/email/role…"
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
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 5, showSizeChanger: false }}
        size="middle"
      />

      <Modal
        title={editing ? "Edit User" : "Add User"}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editing ? "Save" : "Add"}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{ name: "", email: "", role: "User", avatar: "" }}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g., John Doe" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="e.g., john@example.com" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Input placeholder="e.g., Admin / User / Editor" />
          </Form.Item>
          <Form.Item
            label="Avatar URL"
            name="avatar"
            tooltip="Để trống sẽ dùng avatar chữ tự sinh."
          >
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
