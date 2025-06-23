import React, { useState, useEffect } from "react";
import axios from '../../axiosInstance'
import {Input, Row, Col, Card, Avatar, Typography, Tooltip, Space, Drawer,Form, message,Popconfirm,Divider, Empty, Button as AntButton,} from "antd";
import {UserOutlined,ShopOutlined,PhoneOutlined,MailOutlined,CalendarOutlined,EyeOutlined,DeleteOutlined,SearchOutlined,CloseOutlined,CommentOutlined,} from "@ant-design/icons";
import { Button as MuiButton } from "@mui/material";

import { Colors, FontSize } from '../../Comman'
import { useSelector } from "react-redux";
const { Title, Text,  } = Typography;

const UserEnquire= () => {
  const { user } = useSelector((state) => state.user);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  //get quries
  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/enquiry/get", {
        userId: user._id,
      });
      setQueries(response.data.data);
    } catch (error) {
      message.error("Failed to fetch enquiries" + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [user._id]);

  //filter quries
  const filteredQueries = queries?.filter((q) => {
    const userName = q?.name?.toLowerCase() || "";
    const businessName = q.businessId?.businessName?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return (
      userName.includes(term) || businessName.includes(term)
    );
  });

  const openEditDrawer = (query) => {
    form.setFieldsValue({
      name: query?.name,
      phone: query?.phone,
      email: query?.email,
      message: query?.message,
      businessName: query.businessId?.businessName,
      businessPhone: query.businessId?.phone,
    });
    setEditDrawerVisible(true);
  };

  const closeEditDrawer = () => {
    setEditDrawerVisible(false);
    form.resetFields();
  };

  //handle delete quries
  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/v1/enquiry/delete", { data: { id } });
      message.success("Enquiry deleted successfully");
      fetchQueries();
    } catch (error) {
      message.error("Failed to delete enquiry");
    }
  };

  return (
    <>
     
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
          style={{ marginBottom: 30, flexWrap: "wrap" }}
        >
          {/* Customer Enquiries Title */}
          <Col xs={24} sm={12} md={12} lg={8}>
            <div
              style={{ textAlign: "left", fontFamily: "'Poppins', sans-serif" }}
            >
              <Title
                level={2}
                style={{
                  color: Colors.LOGOColor,
                  fontWeight: 700,
                  marginBottom: 0,
                  fontSize: "2rem",
                  lineHeight: "1.2",
                }}
              >
                Enquiries
              </Title>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    marginLeft: 20,
                    height: 3,
                    width: 80,
                    backgroundColor: Colors.LOGOColor,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          </Col>

          {/* Search Bar (Ant Design) */}
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={8}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Input
              placeholder="Search by user name or business name..."
              allowClear
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined style={{ color: Colors.LOGOColor }} />}
              style={{
                width: "100%",
                maxWidth: 500,
                height: 50,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            />
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
                          {q?.name || "N/A"}
                        </Title>
                        <Text style={{ fontSize: 14, color: Colors.LOGOColor }}>
                          <PhoneOutlined
                            style={{ color: Colors.LOGOlight, marginRight: 4 }}
                          />
                          {q?.phone || "N/A"}
                        </Text>
                        <br />
                        <Text style={{ fontSize: 14, color: Colors.LOGOColor }}>
                          <MailOutlined
                            style={{ color: Colors.LOGOlight, marginRight: 4 }}
                          />
                          {q?.email || "N/A"}
                        </Text>
                      </div>
                    </Space>

                    <Divider style={{ margin: "12px 0" }} />

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
                        <Tooltip title="View Enquiry">
                          <AntButton 
                            shape="circle"
                            type="default"
                            icon={
                              <EyeOutlined
                                style={{ color: Colors.LOGOlight }}
                              />
                            }
                            onClick={() => openEditDrawer(q)}
                            style={{
                              borderColor: Colors.LOGOlight,
                              color: Colors.LOGOlight,
                            }}
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
              style={{ color: Colors.LOGOColor, }}
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
              User Information
            </Divider>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: Colors.LOGOColor }}>Name</span>}
                  name="name"
                >
                  <Input
                    prefix={
                      <UserOutlined style={{ color: Colors.LOGOColor }} />
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
                  label={<span style={{ color: Colors.LOGOColor }}>Phone</span>}
                  name="phone"
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

            <Form.Item
              label={<span style={{ color: Colors.LOGOColor }}>Email</span>}
              name="email"
            >
              <Input
                prefix={<MailOutlined style={{ color: Colors.LOGOColor }} />}
                readOnly
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
              Message
            </Divider>
            <Form.Item
              label={<span style={{ color: Colors.LOGOColor }}>Message</span>}
              name="message"
            >
              <Input.TextArea
                rows={4}
               readOnly
                style={{
                  borderColor: Colors.textDark,
                }}
              />
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </>
  );
};

export default UserEnquire;

