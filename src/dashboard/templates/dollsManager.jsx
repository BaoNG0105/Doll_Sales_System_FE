// DollsManager.jsx — React + Ant Design (no image imports)
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
// Lấy 2 chữ cái đầu từ tên
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
// Tạo màu ổn định từ tên
function colorFromString(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsl(${hue}deg 70% 45%)`;
}

/* -------- Demo data -------- */
const seedProducts = [
  { id: 1, name: "Dog Doll",    description: "Cute and cuddly for all ages.",           price: "120.000đ", image: "" },
  { id: 2, name: "Snake Doll",  description: "Friendly doll with a charming smile.",    price: "150.000đ", image: "" },
  { id: 3, name: "Monkey Doll", description: "Playful doll that brings endless fun.",   price: "130.000đ", image: "" },
  { id: 4, name: "Pig Doll",    description: "Soft and squishy for cozy hugs.",         price: "180.000đ", image: "" },
  { id: 5, name: "Rabbit Doll", description: "Adorable with long, floppy ears.",        price: "200.000đ", image: "" },
  { id: 6, name: "Tiger Doll",  description: "Brave doll for adventurous playtime.",    price: "190.000đ", image: "" },
];

export default function DollsManager({ initial = seedProducts, onChange }) {
  const [list, setList] = useState(initial);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        (p.price || "").toLowerCase().includes(s)
    );
  }, [q, list]);

  const columns = [
    {
      title: "IMAGE",
      dataIndex: "image",
      width: 90,
      render: (_, record) => {
        const initials = getInitials(record.name);
        return record.image ? (
          <Avatar
            src={record.image}
            shape="square"
            size={48}
            style={{ borderRadius: 12 }}
          />
        ) : (
          <Avatar
            shape="square"
            size={48}
            style={{
              borderRadius: 12,
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
    { title: "DESCRIPTION", dataIndex: "description", ellipsis: true },
    { title: "PRICE", dataIndex: "price", width: 120 },
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
            title="Delete this product?"
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
    message.success("Deleted");
  }
  function handleOk() {
    form.validateFields().then((values) => {
      if (editing) {
        const next = list.map((x) =>
          x.id === editing.id ? { ...editing, ...values } : x
        );
        setList(next);
        onChange?.(next);
        message.success("Updated");
      } else {
        const next = [...list, { ...values, id: (list.at(-1)?.id || 0) + 1 }];
        setList(next);
        onChange?.(next);
        message.success("Added");
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
        <h2>Products</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search by name/price/description…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 320, background: "#fff" }}
          />
          <Button
            className="btn-accent btn-rounded"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Product
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
        title={editing ? "Edit Product" : "Add Product"}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editing ? "Save" : "Add"}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{ name: "", description: "", price: "", image: "" }}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Panda Doll" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder="Short description…" />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <Input placeholder="e.g., 150.000đ" />
          </Form.Item>
          <Form.Item
            label="Image URL"
            name="image"
            tooltip="Để trống sẽ dùng avatar chữ tự sinh."
          >
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
