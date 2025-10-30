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
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  getCharacters,
  postCharacter,
  pathCharacter,
  deleteCharacter,
} from "../../service/api.character";
import { useDebounce } from "use-debounce";
import FormImageUpload from "../components/FormImageUpload";

export default function ManageCharacters() {
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

  const fetchAndSetCharacters = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        page: params.pagination?.current || 1,
        pageSize: params.pagination?.pageSize || 5,
        search: params.search,
        sortBy: params.sorter?.field,
        sortDir: params.sorter?.order
          ? params.sorter.order === "descend"
            ? "desc"
            : "asc"
          : undefined,
      };
      const response = await getCharacters(queryParams);
      setList(response.items || []);
      setPagination((prev) => ({
        ...prev,
        current: response.pagination.page,
        pageSize: response.pagination.pageSize,
        total: response.pagination.total || 0,
      }));
    } catch (error) {
      console.error("Failed to fetch characters:", error);
      message.error("Failed to fetch characters.");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetCharacters({ pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newPagination = { ...pagination, current: 1 };
    fetchAndSetCharacters({
      pagination: newPagination,
      search: debouncedQ,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const handleTableChange = (pagination, filters, sorter) => {
    fetchAndSetCharacters({ pagination, sorter, search: q });
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

  const onDelete = async (characterId) => {
    try {
      await deleteCharacter(characterId);
      message.success("Character deleted successfully!");
      fetchAndSetCharacters({ pagination, search: q });
    } catch (error) {
      console.error("Failed to delete character:", error);
      message.error("Failed to delete character.");
    }
  };

  const onFinish = async (values) => {
    try {
      if (editing) {
        await pathCharacter(editing.characterId, values);
        message.success("Character updated successfully!");
      } else {
        await postCharacter(values);
        message.success("Character added successfully!");
      }
      setOpen(false);
      fetchAndSetCharacters({ pagination, search: q });
    } catch (error) {
      console.error("Failed to save character:", error);
      message.error("Failed to save character.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "characterId",
      key: "characterId",
      align: "center",
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      sorter: true,
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (url) => <Image width={60} src={url} />,
    },
    {
      title: "Age Range",
      dataIndex: "ageRange",
      key: "ageRange",
      align: "center",
      sorter: true,
    },
    {
      title: "Personality",
      dataIndex: "personality",
      key: "personality",
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "AI URL",
      dataIndex: "aiUrl",
      key: "aiUrl",
      align: "center",
      ellipsis: true,
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
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
            title="Delete the character"
            description="Are you sure to delete this character?"
            onConfirm={() => onDelete(record.characterId)}
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
          Characters Management
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
            placeholder="Search by name, personality..."
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
            Add Character
          </Button>
        </div>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey="characterId"
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
        title={editing ? "Edit Character" : "Add Character"}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Save"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <FormImageUpload />
          </Form.Item>
          <Form.Item name="ageRange" label="Age Range">
            <Input />
          </Form.Item>
          <Form.Item name="personality" label="Personality">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="aiUrl" label="AI URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}