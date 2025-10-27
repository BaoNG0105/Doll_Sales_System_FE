import React, { useState, useEffect, useMemo } from "react";
import { Table, Select, message, Button, Popconfirm, Tag, Input, Radio } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { getCharacterOrders, patchCharacterOrder, deleteCharacterOrder } from "../../service/api.order";

const statusOptions = [
  { value: 1, label: "Active", color: "success" },
  { value: 0, label: "Canceled", color: "error" },
];

export default function ManageCharacterOrders() {
  const [characterOrders, setCharacterOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchCharacterOrders = async () => {
    setLoading(true);
    try {
      const data = await getCharacterOrders();
      const formattedData = data.data.map((order) => ({
        ...order,
        key: order.characterOrderID,
      }));
      setCharacterOrders(formattedData);
    } catch (error) {
      message.error("Failed to fetch character orders.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacterOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return characterOrders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesSearch =
        q.trim() === "" ||
        order.characterName.toLowerCase().includes(q.trim().toLowerCase()) ||
        order.packageName.toLowerCase().includes(q.trim().toLowerCase()) ||
        String(order.characterOrderID).includes(q.trim());
      return matchesStatus && matchesSearch;
    });
  }, [characterOrders, q, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await patchCharacterOrder(id, { status });
      message.success(`Order ${id} updated successfully.`);
      fetchCharacterOrders();
    } catch (error) {
      console.error(error);
      message.error(`Failed to update order ${id}.`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCharacterOrder(id);
      message.success(`Order ${id} deleted successfully.`);
      fetchCharacterOrders();
    } catch (error) {
      console.error(error);
      message.error(`Failed to delete order ${id}.`);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "characterOrderID",
      width: 100,
      align: "center",
    },
    { title: "Character Name", dataIndex: "characterName", align: "center" },
    { title: "Package Name", dataIndex: "packageName", align: "center" },
    {
      title: "Price",
      dataIndex: "unitPrice",
      width: 150,
      align: "center",
      render: (price) =>
        `${price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 180,
      align: "center",
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 140 }}
          onChange={(newStatus) => updateStatus(record.characterOrderID, newStatus)}
          bordered={false}
        >
          {statusOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              <Tag color={opt.color}>{opt.label}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      align: "center",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Delete the order"
          description="Are you sure to delete this order?"
          onConfirm={() => handleDelete(record.characterOrderID)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="panel" style={{ padding: 16 }}>
      <div className="panel__header" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: "30px", marginBottom: 16 }}>
          Character Orders Management
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
            placeholder="Search by Order ID, Character, Package..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 320, background: "#fff" }}
          />
        </div>
        <Radio.Group
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
          style={{ marginTop: 16 }}
        >
          <Radio.Button value="all">All</Radio.Button>
          {statusOptions.map((opt) => (
            <Radio.Button key={opt.value} value={opt.value}>
              {opt.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        loading={loading}
        rowKey="characterOrderID"
        pagination={{ pageSize: 5, showSizeChanger: false }}
        size="middle"
      />
    </div>
  );
}