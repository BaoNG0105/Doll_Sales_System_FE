import React, { useState } from "react";
import { Table, Select, message } from "antd";

export default function ManageOrders() {
  const [orders, setOrders] = useState([
    { id: 101, customer: "hoangnam123", product: "Dog Doll", price: "120.000đ", status: "Pending" },
    { id: 102, customer: "namht7", product: "Rabbit Doll", price: "200.000đ", status: "Shipped" },
    { id: 103, customer: "aaaaa5432", product: "Tiger Doll", price: "190.000đ", status: "Delivered" },
  ]);

  const updateStatus = (id, status) => {
    const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(next);
    message.success(`Order ${id} updated to ${status}`);
  };

  const columns = [
    { title: "Order ID", dataIndex: "id", width: 100 },
    { title: "Customer", dataIndex: "customer" },
    { title: "Product", dataIndex: "product" },
    { title: "Price", dataIndex: "price", width: 120 },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value) => updateStatus(record.id, value)}
          options={[
            { value: "Pending", label: "Pending" },
            { value: "Confirmed", label: "Confirmed" },
            { value: "Shipped", label: "Shipped" },
            { value: "Delivered", label: "Delivered" },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="panel" style={{ padding: 16 }}>
      <div className="panel__header">
        <h2>Order Management</h2>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={orders}
        pagination={{ pageSize: 5 }}
        size="middle"
      />
    </div>
  );
}
