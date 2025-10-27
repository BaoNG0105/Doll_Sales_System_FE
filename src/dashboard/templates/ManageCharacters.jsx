import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Form, Table, Space, Popconfirm, Avatar, message, InputNumber } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { getCharacters, postCharacter, pathCharacter, deleteCharacter } from "../../service/api.character";

// Helpers
function getInitials(name = "") {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorFromString(str = "") {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    const hue = h % 360;
    return `hsl(${hue}deg 70% 45%)`;
}

export default function ManageCharacters() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const fetchAndSetCharacters = async () => {
        setLoading(true);
        try {
            const data = await getCharacters();
            setList(data);
        } catch (error) {
            console.error("Failed to fetch characters:", error);
            message.error("Failed to fetch characters.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndSetCharacters();
    }, []);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return list;
        return list.filter(
            (c) =>
                c.name.toLowerCase().includes(s) ||
                (c.description || "").toLowerCase().includes(s)
        );
    }, [q, list]);

    const columns = [
        {
            title: "ID",
            dataIndex: "characterId",
            key: "characterId",
            width: 50, // Độ rộng cho cột ID
            align: "center", // Căn giữa nội dung trong cột ID
        },
        {
            title: "IMAGE",
            dataIndex: "image",
            key: "image",
            width: 80,
            align: "center",
            render: (image, record) => {
                const initials = getInitials(record.name);
                return image ? (
                    <Avatar
                        src={image}
                        shape="square"
                        size={48}
                        style={{ borderRadius: 12 }}
                    />
                ) : (
                    <Avatar
                        shape="square"
                        size={60}
                        style={{
                            borderRadius: 12,
                            background: colorFromString(record.name),
                            color: "#fff",
                            fontWeight: 700,
                        }}
                    >
                        {initials}
                    </Avatar>
                );
            },
        },
        { title: "NAME", dataIndex: "name", key: "name", width: 100, align: "center" },
        { title: "AGE RANGE", dataIndex: "ageRange", key: "ageRange", width: 80, align: "center" },
        { title: "PERSONALITY", dataIndex: "personality", key: "personality", align: "center" },
        {
            title: "DESCRIPTION",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            align: "center",
        },
        {
            title: "ACTIONS",
            width: 120,
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button
                        className="btn-pill btn-edit"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Delete this character?"
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record.characterId)}
                    >
                        <Button className="btn-pill btn-danger" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    function handleAdd() {
        setEditing(null);
        form.resetFields();
        setOpen(true);
    }

    function handleEdit(record) {
        setEditing(record);
        form.setFieldsValue(record);
        setOpen(true);
    }

    async function handleDelete(id) {
        try {
            await deleteCharacter(id);
            message.success("Character deleted successfully");
            fetchAndSetCharacters(); // Refresh list
        } catch (error) {
            console.error("Error deleting character:", error);
            message.error("Failed to delete character.");
        }
    }

    function handleOk() {
        form.validateFields().then(async (values) => {
            const payload = { ...values, isActive: true }; // Always set isActive to true
            try {
                if (editing) {
                    await pathCharacter(editing.characterId, payload); // Use characterId instead of id
                    message.success("Character updated successfully");
                } else {
                    await postCharacter(payload);
                    message.success("Character added successfully");
                }
                setOpen(false);
                setEditing(null);
                form.resetFields();
                fetchAndSetCharacters(); // Refresh list
            } catch (error) {
                console.error("Error saving character:", error); // Log the full error for debugging
                message.error("An error occurred. Please try again.");
            }
        });
    }

    function handleCancel() {
        setOpen(false);
        setEditing(null);
        form.resetFields();
    }

    return (
        <div className="panel" style={{ padding: 16 }}>
            <div className="panel__header" style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: "30px", marginBottom: 16 }}>
                    Characters Management
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
                        placeholder="Search by name/description…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        style={{ width: 320, background: "#fff" }}
                    />
                    <Button
                        className="btn-accent btn-rounded"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add Character
                    </Button>
                </div>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={filtered}
                pagination={{ pageSize: 5, showSizeChanger: false }}
                size="middle"
                loading={loading}
            />

            <Modal
                title={editing ? "Edit Character" : "Add Character"}
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editing ? "Save" : "Add"}
            >
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={{
                        name: "",
                        image: "",
                        ageRange: 0,
                        personality: "",
                        description: "",
                    }}
                >
                    <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                        <Input placeholder="e.g., Panda" />
                    </Form.Item>
                    <Form.Item label="Image URL" name="image">
                        <Input placeholder="https://..." />
                    </Form.Item>
                    <Form.Item
                        label="Age Range"
                        name="ageRange"
                        rules={[{ type: "number", required: true }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Personality" name="personality">
                        <Input placeholder="e.g., Friendly, Playful" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={3} placeholder="Short description…" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}