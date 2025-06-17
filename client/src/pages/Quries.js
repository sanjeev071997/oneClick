import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";
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
  message,
  Popconfirm,
  Divider,
  Empty,
  Button as AntButton, 
} from "antd";
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
  CommentOutlined,
} from "@ant-design/icons";
import { Button as MuiButton } from "@mui/material";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Colors, FontSize } from "../Comman";

const { Title, Text, Paragraph } = Typography;

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isActive = focused || hovered;

  //get quries
  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/enquiry/get");
      setQueries(response.data.data);
    } catch {
      message.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  //filter quries
  const filteredQueries = queries.filter((q) => {
    const userName = q.userId?.name?.toLowerCase() || "";
    const businessName = q.businessId?.businessName?.toLowerCase() || "";
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

  //handle delete quries

  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/v1/enquiry/delete", { data: { id } });
      message.success("Enquiry deleted successfully");
      fetchQueries();
    } catch {
      message.error("Failed to delete enquiry");
    }
  };

  // handle Update quries
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        id: currentQuery._id,
      };
      await axios.put("/api/v1/enquiry/update", payload);
      message.success("Enquiry updated successfully");
      closeEditDrawer();
      fetchQueries();
    } catch {
      message.error("Failed to update enquiry");
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: 1200,
          margin: "24px auto",
          padding: "0 16px",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header + Search */}
        <Row
          justify="space-between"
          align="middle"
          gutter={[16, 16]}
          style={{ marginBottom: 20, flexWrap: "wrap" }}
        >
          <Col xs={24} sm={12} md={8}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title
                level={2}
                style={{
                  color: Colors.LOGOColor,
                  fontWeight: "bold",
                }}
              >
                Customer Enquiries
              </Title>
              <div
                style={{
                  height: 3,
                  width: 60,
                  backgroundColor: Colors.LOGOlight,
                  margin: "0 auto",
                  borderRadius: 2,
                }}
              />
            </div>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Input
                allowClear
                placeholder="Search by user or business..."
                prefix={
                  <SearchOutlined
                    style={{
                      color: isActive ? Colors.LOGOlight : Colors.LOGOColor,
                    }}
                  />
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                  borderRadius: 8,
                  boxShadow: `0 2px 8px ${
                    isActive ? Colors.LOGOlight : Colors.LOGOColor
                  }15`,
                  maxWidth: "100%",
                  border: `1px solid ${
                    isActive ? Colors.LOGOlight : "#d9d9d9"
                  }`,
                  transition: "all 0.3s",
                }}
              />
            </div>
          </Col>
        </Row>

        {/* Queries List */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 100 }}>
            <Text>Loading enquiries...</Text>
          </div>
        ) : filteredQueries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              margin: "40px 0",
              padding: "60px 40px",
              borderRadius: 12,
              background: `linear-gradient(135deg, ${Colors.LOGOColor}10, ${Colors.LOGOlight}10)`,
              border: `1px dashed ${Colors.LOGOColor}50`,
              boxShadow: `0 4px 12px ${Colors.LOGOColor}10`,
            }}
          >
            <Empty
              image={
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${Colors.LOGOColor}20, ${Colors.LOGOlight}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    border: `1px solid ${Colors.LOGOColor}30`,
                  }}
                >
                  <CommentOutlined
                    style={{
                      fontSize: 48,
                      color: Colors.LOGOColor,
                    }}
                  />
                </div>
              }
              description={
                <Space direction="vertical" size="small">
                  <Text
                    style={{
                      fontSize: FontSize.large,
                      color: Colors.LOGOColor,
                      fontWeight: 500,
                    }}
                  >
                    No Enquiries Yet
                  </Text>
                  <Text
                    type="secondary"
                    style={{
                      maxWidth: 500,
                      color: Colors.LOGOColor,
                      opacity: 0.8,
                    }}
                  >
                    When customers inquire about your services, they'll appear
                    here.
                  </Text>
                </Space>
              }
            >
              <MuiButton 
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  borderRadius: 2,
                  color: "#ffffff",
                  backgroundColor: Colors.LOGOlight,
                  "&:hover": { backgroundColor: Colors.LOGOlight },
                }}
                onClick={fetchQueries}
              >
                Check for New Enquiries
              </MuiButton>
            </Empty>
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
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    {/* User Info */}
                    <Space align="center" size="middle" wrap>
                      <Avatar
                        size={56}
                        src={q.userId?.profilePicture?.url}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: Colors.LOGOlight }}
                      />
                      <div>
                        <Title
                          level={5}
                          style={{ margin: 0, color: Colors.LOGOColor }}
                        >
                          {q.userId?.name || "N/A"}
                        </Title>

                        <Text style={{ fontSize: 14, color: Colors.LOGOColor }}>
                          <PhoneOutlined
                            style={{ color: Colors.LOGOlight, marginRight: 4 }}
                          />
                          {q.userId?.phone || "N/A"}
                        </Text>
                        <br />

                        <Text style={{ fontSize: 14, color: Colors.LOGOColor }}>
                          <MailOutlined
                            style={{ color: Colors.LOGOlight, marginRight: 4 }}
                          />
                          {q.userId?.email || "N/A"}
                        </Text>
                      </div>
                    </Space>

                    <Divider style={{ margin: "12px 0" }} />

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
                          style={{
                            backgroundColor: Colors.LOGOlight,
                            color: Colors.LOGOColor,
                          }}
                        />
                      )}
                      <div>
                        <Title
                          level={5}
                          style={{ margin: 0, color: Colors.LOGOColor }}
                        >
                          {q.businessId?.businessName || "N/A"}
                        </Title>

                        <Text style={{ fontSize: 14, color: Colors.LOGOColor }}>
                          <PhoneOutlined
                            style={{ color: Colors.LOGOlight, marginRight: 4 }}
                          />
                          {q.businessId?.phone || "N/A"}
                        </Text>
                      </div>
                    </Space>

                    <Divider style={{ margin: "12px 0" }} />

                    {/* Message preview */}
                    <div
                      style={{
                        height: 60,
                        overflow: "hidden",
                        whiteSpace: "normal",
                        textOverflow: "ellipsis",
                        color: Colors.LOGOColor,
                        fontSize: 14,
                      }}
                      title={q.message}
                    >
                      {q.message}
                    </div>

                    {/* Footer controls */}
                    <Space
                      style={{ justifyContent: "space-between", width: "100%" }}
                      align="center"
                      wrap
                    >
                      <Text style={{ fontSize: 12, color: Colors.LOGOColor }}>
                        <CalendarOutlined
                          style={{ color: Colors.LOGOlight, marginRight: 4 }}
                        />
                        {new Date(q.createdAt).toLocaleDateString()}
                      </Text>

                      <Space size="middle">
                        <Tooltip title="View Message">
                          <AntButton // Use AntButton for icon buttons
                            shape="circle"
                            type="default"
                            icon={
                              <EyeOutlined
                                style={{ color: Colors.LOGOlight }}
                              />
                            }
                            onClick={() => openViewModal(q)}
                            style={{
                              borderColor: Colors.LOGOlight,
                              color: Colors.LOGOlight,
                            }}
                          />
                        </Tooltip>

                        <Tooltip title="Edit Enquiry">
                          <AntButton 
                            shape="circle"
                            style={{
                              backgroundColor: Colors.LOGOColor,
                              color: "#fff",
                            }}
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
                            <AntButton
                              shape="circle"
                              danger
                              icon={<DeleteOutlined />}
                            />
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
            <div style={{ textAlign: "right" }}>
              <MuiButton 
                onClick={closeEditDrawer}
                sx={{
                  marginRight: 1,
                  backgroundColor: Colors.LOGOlight,
                  border: "none",
                  color: Colors.WHITE,
                  "&:hover": { backgroundColor: Colors.LOGOlight },
                }}
              >
                Cancel
              </MuiButton>

              <MuiButton 
                onClick={handleUpdate}
                variant="contained"
                sx={{
                  backgroundColor: Colors.LOGOlight,
                  border: "none",
                  color: Colors.WHITE,
                  "&:hover": { backgroundColor: Colors.LOGOlight },
                }}
              >
                Update
              </MuiButton>
            </div>
          }
          maskClosable={false}
          headerStyle={{
            backgroundColor: Colors.LOGOColor,
            color: "#fff",
            borderBottom: `1px solid ${Colors.LOGOlight}30`,
          }}
          closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
        >
          <Form
            layout="vertical"
            form={form}
            preserve={false}
            style={{ maxWidth: "100%" }}
          >
            <Divider
              orientation="left"
              plain
              style={{ color: Colors.LOGOColor }}
            >
              User Information
            </Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: Colors.LOGOColor }}>Name</span>}
                  name="name"
                  rules={[
                    { required: true, message: "Please input the name!" },
                  ]}
                >
                  <Input
                    prefix={
                      <UserOutlined style={{ color: Colors.LOGOColor }} />
                    }
                    placeholder="Name"
                    style={{
                      borderColor: Colors.textDark,
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: Colors.LOGOColor }}>Phone</span>}
                  name="phone"
                  rules={[
                    { required: true, message: "Please input the phone!" },
                  ]}
                >
                  <Input
                    prefix={
                      <PhoneOutlined style={{ color: Colors.LOGOColor }} />
                    }
                    placeholder="Phone"
                    style={{
                      borderColor: Colors.textDark,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={<span style={{ color: Colors.LOGOColor }}>Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please input the email!" },
                { type: "email", message: "Invalid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: Colors.LOGOColor }} />}
                placeholder="Email"
                style={{
                  borderColor: Colors.textDark,
                }}
              />
            </Form.Item>

            <Divider
              orientation="left"
              plain
              style={{ color: Colors.LOGOColor }}
            >
              Business Information
            </Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <span style={{ color: Colors.LOGOColor }}>
                      Business Name
                    </span>
                  }
                  name="businessName"
                >
                  <Input
                    prefix={
                      <ShopOutlined style={{ color: Colors.LOGOColor }} />
                    }
                    readOnly
                    style={{
                      borderColor: Colors.textDark,
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={
                    <span style={{ color: Colors.LOGOColor }}>
                      Business Phone
                    </span>
                  }
                  name="businessPhone"
                >
                  <Input
                    prefix={
                      <PhoneOutlined style={{ color: Colors.LOGOColor }} />
                    }
                    readOnly
                    style={{
                      borderColor: Colors.textDark,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider
              orientation="left"
              plain
              style={{ color: Colors.LOGOColor }}
            >
              Message
            </Divider>
            <Form.Item
              label={<span style={{ color: Colors.LOGOColor }}>Message</span>}
              name="message"
              rules={[{ required: true, message: "Please input the message!" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Message"
                style={{
                  borderColor: Colors.textDark,
                }}
              />
            </Form.Item>
          </Form>
        </Drawer>

        {/* View Modal */}
        <Modal
          title="View Message"
          open={viewModalVisible}
          onCancel={closeViewModal}
          footer={[
            <MuiButton 
              key="close"
              onClick={closeViewModal}
              sx={{
                backgroundColor: Colors.LOGOlight,
                border: "none",
                color: Colors.WHITE,
                "&:hover": { backgroundColor: Colors.LOGOlight },
              }}
            >
              Close
            </MuiButton>,
          ]}
          width={Math.min(window.innerWidth * 0.85, 600)}
          bodyStyle={{ fontSize: 16, color: Colors.LOGOColor }}
        >
          <Paragraph>{currentQuery?.message}</Paragraph>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default Queries;