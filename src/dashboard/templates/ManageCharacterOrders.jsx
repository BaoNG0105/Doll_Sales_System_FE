import React, { useState, useEffect, useMemo } from "react"; // <-- 1. THÊM useMemo
import { Table, message, Button, Popconfirm, Tag, Input, Radio } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { getCharacterOrders, deleteCharacterOrder } from "../../service/api.order";
import { useDebounce } from "use-debounce";

// <-- 2. CẬP NHẬT statusOptions (dùng value là CHỮ)
const statusOptions = [
  { value: "Pending", label: "Pending", color: "gold" },
  { value: "Completed", label: "Completed", color: "success" },
];

export default function ManageCharacterOrders() {
  const [orders, setOrders] = useState([]); // Đây sẽ là danh sách GỐC từ API
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [debouncedQ] = useDebounce(q, 500);
  const [statusFilter, setStatusFilter] = useState("all"); // Giá trị là "all", "Pending", "Completed"
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
        // status: params.status === "all" ? "" : params.status, // <-- 3. XÓA status filter khỏi API query
        sortBy: params.sortBy,
        sortDir: params.sortDir,
      };
      Object.keys(queryParams).forEach(
        (key) => (queryParams[key] == null || queryParams[key] === "") && delete queryParams[key]
      );

      const response = await getCharacterOrders(queryParams);
      // setOrders lưu trữ danh sách GỐC (chưa filter status)
      setOrders(
        response.items.map((order) => ({
          ...order,
          key: order.characterOrderID,
        }))
      );
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
      // status: statusFilter, // <-- 4. XÓA status
      sortBy: sorter.field,
      sortDir: sortDir,
    });
  };

  useEffect(() => {
    const newPagination = { ...pagination, current: 1 };
    fetchCharacterOrders({
      pagination: newPagination,
      search: debouncedQ,
      // status: statusFilter, // <-- 5. XÓA status
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]); // <-- 6. XÓA statusFilter khỏi dependency array

  const getCurrentFetchParams = () => ({
    pagination,
    search: debouncedQ,
    // status: statusFilter, // <-- 7. XÓA status
  });

  const handleDelete = async (orderId) => {
    try {
      await deleteCharacterOrder(orderId);
      message.success("Order deleted successfully!");
      fetchCharacterOrders(getCurrentFetchParams()); // Fetch lại data sau khi xóa
    } catch (error) {
      console.error(error);
      message.error("Failed to delete order.");
    }
  };

  const columns = [
    // ... (các cột Order ID, Character, Package, Price, Created At giữ nguyên)
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
      render: (status) => {
        if (status == null) {
          return <Tag>N/A</Tag>;
        }
        
        // So sánh 'status' (chữ) với 'opt.label' (chữ)
        const statusObj = statusOptions.find(
          (opt) => opt.label.toLowerCase() === status.toLowerCase()
        );
        
        return statusObj ? (
          <Tag color={statusObj.color}>{statusObj.label}</Tag>
        ) : (
          <Tag>Unknown ({status})</Tag>
        );
      },
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

  // <-- 8. DÙNG useMemo ĐỂ LỌC DATA TRÊN FRONTEND
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") {
      return orders; // Trả về toàn bộ danh sách nếu filter là "all"
    }
    // Trả về danh sách đã lọc nếu filter là "Pending" hoặc "Completed"
    return orders.filter(
      (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [orders, statusFilter]); // Chỉ tính toán lại khi 'orders' (từ API) hoặc 'statusFilter' (từ Radio) thay đổi

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

        {/* <-- 9. CẬP NHẬT Radio.Group (value là CHỮ) */}
        <Radio.Group
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
          style={{ marginTop: 16 }}
        >
          <Radio.Button value="all">All</Radio.Button>
          {statusOptions.map((opt) => (
            // Value là CHỮ ("Pending" hoặc "Completed")
            <Radio.Button key={opt.value} value={opt.value}>
              {opt.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <Table
        columns={columns}
        dataSource={filteredOrders} // <-- 10. SỬ DỤNG dataSource đã lọc
        loading={loading}
        rowKey="characterOrderID"
        pagination={{ ...pagination, showSizeChanger: true }}
        onChange={handleTableChange}
        size="middle"
      />
    </div>
  );
}