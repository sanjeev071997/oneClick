import React, { useState, useEffect } from 'react';
import axios from "../axiosInstance";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Typography,
  Divider,
  Avatar,
  Card,
  Image
} from 'antd';
import { DeleteOutlined, EditOutlined, ShopOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const { Title, Text } = Typography;

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'user',
      render: (user) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar style={{ marginRight: 8 }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <div>
            <Text strong>{user?.name}</Text>
            <br />
            <Text type="secondary">{user?.phone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Business',
      dataIndex: 'businessId',
      key: 'business',
      render: (business) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {business?.images?.[0]?.url ? (
            <Image
              width={40}
              height={40}
              src={business.images[0].url}
              style={{ borderRadius: 4, marginRight: 6,}}
              fallback="https://via.placeholder.com/40"
              preview={false}
            />
          ) : (
            <Avatar
              icon={<ShopOutlined />}
              style={{ marginRight: 8 }}
            />
          )}
          <div>
            <Text strong>{business?.businessName}</Text>
            <br />
            <Text type="secondary">{business?.phone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (text) => (
        <div style={{ maxWidth: 300 }}>
          <Text ellipsis={{ tooltip: text }}>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Are you sure to delete this query?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/enquiry/get');
      console.log("API Response:", response.data);
      setQueries(response.data.data);
    } catch (error) {
      console.error('Error fetching queries:', error);
      message.error('Failed to fetch queries');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (query) => {
    setCurrentQuery(query);
    form.setFieldsValue({
      name: query.userId?.name,
      phone: query.userId?.phone,
      email: query.userId?.email,
      message: query.message,
      businessName: query.businessId?.businessName,
      businessPhone: query.businessId?.phone
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/v1/enquiry/delete', {
        data: { id }
      });
      message.success('Query deleted successfully');
      fetchQueries();
    } catch (error) {
      console.error('Error deleting query:', error);
      message.error('Failed to delete query');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        id: currentQuery._id,
      };

      await axios.put('/api/v1/enquiry/update', payload);
      message.success('Query updated successfully');
      setIsModalVisible(false);
      fetchQueries();
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Failed to submit form');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        <Card bordered={false}>
          <Title level={3} style={{ marginBottom: 24 }}>
            All Enquiries
          </Title>

          <Table
            columns={columns}
            dataSource={queries}
            rowKey="_id"
            loading={loading}
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50']
            }}
            scroll={{ x: true }}
          />

          <Modal
            title="Edit Enquiry"
            visible={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => setIsModalVisible(false)}
            okText="Update"
            cancelText="Cancel"
            width={700}
          >
            <Form form={form} layout="vertical">
              <Divider orientation="left">User Information</Divider>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input the name!' }]}
              >
                <Input prefix={<EditOutlined />} />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please input the phone number!' }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input the email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Divider orientation="left">Business Information</Divider>
              <Form.Item
                name="businessName"
                label="Business Name"
              >
                <Input prefix={<ShopOutlined />} readOnly />
              </Form.Item>
              <Form.Item
                name="businessPhone"
                label="Business Phone"
              >
                <Input prefix={<PhoneOutlined />} readOnly />
              </Form.Item>

              <Divider orientation="left">Message</Divider>
              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Please input the message!' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default Queries;