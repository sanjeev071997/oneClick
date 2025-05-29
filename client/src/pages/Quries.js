import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import {
  Input,
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Tooltip,
  Space,
  Modal,
  Drawer,
  Form,
  Button,
  message,
 
  Popconfirm,
  Divider,
} from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const { Title, Text, Paragraph } = Typography;

const LOGOGREEN = '#296248';
const LOGOYELLOW = '#FCECA1';

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/enquiry/get');
      setQueries(response.data.data);
    } catch {
      message.error('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const filteredQueries = queries.filter((q) => {
    const userName = q.userId?.name?.toLowerCase() || '';
    const businessName = q.businessId?.businessName?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return userName.includes(term) || businessName.includes(term);
  });

  const openEditDrawer = (query) => {
    setCurrentQuery(query);
    form.setFieldsValue({
      name: query.userId?.name,
      phone: query.userId?.phone,
      email: query.userId?.email,
      message: query.message,
      businessName: query.businessId?.businessName,
      businessPhone: query.businessId?.phone,
    });
    setEditDrawerVisible(true);
  };

  const closeEditDrawer = () => {
    setEditDrawerVisible(false);
    setCurrentQuery(null);
    form.resetFields();
  };

  const openViewModal = (query) => {
    setCurrentQuery(query);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
    setCurrentQuery(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/v1/enquiry/delete', { data: { id } });
      message.success('Enquiry deleted successfully');
      fetchQueries();
    } catch {
      message.error('Failed to delete enquiry');
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        id: currentQuery._id,
      };
      await axios.put('/api/v1/enquiry/update', payload);
      message.success('Enquiry updated successfully');
      closeEditDrawer();
      fetchQueries();
    } catch {
      message.error('Failed to update enquiry');
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: 1200,
          margin: '24px auto',
          padding: '0 16px',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header + Search */}
        <Row
          justify="space-between"
          align="middle"
          gutter={[16, 16]}
          style={{ marginBottom: 20, flexWrap: 'wrap' }}
        >
          <Col xs={24} sm={12} md={8}>
            <Title level={2} style={{ color: LOGOGREEN, marginBottom: 0 }}>
              Customer Enquiries
            </Title>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Input
              allowClear
              placeholder="Search by user or business..."
              prefix={<SearchOutlined style={{ color: LOGOGREEN }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(41, 98, 72, 0.15)',
                maxWidth: '100%',
              }}
            />
          </Col>
        </Row>

        {/* Queries List */}
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <Text>Loading enquiries...</Text>
          </div>
        ) : filteredQueries.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <Text type="secondary">No enquiries found.</Text>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredQueries.map((q) => (
              <Col xs={24} sm={24} md={24} key={q._id}>
                <Card
                  hoverable
                  bordered={false}
                  style={{
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {/* User Info */}
                    <Space align="center" size="middle" wrap>
                      <Avatar
                        size={56}
                        src={q.userId?.profilePicture?.url}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: LOGOGREEN }}
                      />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          {q.userId?.name || 'N/A'}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 14 }}>
                          <PhoneOutlined /> {q.userId?.phone || 'N/A'}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 14 }}>
                          <MailOutlined /> {q.userId?.email || 'N/A'}
                        </Text>
                      </div>
                    </Space>

                    <Divider style={{ margin: '12px 0' }} />

                    {/* Business Info */}
                    <Space align="center" size="middle" wrap>
                      {q.businessId?.images?.[0]?.url ? (
                        <Avatar
                          shape="square"
                          size={56}
                          src={q.businessId.images[0].url}
                          style={{ borderRadius: 10 }}
                        />
                      ) : (
                        <Avatar
                          size={56}
                          icon={<ShopOutlined />}
                          style={{ backgroundColor: LOGOYELLOW, color: LOGOGREEN }}
                        />
                      )}
                      <div>
                        <Title level={5} style={{ margin: 0, color: LOGOGREEN }}>
                          {q.businessId?.businessName || 'N/A'}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 14 }}>
                          <PhoneOutlined /> {q.businessId?.phone || 'N/A'}
                        </Text>
                      </div>
                    </Space>

                    <Divider style={{ margin: '12px 0' }} />

                    {/* Message preview */}
                    <div
                      style={{
                        height: 60,
                        overflow: 'hidden',
                        whiteSpace: 'normal',
                        textOverflow: 'ellipsis',
                        color: '#333',
                        fontSize: 14,
                      }}
                      title={q.message}
                    >
                      {q.message}
                    </div>

                    {/* Footer controls */}
                    <Space
                      style={{ justifyContent: 'space-between', width: '100%' }}
                      align="center"
                      wrap
                    >
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <CalendarOutlined />{' '}
                        {new Date(q.createdAt).toLocaleDateString()}
                      </Text>

                      <Space size="middle">
                        <Tooltip title="View Message">
                          <Button
                            shape="circle"
                            type="primary"
                            ghost
                            icon={<EyeOutlined />}
                            onClick={() => openViewModal(q)}
                          />
                        </Tooltip>
                        <Tooltip title="Edit Enquiry">
                          <Button
                            shape="circle"
                            style={{ backgroundColor: LOGOGREEN, color: '#fff' }}
                            icon={<EditOutlined />}
                            onClick={() => openEditDrawer(q)}
                          />
                        </Tooltip>
                        <Tooltip title="Delete Enquiry">
                          <Popconfirm
                            title="Are you sure to delete this enquiry?"
                            onConfirm={() => handleDelete(q._id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button shape="circle" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </Tooltip>
                      </Space>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Edit Drawer */}
        <Drawer
          title="Edit Enquiry"
          width={Math.min(window.innerWidth * 0.85, 600)}
          onClose={closeEditDrawer}
          open={editDrawerVisible}
          bodyStyle={{ paddingBottom: 40 }}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button onClick={closeEditDrawer} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} type="primary">
                Update
              </Button>
            </div>
          }
          maskClosable={false}
          headerStyle={{ backgroundColor: LOGOGREEN, color: '#fff' }}
          closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
        >
          <Form layout="vertical" form={form} preserve={false} style={{ maxWidth: '100%' }}>
            <Divider orientation="left" plain>
              User Information
            </Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input the name!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: 'Please input the phone!' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Phone" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Invalid email!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Divider orientation="left" plain>
              Business Information
            </Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Business Name" name="businessName">
                  <Input prefix={<ShopOutlined />} readOnly />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Business Phone" name="businessPhone">
                  <Input prefix={<PhoneOutlined />} readOnly />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left" plain>
              Message
            </Divider>
            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: 'Please input the message!' }]}
            >
              <Input.TextArea rows={4} placeholder="Message" />
            </Form.Item>
          </Form>
        </Drawer>

        {/* View Modal */}
        <Modal
          title="View Message"
          open={viewModalVisible}
          onCancel={closeViewModal}
          footer={[
            <Button key="close" onClick={closeViewModal}>
              Close
            </Button>,
          ]}
          width={Math.min(window.innerWidth * 0.85, 600)}
          bodyStyle={{ fontSize: 16 }}
        >
          <Paragraph>{currentQuery?.message}</Paragraph>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default Queries;
