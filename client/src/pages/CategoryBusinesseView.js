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
} from "@mui/material";
import Rating from "@mui/material/Rating";
import Slider from "react-slick";
import axios from "../axiosInstance";
import { useSelector } from "react-redux";
import {
  Home,
  ArrowBack,
  Star,
  Send,
  LocationOn,
  Email,
  Phone,
  Person,
  CalendarToday,
  ChatBubble,
} from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { message } from "antd";
import { Colors } from "../Comman";


const FontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
  heading1: 800,
  heading2: 600
};

const CategoryBusinessView = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { state } = useLocation();
  const business = state?.business;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
 

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          totalReviews
        ).toFixed(1)
      : 0;

  const handleReviewSubmit = async () => {
    if (!reviewText || rating === 0) {
      return message.error("Please enter a review and rating.");
    }

    const newReview = {
      businessId: business._id,
      rating,
      comment: reviewText,
      reviewer: user._id,
    };
    try {
      const res = await axios.post("/api/v1/review/add", newReview);
      if (res.data.success) {
        message.success("Review submitted successfully!");
        setRating(0);
        setReviewText("");
        getReview();
      } else {
        message.error(res.data.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Review submit error", error);
      message.error("An error occurred while submitting your review.");
    }
  };

  const getReview = async () => {
    if (!business?._id) return;
    try {
      const response = await axios.post("/api/v1/review/get", {
        businessId: business._id,
      });
      if (response.data.success === true) {
        setReviews(response.data.data);
      } else {
        message.error("Failed to load reviews.");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred while fetching reviews.");
    }
  };

  useEffect(() => {
    getReview();
  }, [business]);

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
      <Box
        sx={{
          maxWidth: 1300,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                mr: 1,
                backgroundColor: Colors.LOGOColor,
                color: Colors.WHITE,
                "&:hover": {
                  backgroundColor: Colors.LOGOlight,
                },
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
                 
                }}
              >
                <Home sx={{ mr: 0.5, }} fontSize="inherit" />
                <Typography  fontWeight="500">
                  Home
                </Typography>
              </Link>
              <Typography color={Colors.BLACK} fontWeight="500">
                {business?.businessName}
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Image Gallery */}
          <Box
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 3,
              position: "relative",
              width: "100%",
              height: { xs: 250, sm: 350, md: 450 },
              "&:before": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "100px",
                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                zIndex: 1,
              },
            }}
          >
            <Slider {...sliderSettings}>
              {business?.images?.map((img, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: 250, sm: 350, md: 540 },
                      backgroundImage: `url(${img?.url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                </Box>
              ))}
            </Slider>

            {/* Business Name Overlay */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                zIndex: 2,
                color: Colors.WHITE,
              }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                }}
              >
                {business?.businessName}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  backdropFilter: "blur(5px)",
                  p: 1,
                  borderRadius: 1,
                  width: "fit-content",
                }}
              >
                <Rating
                  value={Number(averageRating)}
                  precision={0.1}
                  readOnly
                  sx={{
                    mr: 1,
                    '& .MuiRating-iconFilled': {
                      color: Colors.LOGOlight, 
                    },
                    '& .MuiRating-iconEmpty': {
                      color: `${Colors.LOGOlight}80`,
                    },
                  }}
                />
                <Typography variant="subtitle1" fontWeight="500" sx={{ color:Colors.LOGOlight}}>
                  {averageRating} ({totalReviews}{" "}
                  {totalReviews === 1 ? "review" : "reviews"})
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Business Info Tabs */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              borderBottom: 1,
              borderColor: Colors.LOGOColor,
              mb: 3,
            }}
          >
            <Button
              onClick={() => setActiveTab("overview")}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: activeTab === "overview" ? "bold" : "normal",
                color: activeTab === "overview" ? Colors.LOGOlight : Colors.LOGOColor,
                borderBottom: activeTab === "overview" ? `3px solid ${Colors.LOGOlight}` : "none",
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Overview
            </Button>
            <Button
              onClick={() => setActiveTab("reviews")}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: activeTab === "reviews" ? "bold" : "normal",
                color: activeTab === "reviews" ? Colors.LOGOlight : Colors.LOGOColor,
                borderBottom: activeTab === "reviews" ? `3px solid ${Colors.LOGOlight}` : "none",
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Reviews ({totalReviews})
            </Button>
          </Box>

          {activeTab === "overview" && (
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                overflow: "hidden",
                background: Colors.WHITE,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: Colors.LOGOColor }}
                >
                  About {business?.businessName}
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ color: Colors.textDark, mb: 3 }}
                >
                  {business?.description}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2,
                        borderColor: Colors.LOGOColor
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          gutterBottom
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: Colors.LOGOColor,
                          }}
                        >
                          <Person sx={{ mr: 1, color: Colors.LOGOColor  }} /> Contact Information
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Person sx={{ mr: 2, color: Colors.LOGOColor }} />
                            <Typography sx={{ color: Colors.textDark }}>
                              <strong>Owner:</strong> {business?.ownerName}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Email sx={{ mr: 2,  color: Colors.LOGOColor  }} />
                            <Typography sx={{ color: Colors.textDark }}>
                              <strong>Email:</strong> {business?.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Phone sx={{ mr: 2,  color: Colors.LOGOColor }} />
                            <Typography sx={{ color: Colors.textDark }}>
                              <strong>Phone:</strong> {business?.phone}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2,
                        borderColor: Colors.LOGOColor
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          gutterBottom
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: Colors.LOGOColor,
                          }}
                        >
                          <LocationOn sx={{ mr: 1, color: Colors.LOGOColor  }} /> Business Details
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Chip
                              label={business?.category?.name}
                              size="small"
                              sx={{
                                mr: 2,
                                backgroundColor: Colors.LOGOColor,
                                color: Colors.WHITE,
                                fontWeight: FontWeight.bold,
                              }}
                            />
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                            <LocationOn sx={{ mr: 2,  color: Colors.LOGOColor , mt: 0.5 }} />
                            <Typography sx={{ color: Colors.textDark }}>
                              <strong>Address:</strong> {business?.address}
                              {business?.city && `, ${business.city}`}
                              {business?.state && `, ${business.state}`}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CalendarToday sx={{ mr: 2, color: Colors.LOGOColor }} />
                            <Typography sx={{ color: Colors.textDark }}>
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
              {/* Add Review Section */}
              {user ? (
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    background: Colors.WHITE,
                    mb: 3,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ color: Colors.LOGOColor }}
                    >
                      Share Your Experience
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: Colors.LOGOColor }}>
                        How would you rate your experience?
                      </Typography>
                      <Rating
                        value={rating}
                        onChange={(e, newVal) => setRating(newVal)}
                        size="large"
                        precision={0.5}
                        sx={{
                          "& .MuiRating-icon": {
                            fontSize: "2.5rem",
                            color: Colors.LOGOColor ,
                          },
                          "& .MuiRating-iconFilled": {
                            color: Colors.LOGOlight,
                          },
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
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": {
                            borderColor: Colors.LOGOColor,
                          },
                          "&:hover fieldset": {
                            borderColor: Colors.LOGOColor,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: Colors.LOGOColor,
                            borderWidth: "2px",
                          },
                        },
                      }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        endIcon={<Send />}
                        onClick={handleReviewSubmit}
                        sx={{
                          background: Colors.LOGOlight,
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                         
                        }}
                      >
                        Post Review
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    backgroundColor: Colors.lightBg,
                    borderRadius: 2,
                    border: `2px dashed ${Colors.LOGOColor}`,
                    mb: 3,
                  }}
                >
                  <Typography variant="body1" sx={{ color: Colors.LOGOColor }}>
                    Please{" "}
                    <Link 
                      onClick={() => navigate("/login")} 
                      sx={{ 
                        cursor: "pointer",
                        color: Colors.LOGOlight,
                        fontWeight: 'bold'
                      }}
                    >
                      sign in
                    </Link>{" "}
                    to leave a review
                  </Typography>
                </Box>
              )}

              {/* Reviews List */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  background: Colors.WHITE,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      color: Colors.LOGOColor,
                    }}
                  >
                    <ChatBubble sx={{ mr: 1, color: Colors.LOGOlight }} /> Customer Reviews
                  </Typography>

                  {reviews?.length > 0 ? (
                    <Box>
                      {reviews.map((rev, idx) => (
                        <Box key={idx} sx={{ mb: 3, pb: 3, borderBottom: `1px solid ${Colors.LOGOColor}` }}>
                          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                            <Avatar
                              src={rev?.reviewer?.avatar}
                              sx={{
                                color: Colors.LOGOColor,
                                width: 48,
                                height: 48,
                                mr: 2,
                                boxShadow: 1,
                                border: `2px solid ${Colors.LOGOColor}`,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                                <Typography fontWeight="bold" variant="subtitle1" sx={{ color: Colors.LOGOColor }}>
                                  {rev?.reviewer?.name || "Anonymous"}
                                </Typography>
                                <Typography variant="caption" sx={{ color: Colors.LOGOColor }}>
                                  {new Date(rev.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
                                <Rating
                                  value={rev.rating}
                                  readOnly
                                  size="small"
                                  precision={0.5}
                                  sx={{ 
                                    color: Colors.LOGOlight,
                                    "& .MuiRating-iconFilled": {
                                      color: Colors.LOGOlight,
                                    }
                                  }}
                                />
                                <Chip
                                  label={`${rev.rating}`}
                                  size="small"
                                  sx={{
                                    ml: 1,
                                    backgroundColor: Colors.LOGOColor,
                                    color: Colors.WHITE,
                                    fontWeight: "bold",
                                  }}
                                />
                              </Box>
                              <Typography
                                sx={{
                                  backgroundColor: "rgba(255,255,255,0.7)",
                                  p: 2,
                                  borderRadius: 1,
                                  color: Colors.LOGOColor,
                                }}
                              >
                                "{rev.comment}"
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 4,
                        backgroundColor: Colors.lightBg,
                        borderRadius: 2,
                        border: `2px dashed ${Colors.LOGOColor}`,
                      }}
                    >
                      <Star
                        sx={{
                          fontSize: 60,
                          color: Colors.LOGOlight,
                          mb: 2,
                          opacity: 0.8,
                        }}
                      />
                      <Typography variant="h6" sx={{ color: Colors.LOGOColor }} gutterBottom>
                        No Reviews Yet
                      </Typography>
                      <Typography variant="body1" sx={{ color: Colors.LOGOColor }}>
                        Be the first to share your experience with this business
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CategoryBusinessView;