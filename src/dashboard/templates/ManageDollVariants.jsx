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
  InputNumber,
  Select,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDebounce } from "use-debounce";
import {
  deleteDollVariant,
  getDollModels,
  getDollVariants,
  patchDollVariant,
  postDollVariant,
} from "../../service/api.doll";
import FormImageUpload from "../components/FormImageUpload";

export default function ManageDollVariants() {
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
  const [dollModels, setDollModels] = useState([]);
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
      message.error("Failed to fetch doll variants.");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDollModels = async () => {
    try {
      // Fetch all models without pagination for the select dropdown
      const response = await getDollModels({ pageSize: 1000 });
      setDollModels(response.items || []);
    } catch (error) {
      console.error("Failed to fetch doll models:", error);
      message.error("Failed to fetch doll models for selection.");
    }
  };

  useEffect(() => {
    fetchData({ pagination });
    fetchDollModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newPagination = { ...pagination, current: 1 };
    fetchData({
      pagination: newPagination,
      search: debouncedQ,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

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

  const onDelete = async (id) => {
    try {
      await deleteDollVariant(id);
      message.success("Variant deleted successfully!");
      fetchData({ pagination, search: q });
    } catch (error) {
      console.error("Failed to delete variant:", error);
      message.error("Failed to delete variant.");
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = { ...values };
      if (editing) {
        await patchDollVariant(editing.dollVariantID, payload);
        message.success("Variant updated successfully!");
      } else {
        await postDollVariant(payload);
        message.success("Variant added successfully!");
      }
      setOpen(false);
      fetchData({ pagination, search: q });
    } catch (error) {
      console.error("Failed to save variant:", error);
      message.error("Failed to save variant.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "dollVariantID",
      key: "dollVariantID",
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
      title: "Doll Model",
      dataIndex: "dollModelName",
      key: "dollModelName",
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      sorter: true,
      render: (price) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
      sorter: true,
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      align: "center",
      sorter: true,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
      sorter: true,
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
            title="Delete the variant"
            description="Are you sure to delete this variant?"
            onConfirm={() => onDelete(record.dollVariantID)}
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
            placeholder="Search by name, model, color..."
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
        onOk={() => form.submit()}
        okText="Save"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
          <Form.Item
            name="dollModelID"
            label="Doll Model"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Select a doll model"
              optionFilterProp="label"
              options={dollModels.map((model) => ({
                value: model.dollModelID,
                label: model.name,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Variant Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="color" label="Color" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="size" label="Size" rules={[{ required: true }]}>
            <Input />
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