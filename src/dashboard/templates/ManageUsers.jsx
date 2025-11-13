import { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    Table,
    message,
    Popconfirm,
    Tag,
    Space,
    Select,
    Switch,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    getUsers,
    postUser,
    pathUser,
    deleteUser,
} from "../../service/api.user";
import { useDebounce } from "use-debounce";

export default function ManageUsers() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [debouncedQ] = useDebounce(q, 500);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const fetchAndSetUsers = async (params = {}) => {
        setLoading(true);
        try {
            const queryParams = {
                page: params.pagination?.current || 1,
                pageSize: params.pagination?.pageSize || 10,
                search: params.search,
                sortBy: params.sorter?.field,
                sortDir: params.sorter?.order
                    ? params.sorter.order === "descend"
                        ? "desc"
                        : "asc"
                    : undefined,
            };
            const response = await getUsers(queryParams);
            if (response.success && response.data) {
                setList(response.data);
                setPagination((prev) => ({
                    ...prev,
                    current: response.pagination.page,
                    pageSize: response.pagination.pageSize,
                    total: response.pagination.total,
                }));
            } else {
                setList([]);
                message.error(response.message || "Failed to fetch users.");
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            message.error("Failed to fetch users.");
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const newPagination = { ...pagination, current: 1 };
        fetchAndSetUsers({
            pagination: newPagination,
            search: debouncedQ,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQ]);

    const handleTableChange = (pagination, filters, sorter) => {
        // Note: The `filters` object from AntD is used for client-side filtering.
        // If you wanted server-side filtering, you would pass `filters` to `fetchAndSetUsers`.
        // Here, we only handle pagination and sorting from the server.
        fetchAndSetUsers({ pagination, sorter, search: q });
    };

    const onAdd = () => {
        form.resetFields();
        setEditing(null);
        setOpen(true);
    };

    const onEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            ...record,
            // Dữ liệu đã là chuỗi, không cần chuyển đổi
            status: record.status,
        });
        setOpen(true);
    };

    const onDelete = async (userId) => {
        try {
            await deleteUser(userId);
            message.success("User deleted successfully!");
            fetchAndSetUsers({ pagination, search: q });
        } catch (error) {
            console.error("Failed to delete user:", error);
            message.error("Failed to delete user.");
        }
    };

    const onFinish = async (values) => {
        const finalValues = { ...values }; // Gửi thẳng values

        try {
            if (editing) {
                await pathUser(editing.userID, finalValues);
                message.success("User updated successfully!");
            } else {
                await postUser(finalValues);
                message.success("User added successfully!");
            }
            setOpen(false);
            fetchAndSetUsers({ pagination, search: q });
        } catch (error) {
            console.error("Failed to save user:", error);
            message.error("Failed to save user.");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "userID",
            key: "userID",
            align: "center",
            sorter: true,
        },
        {
            title: "Username",
            dataIndex: "userName",
            key: "userName",
            sorter: true,
            render: (name) => <span className="font-medium">{name}</span>,
        },
        {
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
            sorter: true,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: true,
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            align: "center",
            sorter: true,
            filters: [
                { text: "Admin", value: "admin" },
                { text: "Manager", value: "manager" },
                { text: "Customer", value: "customer" },
            ],
            onFilter: (value, record) => record.role.indexOf(value) === 0,
            render: (role) => {
                let color = "geekblue";
                if (role === "admin") color = "volcano";
                if (role === "manager") color = "green";
                return <Tag color={color}>{role?.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            sorter: true,
            render: (status) => (
                <Tag color={status === "Active" ? "green" : "red"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="Delete the user"
                        description="Are you sure to delete this user permanently?"
                        onConfirm={() => onDelete(record.userID)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="panel" style={{ padding: 16 }}>
            <div className="panel__header" style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: "30px", marginBottom: 16 }}>
                    Users Management
                </h2>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Input
                        allowClear
                        prefix={<SearchOutlined />}
                        placeholder="Search by name, email..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        style={{ width: 320, background: "#fff" }}
                    />
                    <Button
                        type="primary"
                        danger
                        icon={<PlusOutlined />}
                        onClick={onAdd}
                    >
                        Add User
                    </Button>
                </div>
            </div>
            <Table
                loading={loading}
                columns={columns}
                dataSource={list}
                rowKey="userID"
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                }}
                onChange={handleTableChange}
                size="middle"
            />
            <Modal
                open={open}
                title={editing ? "Edit User" : "Add User"}
                onCancel={() => setOpen(false)}
                onOk={() => form.submit()}
                okText="Save"
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="mt-6"
                >
                    {/* Username */}
                    <Form.Item
                        name="userName"
                        label="Username"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* Email */}
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: "email" }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* Password */}
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: !editing }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    {/* Full Name */}
                    <Form.Item name="fullName" label="Full Name">
                        <Input />
                    </Form.Item>
                    {/* Phone */}
                    <Form.Item name="phones" label="Phone">
                        <Input />
                    </Form.Item>
                    {/* Role */}
                    <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="customer">Customer</Select.Option>
                            <Select.Option value="manager">Manager</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                    {/* Status */}
                    <Form.Item name="status" label="Status">
                        <Select>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}