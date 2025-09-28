// WarrantyPolicy.jsx — React + Ant Design
import React, { useState } from "react";
import { Form, Input, Button, Table, Space, message } from "antd";
import { FileProtectOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const seedPolicies = [
  { id: 1, title: "Default Warranty", description: "12 months manufacturer warranty." },
  { id: 2, title: "Return Policy", description: "7-day free return if defective." },
];

export default function WarrantyPolicy() {
  const [list, setList] = useState(seedPolicies);
  const [form] = Form.useForm();

  const columns = [
    { title: "TITLE", dataIndex: "title", width: 180 },
    { title: "DESCRIPTION", dataIndex: "description" },
    {
      title: "ACTIONS",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  function handleAdd(values) {
    const next = [...list, { id: (list.at(-1)?.id || 0) + 1, ...values }];
    setList(next);
    form.resetFields();
    message.success("Policy added");
  }

  function handleDelete(id) {
    const next = list.filter((x) => x.id !== id);
    setList(next);
    message.success("Policy deleted");
  }

  return (
    <div className="panel" style={{ padding: 16 }}>
      <h2><FileProtectOutlined /> Warranty & Return Policy Setup</h2>

      <Form
        layout="inline"
        form={form}
        onFinish={handleAdd}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="title" rules={[{ required: true }]}>
          <Input placeholder="Policy title" />
        </Form.Item>
        <Form.Item name="description" rules={[{ required: true }]}>
          <Input placeholder="Policy description" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add
          </Button>
        </Form.Item>
      </Form>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        pagination={false}
        size="middle"
      />
    </div>
  );
}
