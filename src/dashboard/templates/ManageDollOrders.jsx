import React, { useState, useEffect } from "react";
import {
  Table,
  Select,
  message,
  Button,
  Popconfirm,
  Tag,
  Input,
  Radio,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getDollOrders,
  patchDollOrder,
  deleteDollOrder,
} from "../../service/api.order";
import { useDebounce } from "use-debounce";

const statusOptions = [
  { value: 0, label: "Pending", color: "gold" },
  { value: 1, label: "Processing", color: "processing" },
  { value: 2, label: "Shipping", color: "blue" },
  { value: 3, label: "Completed", color: "success" },
  { value: 4, label: "Cancelled", color: "error" },
];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [debouncedQ] = useDebounce(q, 500);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        page: params.pagination.current,
        pageSize: params.pagination.pageSize,
        search: params.search,
        sortBy: params.sortBy,
        sortDir: params.sortDir,
      };
      // Filter out undefined/null params
      Object.keys(queryParams).forEach(
        (key) =>
          (queryParams[key] == null || queryParams[key] === "") &&
          delete queryParams[key]
      );

      const data = await getDollOrders(queryParams);
      const formattedData = data.data.map((order) => ({
        ...order,
        key: order.orderID,
      }));
      setAllOrders(formattedData);
      setOrders(formattedData);
      setPagination({
        ...params.pagination,
        total: data.total,
      });
    } catch (error) {
      message.error("Failed to fetch orders.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    const sortDir =
      sorter.order === "ascend"
        ? "asc"
        : sorter.order === "descend"
        ? "desc"
        : undefined;

    fetchOrders({
      pagination: newPagination,
      search: debouncedQ,
      sortBy: sorter.field,
      sortDir: sortDir,
    });
  };

  useEffect(() => {
    if (statusFilter === "all") {
      setOrders(allOrders);
    } else {
      const filteredOrders = allOrders.filter(
        (order) => order.status === statusFilter
      );
      setOrders(filteredOrders);
    }
  }, [statusFilter, allOrders]);

  useEffect(() => {
    // Reset to page 1 when search changes
    const newPagination = { ...pagination, current: 1 };
    fetchOrders({
      pagination: newPagination,
      search: debouncedQ,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const getCurrentFetchParams = () => ({
    pagination,
    search: debouncedQ,
  });

  const updateStatus = async (id, status) => {
    try {
      await patchDollOrder(id, { status });
      message.success(`Order ${id} updated successfully.`);
      fetchOrders(getCurrentFetchParams());
    } catch (error) {
      console.error(error);
      message.error(`Failed to update order ${id}.`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDollOrder(id);
      message.success(`Order ${id} deleted successfully.`);
      fetchOrders(getCurrentFetchParams());
    } catch (error) {
      console.error(error);
      message.error(`Failed to delete order ${id}.`);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderID",
      width: 100,
      align: "center",
      sorter: true,
    },
    { title: "Customer", dataIndex: "userName", align: "center", sorter: true },
    {
      title: "Products",
      dataIndex: "orderItems",
      align: "center",
      render: (orderItems) => `${orderItems.length} item(s)`,
    },
    {
      title: "Price",
      dataIndex: "totalAmount",
      width: 150,
      align: "center",
      sorter: true,
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
          onChange={(newStatus) => updateStatus(record.orderID, newStatus)}
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
      title: "Order Date",
      dataIndex: "orderDate",
      align: "center",
      sorter: true,
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
          onConfirm={() => handleDelete(record.orderID)}
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
          Orders Management
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
            placeholder="Search by Order ID, Customer Name..."
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
        dataSource={orders}
        loading={loading}
        rowKey="orderID"
        pagination={{ ...pagination, showSizeChanger: true }}
        onChange={handleTableChange}
        size="middle"
      />
    </div>
  );
}