
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Tag,
  Typography,
  Alert
} from "antd";
import {
  ArrowLeftOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  StarFilled,
  SendOutlined,
  ShopOutlined
} from "@ant-design/icons";
import axios from "../axiosInstance";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Colors } from "../Comman";



const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { TextArea } = Input;


const CategoryDetail = () => {
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { state } = useLocation();
  const category = state?.category;
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewMap, setReviewMap] = useState({});
  const [openEnquiry, setOpenEnquiry] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  const { user } = useSelector((state) => state.user);

  const fetchBusinessesByCategory = async () => {
    try {
      const response = await axios.post("/api/v1/business/get", {
        userId: user._id,
      });
      setBusinesses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
      message.error(error.response?.data?.message || "Failed to fetch businesses");
    } finally {
      setLoading(false);
    }
  };

  const getReview = async (businessId) => {
    try {
      const response = await axios.post("/api/v1/review/get", { businessId });
      if (response.data.success === true) return response.data.data;
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (category) {
        await fetchBusinessesByCategory();
      }
    };
    fetchAllData();
  }, [category]);

  useEffect(() => {
    const fetchReviewsForBusinesses = async () => {
      const map = {};
      for (const business of businesses) {
        const reviews = await getReview(business._id);
        const total = reviews.length;
        const avg = total
          ? (
            reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total
          ).toFixed(1)
          : 0;
        map[business._id] = { total, avg };
      }
      setReviewMap(map);
    };
    if (businesses.length > 0) {
      fetchReviewsForBusinesses();
    }
  }, [businesses]);

  const handleEnquiryOpen = (business) => {
    setSelectedBusiness(business);
    form.resetFields();
    setOpenEnquiry(true);
  };

  const handleEnquiryClose = () => {
    setOpenEnquiry(false);
    setSelectedBusiness(null);
    form.resetFields();
  };

  const handleEnquirySubmit = async (values) => {
    if (!selectedBusiness) return;

    setEnquiryLoading(true);
    try {
      const enquiryData = {
        businessId: selectedBusiness._id,
        userId: user?._id || null,
        ...values
      };

      const response = await axios.post("/api/v1/enquiry/add", enquiryData);

      if (response.data.success) {
        message.success('Enquiry sent successfully!');
        handleEnquiryClose();
      }
    } catch (error) {
      console.error("Enquiry submission error:", error);
      message.error(error.response?.data?.message || 'Failed to send enquiry');
    } finally {
      setEnquiryLoading(false);
    }
  };

  if (!category) {
    return (
      <div style={{ padding: 24 }}>
        <Text>No category data available.</Text>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh"
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '20px 24px',
      }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb style={{ marginBottom: 24 }}>
          <Breadcrumb.Item onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
            <HomeOutlined /> Home
          </Breadcrumb.Item>
          <Breadcrumb.Item style={{ color: Colors.BLACK }}>{category.name}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Category Header */}
        <div style={{
          marginBottom: 40,
          padding: 40,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${Colors.LOGOColor} 0%, #1a4a4d 100%)`,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(38, 91, 95, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            <Avatar
              src={category.url || "https://cdn-icons-png.flaticon.com/512/1570/1570887.png"}
              alt={category.name}
              size={100}
              style={{
                marginRight: 24,
                border: '3px solid white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            />
            <div>
              <Tag color={Colors.LOGOlight} style={{
                marginBottom: 12,
                color: Colors.textDark,
                fontWeight: 500
              }}>
                {businesses.length} {businesses.length === 1 ? 'Business' : 'Businesses'}
              </Tag>
              <Title level={2} style={{
                marginBottom: 8,
                color: Colors.WHITE,
                fontWeight: 600
              }}>
                {category.name}
              </Title>
              <Paragraph style={{
                color: 'rgba(255, 255, 255, 0.85)',
                maxWidth: 600,
                marginBottom: 0
              }}>
                Discover top-rated businesses in this category. Find the perfect service provider for your needs.
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Businesses List */}
        {businesses.length === 0 ? (
          <div style={{
            padding: 40,
            textAlign: 'center',
            borderRadius: 12,
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <ShopOutlined style={{
              fontSize: 60,
              color: Colors.LOGOColor,
              marginBottom: 20
            }} />
            <Title level={4} style={{ marginBottom: 12, color: Colors.LOGOColor }}>
              No businesses found in this category
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: 24 }}>
              We couldn't find any businesses listed under this category yet.
            </Paragraph>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{
                borderRadius: 6,
                backgroundColor: Colors.LOGOColor,
                borderColor: Colors.LOGOColor
              }}
            >
              Back to Categories
            </Button>
          </div>
        ) : (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24
            }}>
              <Title level={3} style={{ margin: 0, color: Colors.LOGOColor }}>
                Featured Businesses
              </Title>
            </div>

            <Row gutter={[24, 24]}>
              {businesses?.map((business) => (
                <Col xs={24} sm={12} lg={8} key={business._id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative', height: 200 }}>
                        <img
                          alt={business.businessName}
                          src={business.images.length > 0 ? business.images[0].url : 'https://source.unsplash.com/random/400x200/?business'}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: 'white',
                          padding: '4px 8px',
                          borderRadius: 12,
                          display: 'flex',
                          alignItems: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}>
                          <StarFilled style={{
                            fontSize: 14,
                            marginRight: 4,
                            color: Colors.LOGOlight
                          }} />
                          <Text style={{ fontSize: 12 }}>
                            {reviewMap[business._id]?.avg || '0.0'}
                          </Text>
                        </div>
                      </div>
                    }
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      border: `1px solid ${Colors.lightBg}`
                    }}
                  >
                    <Meta
                      title={
                        <Text strong style={{ fontSize: 18, color: Colors.LOGOColor }}>
                          {business.businessName}
                        </Text>
                      }
                      description={
                        <div style={{ marginTop: 12 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 8
                          }}>
                            <EnvironmentOutlined style={{
                              marginRight: 8,
                              color: Colors.LOGOColor
                            }} />
                            <Text type="secondary">
                              {business.city && `${business.city}, `}
                              {business.state}
                            </Text>
                          </div>
                          {business.address && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: 8
                            }}>
                              <HomeOutlined style={{
                                marginRight: 8,
                                color: Colors.LOGOColor
                              }} />
                              <Text type="secondary">{business.address}</Text>
                            </div>
                          )}
                          {business.phone && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: 8
                            }}>
                              <PhoneOutlined style={{
                                marginRight: 8,
                                color: Colors.LOGOColor
                              }} />
                              <Text type="secondary">{business.phone}</Text>
                            </div>
                          )}
                          {business.email && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: 8
                            }}>
                              <MailOutlined style={{
                                marginRight: 8,
                                color: Colors.LOGOColor
                              }} />
                              <Text type="secondary">{business.email}</Text>
                            </div>
                          )}
                        </div>
                      }
                    />
                    <Divider style={{ margin: '16px 0' }} />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <Button
                        type="text"
                        onClick={() =>
                          navigate(`/category/${category.name}/${business._id}`, {
                            state: { business },
                          })
                        }
                        style={{ color: Colors.LOGOColor }}
                      >
                        View Details
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => handleEnquiryOpen(business)}
                        style={{
                          backgroundColor: Colors.LOGOlight,
                          borderColor: Colors.LOGOlight,
                          color: Colors.WHITE
                        }}
                      >
                        Contact Now
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>

      {/* Enquiry Modal */}
      <Modal
        title={`Contact ${selectedBusiness?.businessName}`}
        visible={openEnquiry}
        onCancel={handleEnquiryClose}
        footer={null}
        width={800}
        centered
        destroyOnClose
        style={{ borderRadius: 12 }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {/* Form Section */}
          <div style={{ flex: 1, padding: 24 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleEnquirySubmit}
            >
              {/* Name Field */}
              <Form.Item
                name="name"
                label="Your Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input
                  style={{
                    borderColor: '#d9d9d9',
                    '&:hover': { borderColor: Colors.LOGOlight },
                    '&:focus': {
                      borderColor: Colors.LOGOColor,
                      boxShadow: `0 0 0 2px ${Colors.LOGOColor}33`,
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = Colors.LOGOlight;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#d9d9d9';
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = Colors.LOGOColor;
                    e.target.style.boxShadow = `0 0 0 2px ${Colors.LOGOColor}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d9d9d9';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Item>

              {/* Email Field */}
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input
                  style={{
                    borderColor: '#d9d9d9',
                    '&:hover': { borderColor: Colors.LOGOlight },
                    '&:focus': {
                      borderColor: Colors.LOGOColor,
                      boxShadow: `0 0 0 2px ${Colors.LOGOColor}33`,
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = Colors.LOGOlight;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#d9d9d9';
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = Colors.LOGOColor;
                    e.target.style.boxShadow = `0 0 0 2px ${Colors.LOGOColor}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d9d9d9';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Item>

              {/* Phone Field */}
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input
                  style={{
                    borderColor: '#d9d9d9',
                    '&:hover': { borderColor: Colors.LOGOlight },
                    '&:focus': {
                      borderColor: Colors.LOGOColor,
                      boxShadow: `0 0 0 2px ${Colors.LOGOColor}33`,
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = Colors.LOGOlight;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#d9d9d9';
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = Colors.LOGOColor;
                    e.target.style.boxShadow = `0 0 0 2px ${Colors.LOGOColor}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d9d9d9';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Item>

              {/* Message Field */}
              <Form.Item
                name="message"
                label="Your Message"
                rules={[{ required: true, message: 'Please input your message!' }]}
              >
                <TextArea
                  rows={4}
                  style={{
                    borderColor: '#d9d9d9',
                    '&:hover': { borderColor: Colors.LOGOlight },
                    '&:focus': {
                      borderColor: Colors.LOGOColor,
                      boxShadow: `0 0 0 2px ${Colors.LOGOColor}33`,
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = Colors.LOGOlight;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#d9d9d9';
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = Colors.LOGOColor;
                    e.target.style.boxShadow = `0 0 0 2px ${Colors.LOGOColor}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d9d9d9';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12
                }}>
                  <Button
                    onClick={handleEnquiryClose}
                    style={{
                      borderColor: Colors.LOGOColor,
                      color: Colors.LOGOColor,
                      '&:hover': {
                        borderColor: Colors.LOGOlight,
                        color: Colors.LOGOlight
                      }
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={enquiryLoading}
                    icon={<SendOutlined />}
                    disabled={!token}
                    style={{
                      backgroundColor: Colors.LOGOlight,
                      borderColor: Colors.LOGOlight
                    }}
                  >
                    Send Message
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>

          {/* Divider */}
          <Divider type="vertical" style={{ height: '100%' }} />

          {/* Business Info Section */}
          <div style={{
            flex: 1,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.lightBg
          }}>
            <Avatar
              src={selectedBusiness?.images?.[0]?.url || "https://via.placeholder.com/400x400?text=No+Image"}
              alt={selectedBusiness?.businessName}
              size={160}
              style={{
                marginBottom: 24,
                border: `4px solid ${Colors.LOGOColor}`
              }}
            />
            <Title level={4} style={{ marginBottom: 8, color: Colors.LOGOColor }}>
              {selectedBusiness?.businessName}
            </Title>
            {selectedBusiness?.city && selectedBusiness?.state && (
              <Text type="secondary" style={{ marginBottom: 4 }}>
                {`${selectedBusiness.city}, ${selectedBusiness.state}`}
              </Text>
            )}
            <Text type="secondary">{selectedBusiness?.address}</Text>

            {!token && (
              <Alert
                message="Login Required"
                description="You need to be logged in to send an enquiry"
                type="warning"
                showIcon
                style={{ marginTop: 24, width: '100%' }}
              />
            )}
          </div>
        </div>
      </Modal>

      <Footer />
    </>
  );
};

export default CategoryDetail;