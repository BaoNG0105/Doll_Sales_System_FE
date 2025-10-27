import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Form,
  Table,
  Space,
  Popconfirm,
  message,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  getDollVariants,
  createDollVariant,
  deleteDollVariant,
} from "../../service/api.doll";

export default function ManageDollVariants() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // ================= LOAD DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDollVariants(); // ✅ Gọi API thật
      setList(res.data || []);
    } catch (error) {
      console.error(error);
      message.error("❌ Failed to fetch doll variants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  const filtered = q.trim()
    ? list.filter(
        (v) =>
          v.name?.toLowerCase().includes(q.trim().toLowerCase()) ||
          String(v.dollModelID).includes(q.trim())
      )
    : list;

  // ================= CRUD =================
  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (rec) => {
    setEditing(rec);
    form.setFieldsValue(rec);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDollVariant(id);
      message.success("🗑️ Deleted successfully");
      fetchData();
    } catch (error) {
      message.error("❌ Failed to delete variant");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        // ❗ Nếu có API PATCH thì thêm ở đây
        message.info("Edit feature not implemented yet");
      } else {
        await createDollVariant(values);
        message.success("✅ Added new variant");
      }
      setOpen(false);
      setEditing(null);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error("❌ Failed to save variant");
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { title: "VARIANT NAME", dataIndex: "name" },
    { title: "MODEL ID", dataIndex: "dollModelID", width: 100 },
    { title: "STOCK", dataIndex: "stock", width: 100 },
    {
      title: "PRICE",
      dataIndex: "price",
      width: 100,
      render: (val) =>
        val ? `${val.toLocaleString("vi-VN")}₫` : <Tag color="default">N/A</Tag>,
    },
    {
      title: "STATUS",
      dataIndex: "isActive",
      width: 100,
      render: (val) =>
        val ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "CREATE AT",
      dataIndex: "create_at",
      render: (t) =>
        t ? new Date(t).toLocaleString() : <Tag color="default">N/A</Tag>,
      width: 180,
    },
    {
      title: "ACTIONS",
      width: 120,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
          <Popconfirm
            title="Delete this variant?"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(r.dollVariantID)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ================= RENDER =================
  return (
    <div className="panel" style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>🎨 Doll Variants</h2>

      {/* Search + Add */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search variants..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: 320 }}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
          Add Variant
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="dollVariantID"
        columns={columns}
        dataSource={filtered}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal */}
      <Modal
        title={editing ? "Edit Variant" : "Add Variant"}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText={editing ? "Save" : "Add"}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Variant Name"
            name="name"
            rules={[{ required: true, message: "Please enter variant name" }]}
          >
            <Input placeholder="Enter variant name" />
          </Form.Item>

          <Form.Item
            label="Model ID"
            name="dollModelID"
            rules={[{ required: true, message: "Please enter model ID" }]}
          >
            <Input placeholder="Enter doll model ID" />
          </Form.Item>

          <Form.Item
            label="Stock Quantity"
            name="stock"
            rules={[{ required: true, message: "Please enter stock quantity" }]}
          >
            <Input placeholder="Enter quantity" />
          </Form.Item>

          <Form.Item
            label="Price (VND)"
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input placeholder="Enter price (e.g. 200000)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
