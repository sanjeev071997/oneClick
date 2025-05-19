import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Business,
  Star,
  LocationOn,
  Phone,
  Email,
  Send,
} from "@mui/icons-material";
import Navbar from "../Components/Navbar";
import axios from "../axiosInstance";

const CategoryDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const category = state?.category;
  const [businesses, setBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewMap, setReviewMap] = useState({});

  // Fetch Businesses By Category
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

  // Get All Reviews
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

  if (!category) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No category data available.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        {/* Category Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={
              category.url ||
              "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/hotkey_wedding_icon.gif?w=96&q=75"
            }
            alt={category.name}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {category.name}
          </Typography>
        </Box>

        {/* Businesses List */}
        {businesses.length === 0 ? (
          <Typography sx={{ p: 3 }}>
            No businesses found in this category.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {businesses?.map((business, index) => (
              <Grid item xs={12} md={6} key={business._id}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    {/* Business Image */}
                    <Box
                      sx={{
                        width: { xs: "100%", md: 200 },
                        height: 150,
                        bgcolor: "#f5f5f5",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mr: { md: 3 },
                        mb: { xs: 2, md: 0 },
                      }}
                    >
                      {business.images.length > 0 ? (
                        <img
                          src={business.images[0].url}
                          alt={business.businessName}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <Business sx={{ fontSize: 60, color: "#9e9e9e" }} />
                      )}
                    </Box>

                    {/* Business Info */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", cursor: "pointer", mb: 1 }}
                        onClick={() =>
                          navigate(
                            `/category/${category.name}/${business._id}`,
                            { state: { business } } 
                          )
                        }
                      >
                        {business.businessName}
                      </Typography>
                      

                      {/* Ratings */}
                      {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Star color="warning" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          {reviews?.rating || 0} ratings
                        </Typography>
                      </Box> */}

                      {/* Ratings */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Star color="warning" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          {reviewMap[business._id]?.avg || 0} (
                          {reviewMap[business._id]?.total || 0} reviews)
                        </Typography>
                      </Box>

                      {/* Address */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <LocationOn color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {business.address}
                        </Typography>
                      </Box>

                      {/* Contact Info */}
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          mt: 2,
                        }}
                      >
                        {business.phone && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Phone color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {business.phone}
                            </Typography>
                          </Box>
                        )}

                        {business.email && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Email color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {business.email}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Action Button */}
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<Send />}
                          sx={{ textTransform: "none" }}
                        >
                          Send Enquiry
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default CategoryDetail;
