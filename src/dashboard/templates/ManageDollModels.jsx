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
  Image,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  getDollModels,
  createDollModel,
  softDeleteDollModel,
} from "../../service/api.doll"; // ✅ Import API

export default function ManageDollModels() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // ================= LOAD DATA FROM API =================
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDollModels();
      // API trả về { message, data: [...] }
      setList(res.data || []);
    } catch (error) {
      message.error("❌ Failed to fetch doll models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SEARCH =================
  const filtered = q.trim()
    ? list.filter((x) =>
        x.name.toLowerCase().includes(q.trim().toLowerCase())
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
      await softDeleteDollModel(id);
      message.success("🗑️ Deleted successfully");
      fetchData();
    } catch (error) {
      message.error("❌ Failed to delete model");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        // ❗ Nếu bạn có API update thì thêm tại đây
        message.info("Editing mode not implemented yet");
      } else {
        await createDollModel(values);
        message.success("✅ Added new doll model");
      }
      setOpen(false);
      setEditing(null);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error("❌ Failed to save model");
    }
  };

  // ================= COLUMNS =================
  const columns = [
    {
      title: "IMAGE",
      dataIndex: "image",
      render: (img) =>
        img ? (
          <Image
            src={img}
            alt="model"
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          "—"
        ),
      width: 100,
    },
    { title: "MODEL NAME", dataIndex: "name" },
    { title: "TYPE NAME", dataIndex: "dollTypeName" },
    { title: "DESCRIPTION", dataIndex: "description", ellipsis: true },
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
            title="Are you sure to delete this model?"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(r.dollModelID)}
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
      <h2 style={{ marginBottom: 16 }}>🧸 Doll Models</h2>

      {/* Search & Add */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search models..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: 320 }}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
          Add Model
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="dollModelID"
        columns={columns}
        dataSource={filtered}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal */}
      <Modal
        title={editing ? "Edit Model" : "Add Model"}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText={editing ? "Save" : "Add"}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Model Name"
            name="name"
            rules={[{ required: true, message: "Please enter model name" }]}
          >
            <Input placeholder="Enter model name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: "Please enter image URL" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item
            label="Type ID"
            name="dollTypeID"
            rules={[{ required: true, message: "Please enter Doll Type ID" }]}
          >
            <Input placeholder="Enter Type ID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
