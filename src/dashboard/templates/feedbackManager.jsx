import React, { useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function FeedbackManager() {
  const [data, setData] = useState([
    {
      id: 1,
      user: "hoangnam123",
      feedback: "Great quality dolls, will buy again!",
      date: "2025-09-20",
    },
    {
      id: 2,
      user: "namht7",
      feedback: "Delivery was late but product is good.",
      date: "2025-09-18",
    },
    {
      id: 3,
      user: "aaaaa5432",
      feedback: "The rabbit doll is so cute!",
      date: "2025-09-15",
    },
  ]);

  const handleDelete = (id) => {
    setData(data.filter((f) => f.id !== id));
    message.success("Feedback deleted");
  };

  const columns = [
    { title: "User", dataIndex: "user" },
    { title: "Feedback", dataIndex: "feedback" },
    { title: "Date", dataIndex: "date", width: 120 },
    {
      title: "Action",
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Delete this feedback?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="panel" style={{ padding: 16 }}>
      <div className="panel__header">
        <h2>Feedback Management</h2>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        size="middle"
      />
    </div>
  );
}
