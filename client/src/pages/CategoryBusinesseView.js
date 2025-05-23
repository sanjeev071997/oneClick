import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Breadcrumbs,
  Stack,
  Link,
  IconButton,
  Chip,
  Divider
} from "@mui/material";
import Rating from "@mui/lab/Rating";
import Slider from "react-slick";
import axios from "../axiosInstance";
import { useSelector } from "react-redux";
import { Home, ArrowBack, Star, Send, LocationOn, Email, Phone, Person, CalendarToday, ChatBubble } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CategoryBusinessView = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { state } = useLocation();
  const business = state?.business;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          totalReviews
        ).toFixed(1)
      : 0;

  const handleReviewSubmit = async () => {
    if (!reviewText || rating === 0)
      return alert("Please enter a review and rating");

    const newReview = {
      businessId: business._id,
      rating,
      comment: reviewText,
      reviewer: user._id,
    }; 
    try {
      const res = await axios.post("/api/v1/review/add", newReview);
      if (res.data.success) {
        setRating(0);
        setReviewText("");
        getReview();
      }
    } catch (error) {
      console.error("Review submit error", error);
    }
  };

  const getReview = async () => {
    try {
      const response = await axios.post("/api/v1/review/get", {
        businessId: business._id,
      });
      if (response.data.success === true) setReviews(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: business?.images?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    fade: true,
  };

  return (
    <>
      <Navbar />
      <Box sx={{ 
        maxWidth: 1400, 
        mx: "auto", 
        px: { xs: 2, md: 4 }, 
        py: 3,
        background: 'linear-gradient(to bottom, #f5f7fa 0%, #e4e8ed 100%)',
        minHeight: '100vh'
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton 
              onClick={() => navigate(-1)} 
              sx={{ 
                mr: 1,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.2)'
                }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate("/")}
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  cursor: "pointer",
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Link>
              <Typography color="text.primary" fontWeight="500">
                {business?.businessName}
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Image Gallery with Parallax Effect */}
          <Box sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: 3,
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              zIndex: 1
            }
          }}>
            <Slider {...sliderSettings}>
              {business?.images?.map((img, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      height: { xs: 250, sm: 350, md: 450 },
                      backgroundImage: `url(${img?.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  />
                </Box>
              ))}
            </Slider>
            
            {/* Business Name Overlay */}
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 3,
              zIndex: 2,
              color: 'white'
            }}>
              <Typography variant="h3" fontWeight="bold" sx={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}>
                {business?.businessName}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 1,
                backdropFilter: 'blur(5px)',
                p: 1,
                borderRadius: 1,
                width: 'fit-content'
              }}>
                <Rating
                  value={Number(averageRating)}
                  precision={0.1}
                  readOnly
                  sx={{ color: 'gold', mr: 1 }}
                />
                <Typography variant="subtitle1" fontWeight="500">
                  {averageRating} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Business Info Tabs */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            borderBottom: 1, 
            borderColor: 'divider',
            mb: 3
          }}>
            <Button
              onClick={() => setActiveTab("overview")}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: activeTab === "overview" ? 'bold' : 'normal',
                color: activeTab === "overview" ? 'primary.main' : 'text.secondary',
                borderBottom: activeTab === "overview" ? '3px solid' : 'none',
                borderColor: 'primary.main',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Overview
            </Button>
            <Button
              onClick={() => setActiveTab("reviews")}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: activeTab === "reviews" ? 'bold' : 'normal',
                color: activeTab === "reviews" ? 'primary.main' : 'text.secondary',
                borderBottom: activeTab === "reviews" ? '3px solid' : 'none',
                borderColor: 'primary.main',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Reviews ({totalReviews})
            </Button>
          </Box>

          {activeTab === "overview" && (
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)'
            }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  About {business?.businessName}
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  {business?.description}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'primary.main'
                        }}>
                          <Person sx={{ mr: 1 }} /> Contact Information
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Person sx={{ mr: 2, color: 'text.secondary' }} />
                            <Typography>
                              <strong>Owner:</strong> {business?.ownerName}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Email sx={{ mr: 2, color: 'text.secondary' }} />
                            <Typography>
                              <strong>Email:</strong> {business?.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                            <Typography>
                              <strong>Phone:</strong> {business?.phone}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'primary.main'
                        }}>
                          <LocationOn sx={{ mr: 1 }} /> Business Details
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label={business?.category?.name} 
                              color="primary" 
                              size="small" 
                              sx={{ mr: 2 }} 
                            />
                           
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <LocationOn sx={{ mr: 2, color: 'text.secondary', mt: 0.5 }} />
                            <Typography>
                              <strong>Address:</strong> {business?.address}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                            <Typography>
                              <strong>Member Since:</strong>{" "}
                              {new Date(business?.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {activeTab === "reviews" && (
            <Box>
              {/* Reviews List */}
              <Card sx={{ 
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)'
              }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 3
                  }}>
                    <ChatBubble sx={{ mr: 1, color: 'primary.main' }} /> Customer Reviews
                  </Typography>
                  
                  {reviews?.length > 0 ? (
                    <Box>
                      {reviews.map((rev, idx) => (
                        <Box key={idx} sx={{ mb: 3, pb: 3, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Avatar 
                              src={rev?.reviewer?.avatar} 
                              sx={{ 
                                width: 48, 
                                height: 48, 
                                mr: 2,
                                boxShadow: 1
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <Typography fontWeight="bold" variant="subtitle1">
                                  {rev?.reviewer?.name || "Anonymous"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(rev.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                <Rating 
                                  value={rev.rating} 
                                  readOnly 
                                  size="small" 
                                  sx={{ color: 'gold' }} 
                                />
                                <Chip
                                  label={`${rev.rating} stars`}
                                  size="small"
                                  sx={{ ml: 1, backgroundColor: 'rgba(255,215,0,0.2)' }}
                                />
                              </Box>
                              <Typography sx={{ 
                                pl: 0,
                                backgroundColor: 'rgba(0,0,0,0.02)',
                                p: 2,
                                borderRadius: 1,
                                fontStyle: 'italic'
                              }}>
                                "{rev.comment}"
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 4,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderRadius: 2,
                      border: '2px dashed rgba(0,0,0,0.1)'
                    }}>
                      <Star sx={{ 
                        fontSize: 60, 
                        color: 'text.disabled', 
                        mb: 2,
                        opacity: 0.5
                      }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Reviews Yet
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Be the first to share your experience with this business
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Add Review Section */}
              {user && (
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Share Your Experience
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        How would you rate your experience?
                      </Typography>
                      <Rating
                        value={rating}
                        onChange={(e, newVal) => setRating(newVal)}
                        size="large"
                        sx={{ 
                          '& .MuiRating-icon': {
                            fontSize: '2.5rem'
                          }
                        }}
                      />
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      placeholder="Tell others about your experience..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      variant="outlined"
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        endIcon={<Send />}
                        onClick={handleReviewSubmit}
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          '&:hover': {
                            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Post Review
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {!user && (
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderRadius: 2,
                  border: '2px dashed rgba(0,0,0,0.1)',
                  mb: 3
                }}>
                  <Typography variant="body1" color="text.secondary">
                    Please <Link onClick={() => navigate('/login')} sx={{ cursor: 'pointer' }}>sign in</Link> to leave a review
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>  
    </>
  );
};

export default CategoryBusinessView;