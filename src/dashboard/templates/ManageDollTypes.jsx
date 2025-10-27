// ====================== IMPORTS ======================
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
  Image,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// ✅ Import toàn bộ hàm API đúng cú pháp
import {
  getDollTypes,
  createDollType,
  deleteDollType,
} from '../../service/api.doll';


// ====================== COMPONENT ======================
export default function ManageDollTypes() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // ====================== FETCH DATA ======================
  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await getDollTypes();

      // API trả về mảng trực tiếp
      setList(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching doll types:", error);
      message.error("Failed to fetch doll types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // ====================== FILTER ======================
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? list.filter((x) => x.name.toLowerCase().includes(s)) : list;
  }, [q, list]);

  // ====================== TABLE COLUMNS ======================
  const columns = [
    {
      title: "IMAGE",
      dataIndex: "image",
      width: 100,
      render: (img) =>
        img ? <Image src={img} alt="type" width={60} height={60} /> : "—",
    },
    { title: "TYPE NAME", dataIndex: "name" },
    { title: "DESCRIPTION", dataIndex: "description", ellipsis: true },
    {
      title: "STATUS",
      dataIndex: "isActive",
      width: 120,
      render: (active, record) => (
        <Space>
          {active ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          )}
          {record.isDeleted && <Tag color="volcano">Deleted</Tag>}
        </Space>
      ),
    },
    {
      title: "CREATE AT",
      dataIndex: "create_at",
      width: 180,
      render: (t) => (t ? new Date(t).toLocaleString() : "—"),
    },
    {
      title: "ACTIONS",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled
          />
          <Popconfirm
            title="Delete this type?"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.dollTypeID)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ====================== CRUD HANDLERS ======================

  // 🟢 Thêm mới
  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  // 🟡 Chỉnh sửa (chưa kích hoạt PUT)
  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  // 🔴 Xoá thật qua API
  const handleDelete = async (id) => {
    try {
      await deleteDollType(id);
      message.success("Deleted successfully");
      fetchTypes();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete type");
    }
  };

  // 🟢 Submit form (Add)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await createDollType(values);
      message.success("Added successfully");
      setOpen(false);
      form.resetFields();
      fetchTypes();
    } catch (error) {
      console.error(error);
      message.error("Failed to add type");
    }
  };

  // ====================== RENDER ======================
  return (
    <div className="panel" style={{ padding: 16 }}>
      <h2>Doll Types</h2>

      {/* Search + Add */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search types..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: 320 }}
        />
        <Button icon={<PlusOutlined />} onClick={handleAdd}>
          Add Type
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="dollTypeID"
        columns={columns}
        dataSource={filtered}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal Form */}
      <Modal
        title={editing ? "Edit Type" : "Add Type"}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Type Name"
            name="name"
            rules={[{ required: true, message: "Please enter type name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Image URL" name="image">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
