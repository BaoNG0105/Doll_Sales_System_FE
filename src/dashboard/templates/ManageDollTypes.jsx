import { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    Table,
    message,
    Popconfirm,
    Image,
    Space,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
    getDollTypes,
    postDollType,
    pathDollType,
    deleteDollType,
} from "../../service/api.doll";
import { useDebounce } from "use-debounce";

export default function ManageDollTypes() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [debouncedQ] = useDebounce(q, 500);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const fetchAndSetDollTypes = async (params = {}) => {
        setLoading(true);
        try {
            const queryParams = {
                page: params.pagination?.current || 1,
                pageSize: params.pagination?.pageSize || 5,
                search: params.search,
                sortBy: params.sorter?.field,
                sortDir: params.sorter?.order ? (params.sorter.order === "descend" ? "desc" : "asc") : undefined,
            };
            const response = await getDollTypes(queryParams);
            setList(response.items || []);
            setPagination(prev => ({
                ...prev,
                current: response.pagination.page,
                pageSize: response.pagination.pageSize,
                total: response.pagination.total || 0,
            }));
        } catch (error) {
            console.error("Failed to fetch doll types:", error);
            message.error("Failed to fetch doll types.");
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const newPagination = { ...pagination, current: 1 };
        fetchAndSetDollTypes({
            pagination: newPagination,
            search: debouncedQ
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQ]);

    const handleTableChange = (pagination, filters, sorter) => {
        fetchAndSetDollTypes({ pagination, sorter, search: q });
    };

    const onAdd = () => {
        form.resetFields();
        setEditing(null);
        setOpen(true);
    };

    const onEdit = (record) => {
        setEditing(record);
        form.setFieldsValue(record);
        setOpen(true);
    };

    const onDelete = async (dollTypeID) => {
        try {
            await deleteDollType(dollTypeID);
            message.success("Doll type deleted successfully!");
            fetchAndSetDollTypes({ pagination, search: q });
        } catch (error) {
            console.error("Failed to delete doll type:", error);
            message.error("Failed to delete doll type.");
        }
    };

    const onFinish = async (values) => {
        try {
            if (editing) {
                await pathDollType(editing.dollTypeID, values);
                message.success("Doll type updated successfully!");
            } else {
                await postDollType(values);
                message.success("Doll type added successfully!");
            }
            setOpen(false);
            fetchAndSetDollTypes({ pagination, search: q });
        } catch (error) {
            console.error("Failed to save doll type:", error);
            message.error("Failed to save doll type.");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "dollTypeID",
            key: "dollTypeID",
            align: "center",
            sorter: true,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            align: "center",
            sorter: true,
            render: (name) => (
                <span className="font-medium">{name}</span>
            ),
        },
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            align: "center",
            render: (url) => <Image width={60} src={url} />,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
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
                        title="Delete the doll type"
                        description="Are you sure to delete this doll type?"
                        onConfirm={() => onDelete(record.dollTypeID)}
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
                    Doll Types Management
                </h2>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Input
                        allowClear
                        prefix={<SearchOutlined />}
                        placeholder="Search by name, description..."
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
                        Add Doll Type
                    </Button>
                </div>
            </div>
            <Table
                loading={loading}
                columns={columns}
                dataSource={list}
                rowKey="dollTypeID"
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                }}
                onChange={handleTableChange}
                size="middle"
            />
            <Modal
                open={open}
                title={editing ? "Edit Doll Type" : "Add Doll Type"}
                onCancel={() => setOpen(false)}
                onOk={() => form.submit()}
                okText="Save"
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="image" label="Image URL">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}