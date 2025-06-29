


import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Stack,
  Paper,
  useMediaQuery,
  useTheme,
  Rating,
  Container,
  TextField,
  Button, 
  CircularProgress 
} from "@mui/material";
import { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import axios from "../axiosInstance";
import { Colors } from "../Comman";
import { message, Modal } from "antd"; 
import { useSelector } from "react-redux";
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user } = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  // State for reviews
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [errorReviews, setErrorReviews] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const isAuthenticated = true; 

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`/api/v1/product/get/product/${id}`);
      const fetchedProduct = res.data?.getProduct;
      setProduct(fetchedProduct);

      const firstImage = fetchedProduct?.images?.[0];
      const imageUrl = typeof firstImage === "string" ? firstImage : firstImage?.url;
      setSelectedImage(imageUrl || "");
    } catch (err) {
  
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    setErrorReviews(null);
    try {
      const res = await axios.get(`/api/v1/product/review/get/${id}`);
      setReviews(res.data?.data || []);
    } catch (err) {
      setErrorReviews("Failed to load reviews. Please try again.");
      message.error("Failed to load reviews.");
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      Modal.confirm({
        title: "Login Required",
        content: "Please log in to add a review.",
        okText: "Login",
        cancelText: "Cancel",
        onOk: () => navigate("/login", { state: { from: location.pathname } }),
      });
      return;
    }

    if (rating === 0) {
      message.warning("Please provide a rating.");
      return;
    }

    if (!reviewText.trim()) {
      message.warning("Please write a comment for your review.");
      return;
    }

    setSubmittingReview(true);
    try {
      const payload = {
        productId: product?._id,
        rating,
        comment: reviewText,
        reviewer: user?._id, 
      };
      await axios.post("/api/v1/product/review/add", payload);
      message.success("Review added successfully!");
      setRating(0);
      setReviewText("");
      fetchReviews(); 
    } catch (error) {
      console.error("Failed to add review:", error);
      message.error(error.response?.data?.message || "Failed to add review.");
    } finally {
      setSubmittingReview(false);
    }
  };


  useEffect(() => {
    if (id) {
      fetchProductDetails();
      fetchReviews(); 
    }
  }, [id]);

  if (!product) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6">No product found</Typography>
      </Box>
    );
  }

  const handleImageHover = (e) => {
    if (!isSmallScreen) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setMagnifierPosition({ x, y });
      setShowMagnifier(true);
    }
  };

  const handleImageLeave = () => {
    setShowMagnifier(false);
  };

  const images = product?.images || [];

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Image Section (Existing Code) */}
          <Grid item xs={12} md={6} lg={5}>
            <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row-reverse", gap: 2 }}>
              {/* Zoom Image on Hover */}
              <Box
                onMouseMove={handleImageHover}
                onMouseLeave={handleImageLeave}
                sx={{ width: "100%", position: "relative", borderRadius: 2 }}
              >
                <img
                  src={selectedImage}
                  alt="Main"
                  style={{
                    width: "100%",
                    height: isSmallScreen ? 300 : 500,
                    objectFit: "cover",
                    borderRadius: "10px",
                    cursor: "zoom-in"
                  }}
                />

                {!isSmallScreen && showMagnifier && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "105%",
                      width: 800,
                      height: 700,
                      border: "1px solid #ddd",
                      background: `url(${selectedImage}) no-repeat`,
                      backgroundSize: "200%",
                      backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                      zIndex: 10,
                      borderRadius: 2,
                      display: {
                        xs: "none",
                        sm: "block"
                      }
                    }}
                  />
                )}
              </Box>

              {/* Thumbnails */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isSmallScreen ? "row" : "column",
                  gap: 1,
                  overflowX: isSmallScreen ? "auto" : "unset",
                  overflowY: isSmallScreen ? "unset" : "auto",
                  maxHeight: isSmallScreen ? "unset" : 500,
                  width: isSmallScreen ? "100%" : 80,
                  pr: 1
                }}
              >
                {images.map((img, index) => {
                  const imgUrl = img.url || img;
                  return (
                    <Paper
                      key={index}
                      elevation={selectedImage === imgUrl ? 4 : 1}
                      sx={{
                        width: isSmallScreen ? 80 : 70,
                        height: isSmallScreen ? 80 : 70,
                        cursor: "pointer",
                        borderRadius: 2,
                        overflow: "hidden",
                        flexShrink: 0,
                        border:
                          selectedImage === imgUrl
                            ? `2px solid ${Colors.LOGOColor}`
                            : "1px solid #e0e0e0",
                        transition: "all 0.2s ease"
                      }}
                      onClick={() => setSelectedImage(imgUrl)}
                    >
                      <img
                        src={imgUrl}
                        alt={`thumb-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          </Grid>

          {/* Product Info (Existing Code) */}
          <Grid item xs={12} md={6} lg={7}>
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                {product.name}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Chip
                  label={product.category}
                  color="secondary"
                  sx={{
                    mr: 2,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "0.7rem"
                  }}
                />
                <Rating
                  value={4.5} 
                  precision={0.5}
                  readOnly
                  sx={{ color: Colors.LOGOColor }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({reviews.length} reviews) 
                </Typography>
              </Box>

              <Box sx={{ backgroundColor: "#f9f9f9", p: 3, borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  {product.price > product.totalPrice && (
                    <Typography
                      variant="h6"
                      sx={{ textDecoration: "line-through", color: "#9e9e9e", mr: 2 }}
                    >
                      ₹{parseFloat(product.price).toFixed(2)}
                    </Typography>
                  )}

                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{ mr: 2 }}
                  >
                    ₹{parseFloat(product.totalPrice || product.price).toFixed(2)}
                  </Typography>

                  {product.discount > 0 && (
                    <Chip
                      label={`${product.discount}% OFF`}
                      size="medium"
                      sx={{
                        bgcolor: Colors.LOGOColor,
                        color: "white",
                        height: 32,
                        fontSize: "1rem",
                        fontWeight: "bold"
                      }}
                    />
                  )}
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                {product.details || "No description available"}
              </Typography>

              {/* --- Review Section Starts Here --- */}
              <Box sx={{ mt: 5 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Customer Reviews
                </Typography>

                {/* Review Submission Form */}
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Add a Review
                  </Typography>
                  <Rating
                    name="product-rating"
                    value={rating}
                    precision={1}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    sx={{ mb: 2, color: Colors.LOGOColor }}
                  />
                  <TextField
                    label="Your Comment"
                    multiline
                    rows={4}
                    fullWidth
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    sx={{ bgcolor: Colors.LOGOColor, "&:hover": { bgcolor: Colors.LOGOColorHover } }}
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                  >
                    {submittingReview ? <CircularProgress size={24} color="inherit" /> : "Submit Review"}
                  </Button>
                </Paper>

                {/* Display Existing Reviews */}
                {loadingReviews ? (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : errorReviews ? (
                  <Typography color="error" sx={{ mt: 3 }}>
                    {errorReviews}
                  </Typography>
                ) : reviews.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
                    No reviews yet. Be the first to review this product!
                  </Typography>
                ) : (
                  <Stack spacing={2} sx={{ mt: 3 }}>
                    {reviews.map((review) => (
                      <Paper key={review._id} elevation={1} sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {review.reviewer?.name || "Anonymous User"}
                          </Typography>
                          <Rating
                            value={review.rating}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{ color: Colors.LOGOColor }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {review.comment}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetails;