import React, { useState, useEffect } from "react";
import { Table, Select, message, Button, Popconfirm, Tag, Input, Radio } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { getCharacterOrders, patchCharacterOrder, deleteCharacterOrder } from "../../service/api.order";
import { useDebounce } from "use-debounce";

const statusOptions = [
  { value: 0, label: "Pending", color: "processing" },
  { value: 1, label: "Active", color: "successful" },
  { value: 2, label: "Completed", color: "default" },
  { value: 3, label: "Canceled", color: "error" },
];

export default function ManageCharacterOrders() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [debouncedQ] = useDebounce(q, 500);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchCharacterOrders = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        page: params.pagination.current,
        pageSize: params.pagination.pageSize,
        search: params.search,
        status: params.status === "all" ? "" : params.status,
        sortBy: params.sortBy,
        sortDir: params.sortDir,
      };
      // Filter out undefined/null params
      Object.keys(queryParams).forEach(
        (key) => (queryParams[key] == null || queryParams[key] === "") && delete queryParams[key]
      );

      const response = await getCharacterOrders(queryParams);
      setAllOrders(response.items.map((order) => ({
        ...order,
        key: order.characterOrderID,
      })));
      setOrders(response.items.map((order) => ({
        ...order,
        key: order.characterOrderID,
      })));
      setPagination({
        ...params.pagination,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error("Failed to fetch character orders.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    const sortDir = sorter.order === "ascend" ? "asc" : sorter.order === "descend" ? "desc" : undefined;

    fetchCharacterOrders({
      pagination: newPagination,
      search: debouncedQ,
      status: statusFilter,
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
    // Reset to page 1 when search or filter changes
    const newPagination = { ...pagination, current: 1 };
    fetchCharacterOrders({
      pagination: newPagination,
      search: debouncedQ,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const getCurrentFetchParams = () => ({
    pagination,
    search: debouncedQ,
    status: statusFilter,
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await patchCharacterOrder(orderId, { status: newStatus });
      message.success("Order status updated successfully!");
      fetchCharacterOrders(getCurrentFetchParams());
    } catch (error) {
      console.error(error);
      message.error("Failed to update order status.");
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteCharacterOrder(orderId);
      message.success("Order deleted successfully!");
      fetchCharacterOrders(getCurrentFetchParams());
    } catch (error) {
      console.error(error);
      message.error("Failed to delete order.");
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "characterOrderID",
      key: "characterOrderID",
      align: "center",
      sorter: true,
    },
    {
      title: "Character",
      dataIndex: "characterName",
      key: "characterName",
      align: "center",
      sorter: true,
    },
    {
      title: "Package",
      dataIndex: "packageName",
      key: "packageName",
      align: "center",
      sorter: true,
    },
    {
      title: "Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "center",
      sorter: true,
      render: (price) =>
        `${price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}`,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      sorter: true,
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record.characterOrderID, value)}
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
      title: "Action",
      key: "action",
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
        <h2 style={{ fontSize: "30px", marginBottom: 16 }}>Character Orders Management</h2>
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
            placeholder="Search by User Name, Character, Package..."
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
        rowKey="characterOrderID"
        pagination={{ ...pagination, showSizeChanger: true }}
        onChange={handleTableChange}
        size="middle"
      />
    </div>
  );
}