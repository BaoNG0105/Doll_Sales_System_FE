import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  message,
  Popconfirm,
  Image,
  Space,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  getDollVariants,
  postDollVariant,
  deleteDollVariant,
  patchDollVariant, // Assuming you will add this
} from "../../service/api.doll";
import { getDollModels } from "../../service/api.doll";
import { useDebounce } from "use-debounce";

export default function ManageDollVariants() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dollModels, setDollModels] = useState([]);
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

  const fetchData = async (params = {}) => {
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
      const response = await getDollVariants(queryParams);
      setList(response.items || []);
      setPagination((prev) => ({
        ...prev,
        current: response.pagination.page,
        pageSize: response.pagination.pageSize,
        total: response.pagination.total || 0,
      }));
    } catch (error) {
      console.error("Failed to fetch doll variants:", error);
      message.error("Failed to fetch doll variants");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const newPagination = { ...pagination, current: 1 };
    fetchData({
      pagination: newPagination,
      search: debouncedQ,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  useEffect(() => {
    const fetchDollModels = async () => {
      try {
        // Fetch all models for the select dropdown
        const response = await getDollModels({ pageSize: 1000 });
        setDollModels(response.items || []);
      } catch (error) {
        console.error("Failed to fetch doll models:", error);
      }
    };
    fetchDollModels();
  }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    fetchData({ pagination, sorter, search: q });
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

  const handleDelete = async (id) => {
    try {
      await deleteDollVariant(id);
      message.success("Deleted variant successfully");
      fetchData({ pagination, search: q });
    } catch (error) {
      console.error(error);
      message.error("Failed to delete variant");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        // Assuming patchDollVariant exists
        await patchDollVariant(editing.dollVariantID, values);
        message.success("Updated variant successfully");
      } else {
        await postDollVariant(values);
        message.success("Added new variant");
      }
      setOpen(false);
      setEditing(null);
      form.resetFields();
      fetchData({ pagination, search: q });
    } catch (error) {
      console.error(error);
      message.error("Failed to save variant");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "dollVariantID",
      key: "dollVariantID",
      sorter: true,
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (url) => <Image width={60} src={url} />,
    },
    {
      title: "Variant Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Model Name",
      dataIndex: "dollModelName",
      key: "dollModelName",
      sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
      align: "right",
      render: (price) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      sorter: true,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      sorter: true,
      align: "center",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
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
            title="Delete the variant"
            description="Are you sure to delete this variant?"
            onConfirm={() => handleDelete(record.dollVariantID)}
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
          Doll Variants Management
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
            placeholder="Search by name, color, size..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 320, background: "#fff" }}
          />
          <Button type="primary" danger icon={<PlusOutlined />} onClick={onAdd}>
            Add Variant
          </Button>
        </div>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey="dollVariantID"
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
        title={editing ? "Edit Doll Variant" : "Add Doll Variant"}
        onCancel={() => setOpen(false)}
        onOk={handleOk}
        okText="Save"
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item
            name="dollModelID"
            label="Doll Model"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Select a doll model"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={dollModels.map((model) => ({
                value: model.dollModelID,
                label: model.name,
              }))}
            />
          </Form.Item>
          <Form.Item name="name" label="Variant Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="color" label="Color" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="size" label="Size" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}