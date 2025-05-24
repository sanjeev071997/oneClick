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
  Divider
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const { Title } = Typography;

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this query?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
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
    form.setFieldsValue(query);
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
      <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', color: 'black' }}>
          All Enquiries
        </Title>
        <Divider />
        <Table 
          columns={columns} 
          dataSource={queries} 
          rowKey="_id" 
          loading={loading}
          bordered
          pagination={{ pageSize: 6 }}
        />

        <Modal
          title="Edit Query"
          visible={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          okText="Update"
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Please input the phone number!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: 'Please input the message!' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default Queries;
