import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Avatar,
  CircularProgress,
  Modal,
  TextField,
  IconButton,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Rating,
  Breadcrumbs,
  Link,
  Chip,
  Paper
} from "@mui/material";
import {
  Home,
  LocationOn,
  Phone,
  Email,
  Send,
  Close,
  Visibility,
  Business,
  Star,
  ArrowBack
} from "@mui/icons-material";
import Navbar from "../Components/Navbar";
import axios from "../axiosInstance";

const CategoryDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const category = state?.category;
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewMap, setReviewMap] = useState({});
  const [openEnquiry, setOpenEnquiry] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const fetchBusinessesByCategory = async () => {
    try {
      const response = await axios.post("/api/v1/business/get", {
        category: category._id,
      });
      setBusinesses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
      alert(error.response?.data?.message || "Something went wrong");
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
    setOpenEnquiry(true);
  };

  const handleEnquiryClose = () => {
    setOpenEnquiry(false);
    setSelectedBusiness(null);
    setEnquiryForm({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    console.log("Enquiry submitted:", {
      business: selectedBusiness._id,
      ...enquiryForm
    });
    alert("Enquiry sent successfully!");
    handleEnquiryClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!category) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No category data available.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        height: "80vh"
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ 
        maxWidth: 1400, 
        mx: "auto", 
        px: { xs: 2, md: 4 }, 
        py: 3 
      }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>
            {category.name}
          </Typography>
        </Breadcrumbs>

        {/* Category Header */}
        <Paper elevation={0} sx={{
          mb: 4,
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
            zIndex: 1
          }
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            <Avatar
              src={category.url || "https://cdn-icons-png.flaticon.com/512/1570/1570887.png"}
              alt={category.name}
              sx={{
                width: 100,
                height: 100,
                mr: 4,
                border: '3px solid white',
                boxShadow: 2
              }}
            />
            <Box>
              <Chip 
                label={`${businesses.length} ${businesses.length === 1 ? 'Business' : 'Businesses'}`}
                color="primary"
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="h3" component="h1" sx={{
                fontWeight: 700,
                mb: 1,
                color: 'text.primary',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                {category.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                Discover top-rated businesses in this category. Find the perfect service provider for your needs.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Businesses List */}
        {businesses.length === 0 ? (
          <Box sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Business sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              No businesses found in this category
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We couldn't find any businesses listed under this category yet.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ borderRadius: 3 }}
            >
              Back to Categories
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Featured Businesses
              </Typography>
              
            </Box>
            
            <Grid container spacing={3}>
              {businesses?.map((business) => (
                <Grid item xs={12} sm={6} lg={4} key={business._id}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={business.images.length > 0 ? business.images[0].url : "https://source.unsplash.com/random/400x200/?business"}
                        alt={business.businessName}
                        sx={{
                          objectFit: 'cover',
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12
                        }}
                      />
                      <Box sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Star sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">
                          {reviewMap[business._id]?.avg || '0.0'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2" sx={{ 
                        fontWeight: 600,
                        mb: 1.5
                      }}>
                        {business.businessName}
                      </Typography>

                      <Stack spacing={1.5} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          color: 'text.secondary'
                        }}>
                          <LocationOn color="primary" sx={{ mr: 1, mt: 0.2 }} />
                          {business.address}
                        </Typography>

                        {business.phone && (
                          <Typography variant="body2" sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.secondary'
                          }}>
                            <Phone color="primary" sx={{ mr: 1 }} />
                            {business.phone}
                          </Typography>
                        )}

                        {business.email && (
                          <Typography variant="body2" sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.secondary'
                          }}>
                            <Email color="primary" sx={{ mr: 1 }} />
                            {business.email}
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                    
                    <Divider sx={{ my: 0 }} />
                    
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2
                    }}>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => navigate(
                          `/category/${category.name}/${business._id}`,
                          { state: { business } }
                        )}
                        sx={{
                          borderRadius: 2,
                          px: 2,
                          textTransform: 'none'
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleEnquiryOpen(business)}
                        sx={{
                          borderRadius: 2,
                          px: 2,
                          textTransform: 'none',
                          boxShadow: 'none'
                        }}
                      >
                        Contact Now
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>

      {/* Enquiry Modal */}
       {/* Enquiry Modal */}
       <Modal
        open={openEnquiry}
        onClose={handleEnquiryClose}
        aria-labelledby="enquiry-modal-title"
      >
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 800 },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          outline: 'none',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          {/* Form Section */}
          <Box sx={{
            flex: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3
            }}>
              <Typography id="enquiry-modal-title" variant="h6" component="h2">
                {selectedBusiness?.businessName}
              </Typography>
              <IconButton onClick={handleEnquiryClose} size="small">
                <Close />
              </IconButton>
            </Box>

            <form onSubmit={handleEnquirySubmit} style={{ flex: 1 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Your Name"
                name="name"
                value={enquiryForm.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                type="email"
                name="email"
                value={enquiryForm.email}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone Number"
                name="phone"
                value={enquiryForm.phone}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Your Message"
                name="message"
                value={enquiryForm.message}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
                variant="outlined"
                size="small"
              />
              <Box sx={{
                mt: 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2
              }}>
                <Button
                  variant="outlined"
                  onClick={handleEnquiryClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Send />}
                >
                  Send Message
                </Button>
              </Box>
            </form>
          </Box>

          {/* Divider */}
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

          {/* Image Section */}
          <Box sx={{
            flex: 1,
            borderRadius: 2,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default'
          }}>
            <Avatar
              src={selectedBusiness?.images?.[0]?.url || "https://via.placeholder.com/400x400?text=No+Image"}
              alt={selectedBusiness?.businessName}
              sx={{
                width: 200,
                height: 200,
                mb: 2,
                border: '4px solid',
                borderColor: 'primary.main'
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
              {selectedBusiness?.businessName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {selectedBusiness?.address}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CategoryDetail;
    