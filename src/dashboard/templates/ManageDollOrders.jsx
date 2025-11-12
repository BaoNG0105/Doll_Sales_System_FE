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
import {
  SearchOutlined,
  DeleteOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  getDollOrders,
  patchDollOrder,
  deleteDollOrder,
} from "../../service/api.order";
import { useDebounce } from "use-debounce";

// 1:Pending, 2:Processing, 3:Shipping, 4:Completed
const statusOptions = [
  { value: 1, label: "Pending", color: "gold" },
  { value: 2, label: "Processing", color: "processing" },
  { value: 3, label: "Shipping", color: "blue" },
  { value: 4, label: "Completed", color: "success" },
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
      console.error(
        "Error fetching orders:",
        error.response || error.message || error
      );
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

  // --- SỬA LỖI 1: CẬP NHẬT LOGIC BỘ LỌC (FILTER) ---
  useEffect(() => {
    if (statusFilter === "all") {
      setOrders(allOrders);
    } else {
      // Giờ statusFilter là chữ ("Pending", "Processing"...)
      // nên ta so sánh trực tiếp với order.status
      const filteredOrders = allOrders.filter(
        (order) => order.status === statusFilter
      );
      setOrders(filteredOrders);
    }
  }, [statusFilter, allOrders]);

  useEffect(() => {
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
      // API vẫn nhận SỐ (1, 2, 3, 4) để cập nhật
      await patchDollOrder(id, { status });
      message.success(`Order ${id} updated successfully.`);
      fetchOrders(getCurrentFetchParams());
    } catch (error) {
      message.error(`Failed to update order ${id}.`);
      console.error(
        "Error updating status:",
        error.response || error.message || error
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDollOrder(id);
      message.success(`Order ${id} deleted successfully.`);
      fetchOrders(getCurrentFetchParams());
    } catch (error) {
      message.error(`Failed to delete order ${id}.`);
      console.error(
        "Error deleting order:",
        error.response || error.message || error
      );
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
      dataIndex: "dollVariantName",
      align: "center",
      render: (dollVariantName) => dollVariantName || "N/A",
    },
    {
      title: "Price",
      dataIndex: "totalAmount",
      width: 150,
      align: "center",
      sorter: true,
      render: (price) =>
        `${(price || 0).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}`,
    },

    // --- SỬA LỖI 2: CỘT STATUS ---
    // So sánh 'status' (dạng chữ) với 'opt.label'
    {
      title: "Status",
      dataIndex: "status",
      width: 180,
      align: "center",
      render: (status) => {
        if (status == null) {
          return <Tag>N/A</Tag>;
        }
        
        // So sánh label (chữ) thay vì value (số)
        const statusObj = statusOptions.find(
          (opt) => opt.label.toLowerCase() === status.toLowerCase()
        );
        
        return statusObj ? (
          <Tag color={statusObj.color}>{statusObj.label}</Tag>
        ) : (
          <Tag>Unknown ({status})</Tag> // Sẽ không còn lỗi này
        );
      },
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      align: "center",
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },

    // --- SỬA LỖI 3: CỘT ACTIONS ---
    // Dùng switch/case với 'status' (dạng chữ)
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => {
        if (record.status == null) {
          return null;
        }

        const { orderID, status } = record;

        // Dùng 'status' (chữ) để switch
        switch (status) { 
          case "Pending": // 1
            return (
              <Popconfirm
                title="Delete this order?"
                description="Are you sure to delete this order?"
                onConfirm={() => handleDelete(orderID)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            );

          case "Processing": // 2
            return (
              <Popconfirm
                title="Set order to Shipping?"
                description="This will update the status to 'Shipping'."
                // Khi cập nhật, ta vẫn gửi SỐ 3 (Shipping) cho API
                onConfirm={() => updateStatus(orderID, 3)} 
                okText="Yes, Ship"
                cancelText="No"
              >
                <Button type="primary" icon={<SendOutlined />}>
                  Ship
                </Button>
              </Popconfirm>
            );

          case "Shipping": // 3
            return <Tag color="blue">En route</Tag>;

          case "Completed": // 4
            return <Tag color="success">Done</Tag>;

          default:
            return null;
        }
      },
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
        
        {/* --- SỬA LỖI 4: THAY ĐỔI VALUE CỦA BỘ LỌC RADIO --- */}
        <Radio.Group
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
          style={{ marginTop: 16 }}
        >
          <Radio.Button value="all">All</Radio.Button>
          {statusOptions.map((opt) => (
            // Đặt value là 'opt.label' (chữ) thay vì 'opt.value' (số)
            <Radio.Button key={opt.value} value={opt.label}>
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