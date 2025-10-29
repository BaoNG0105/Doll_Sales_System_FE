import { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    Table,
    Popconfirm,
    message,
    Image,
    Tag,
    Space,
    Select,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { useDebounce } from "use-debounce";
import FormImageUpload from "../components/FormImageUpload";

import {
    getDollModels,
    postDollModel,
    patchDollModel,
    softDeleteDollModel,
    getDollTypes,
} from "../../service/api.doll";

export default function ManageDollModels() {
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
    const [dollTypes, setDollTypes] = useState([]);
    const [form] = Form.useForm();

    const fetchAndSetDollModels = async (params = {}) => {
        setLoading(true);
        try {
            const queryParams = {
                page: params.pagination?.current || 1,
                pageSize: params.pagination?.pageSize || 5,
                search: params.search,
                sortBy: params.sorter?.field,
                sortDir: params.sorter?.order ? (params.sorter.order === "descend" ? "desc" : "asc") : undefined,
            };
            const response = await getDollModels(queryParams);
            setList(response.items || []);
            setPagination(prev => ({
                ...prev,
                current: response.pagination.page,
                pageSize: response.pagination.pageSize,
                total: response.pagination.total || 0,
            }));
        } catch (error) {
            console.error("Failed to fetch doll models:", error);
            message.error("Failed to fetch doll models.");
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDollTypes = async () => {
        try {
            // Fetch all types for the select dropdown, no pagination needed
            const response = await getDollTypes({ pageSize: 100 });
            setDollTypes(response.items || []);
        } catch (error) {
            console.error("Failed to fetch doll types for form:", error);
            message.error("Failed to load doll types for the form.");
        }
    };

    useEffect(() => {
        fetchDollTypes();
    }, []);

    useEffect(() => {
        const newPagination = { ...pagination, current: 1 };
        fetchAndSetDollModels({
            pagination: newPagination,
            search: debouncedQ
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQ]);

    const handleTableChange = (pagination, filters, sorter) => {
        fetchAndSetDollModels({ pagination, sorter, search: q });
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

    const onDelete = async (dollModelID) => {
        try {
            await softDeleteDollModel(dollModelID);
            message.success("Doll model deleted successfully!");
            fetchAndSetDollModels({ pagination, search: q });
        } catch (error) {
            console.error("Failed to delete doll model:", error);
            message.error("Failed to delete doll model.");
        }
    };

    const onFinish = async (values) => {
        try {
            if (editing) {
                await patchDollModel(editing.dollModelID, values);
                message.success("Doll model updated successfully!");
            } else {
                await postDollModel(values);
                message.success("Doll model added successfully!");
            }
            setOpen(false);
            fetchAndSetDollModels({ pagination, search: q });
        } catch (error) {
            console.error("Failed to save doll model:", error);
            message.error("Failed to save doll model.");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "dollModelID",
            key: "dollModelID",
            align: "center",
            sorter: true,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: true,
            render: (name) => <span className="font-medium">{name}</span>,
        },
        {
            title: "Doll Type",
            dataIndex: "dollTypeName",
            key: "dollTypeName",
            align: "center",
            sorter: true,
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
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            align: "center",
            sorter: true,
            render: (isActive) => (
                <Tag color={isActive ? "green" : "red"}>
                    {isActive ? "ACTIVE" : "INACTIVE"}
                </Tag>
            ),
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
                        title="Delete the doll model"
                        description="Are you sure to delete this doll model?"
                        onConfirm={() => onDelete(record.dollModelID)}
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
                    Doll Models Management
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
                        Add Doll Model
                    </Button>
                </div>
            </div>
            <Table
                loading={loading}
                columns={columns}
                dataSource={list}
                rowKey="dollModelID"
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
                title={editing ? "Edit Doll Model" : "Add Doll Model"}
                onCancel={() => setOpen(false)}
                onOk={() => form.submit()}
                okText="Save"
                width={600}
                >
                <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="dollTypeID" label="Doll Type" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select a doll type"
                            options={dollTypes.map(type => ({
                                value: type.dollTypeID,
                                label: type.name,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item name="image" label="Image">
                        <FormImageUpload />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}