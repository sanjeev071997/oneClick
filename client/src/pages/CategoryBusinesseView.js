import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import Rating from "@mui/lab/Rating";
import Slider from "react-slick";
import axios from "../axiosInstance";
import { useSelector } from "react-redux";

const CategoryBusinesseView = () => {
  const { user } = useSelector((state) => state.user);
  const { state } = useLocation();
  const business = state?.business;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          totalReviews
        ).toFixed(1)
      : 0;

  // Handle Review Submit
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

  // Get All Reviews
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
    // infinite: true,
    infinite: business.images?.length > 1, // infinite only if there are multiple images
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <>
      <Navbar />
      <Box>
        {/* Image Slider */}
        {business?.images?.length > 0 && (
          <Slider {...sliderSettings}>
            {business.images.map((img, index) => (
              <Box key={index} sx={{ textAlign: "center" }}>
                <img
                  src={img?.url}
                  alt={`Slide ${index}`}
                  style={{ width: "100%", maxHeight: "400px" }}
                />
              </Box>
            ))}
          </Slider>
        )}

        {/* Business Info */}
        <Card sx={{ mt: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {business?.businessName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {business?.description}
            </Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Owner:</strong> {business?.ownerName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {business?.email}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {business?.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Category:</strong> {business?.category?.name}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {business?.address}
                </Typography>
                <Typography>
                  <strong>Created At:</strong>{" "}
                  {new Date(business?.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Review Section */}
        <Card sx={{ mt: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Reviews ({totalReviews}) — Average Rating:{" "}
              <Rating
                value={Number(averageRating)}
                precision={0.1}
                readOnly
                size="small"
              />{" "}
              ({averageRating})
            </Typography>

            {/* Existing Reviews */}
            {reviews?.length > 0 ? (
              reviews.map((rev, idx) => (
                <Box
                  key={idx}
                  sx={{ mb: 2, borderBottom: "1px solid #ccc", pb: 1 }}
                >
                  <Typography fontWeight="bold">
                    {rev?.reviewer?.name || "User"}
                  </Typography>
                  <Rating value={rev.rating} readOnly />
                  <Typography>{rev.comment}</Typography>
                </Box>
              ))
            ) : (
              <Typography>No reviews yet.</Typography>
            )}

            {/* Add New Review */}
            <Box mt={3}>
              <Typography variant="h6">Leave a Review</Typography>
              <Rating
                value={rating}
                onChange={(e, newVal) => setRating(newVal)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Your review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleReviewSubmit}
              >
                Submit Review
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default CategoryBusinesseView;
