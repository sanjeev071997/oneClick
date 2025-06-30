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
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import axios from "../axiosInstance";
import { Colors } from "../Comman";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useSelector } from "react-redux";
import { Modal, message } from "antd";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tab, Tabs } from "@mui/material";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
// Add this state
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(0);

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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const currentURL = `${window.location.origin}/product/${id}`;

  const handleShareOnWhatsApp = () => {
    const message = `Check out this product:\n*${product.name}* for ₹${product.totalPrice}.\nView it here: ${currentURL}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappShareUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappShareUrl, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      message.success("Link copied to clipboard!");
    } catch (err) {
      message.error("Failed to copy the link.");
    }
  };

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`/api/v1/product/get/product/${id}`);
      const fetchedProduct = res.data?.getProduct;
      setProduct(fetchedProduct);

      const firstImage = fetchedProduct?.images?.[0];
      const imageUrl =
        typeof firstImage === "string" ? firstImage : firstImage?.url;
      setSelectedImage(imageUrl || "");
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          totalReviews
        ).toFixed(1)
      : 0;

  // Get all Reviews
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

  const handleImageHover = (e) => {
    if (!isSmallScreen) {
      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setMagnifierPosition({ x, y });
      setShowMagnifier(true);
    }
  };

  const handleImageLeave = () => {
    setShowMagnifier(false);
  };

  const handleBuyNow = () => {
    if (!user || !user.phone) {
      if (!isAuthenticated) {
        Modal.confirm({
          title: "You need to login or register",
          content: "Please login or register to continue with your purchase.",
          okText: "Login",
          cancelText: "Register",
          onOk: () => {
            navigate("/login", { state: { from: location.pathname } });
          },
          onCancel: () => {
            navigate("/register", { state: { from: location.pathname } });
          },
        });
      } else {
        message.warning("Please complete your profile with a phone number.");
      }
      return;
    }

    const businessPhone = product?.businessId?.phone;
    if (!businessPhone) {
      message.warning("Business contact not available.");
      return;
    }
    const messages = `Hello, I am interested in buying *${product.name}* priced at ₹${product.totalPrice}.\nPlease contact me at\n ${user.name} \n${user.phone}.\nProduct Details ${currentURL}`;
    const encodedMessage = encodeURIComponent(messages);
    const whatsappUrl = `https://wa.me/${businessPhone.replace(
      /\D/g,
      ""
    )}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!product) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">No product found</Typography>
      </Box>
    );
  }

  const images = product?.images || [];

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: { md: 5, sm: 3 } }}>
        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid item xs={12} md={6} lg={5}>
            <Box
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row-reverse",
                gap: 2,
              }}
            >
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
                    cursor: "zoom-in",
                  }}
                />
                {!isSmallScreen && showMagnifier && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "105%",
                      width: { md: 400, lg: 600, xl: 800 },
                      height: { md: 350, lg: 525, xl: 700 },
                      border: "1px solid #ddd",
                      background: `url(${selectedImage}) no-repeat`,
                      backgroundSize: "200%",
                      backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                      zIndex: 10,
                      borderRadius: 2,
                      overflow: "hidden",
                      display: {
                        xs: "none",
                        sm: "none",
                        md: "block",
                      },
                      pointerEvents: "none",
                    }}
                  />
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isSmallScreen ? "row" : "column",
                  gap: 1,
                  overflowX: isSmallScreen ? "auto" : "unset",
                  overflowY: isSmallScreen ? "unset" : "auto",
                  maxHeight: isSmallScreen ? "unset" : 500,
                  width: isSmallScreen ? "100%" : 80,
                  pr: 1,
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
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => setSelectedImage(imgUrl)}
                    >
                      <img
                        src={imgUrl}
                        alt={`thumb-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Paper>
                  );
                })}
              </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleBuyNow}
                sx={{
                  bgcolor: Colors.LOGOColor,
                  color: "white",
                  "&:hover": {
                    bgcolor: Colors.LOGOlight,
                  },
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: "bold",
                }}
              >
                Buy Now
              </Button>
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6} lg={7}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {product.name}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<WhatsAppIcon />}
                    size="small"
                    onClick={handleShareOnWhatsApp}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    Share
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    size="small"
                    onClick={handleCopyLink}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    Copy Link
                  </Button>
                </Box>
              </Box>

              {/* Added On */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Added on{" "}
                  {new Date(product.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              </Box>

              {/* Category and Rating */}
              <Box
                sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
              >
                <Chip
                  label={product.category || "General"}
                  sx={{
                    bgcolor: Colors.LOGOColor,
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                />
                  <Rating
                    value={Number(averageRating)}
                    precision={0.1}
                    readOnly
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: Colors.LOGOlight,
                      },
                    }}
                  />
                  <Typography sx={{ color: Colors.LOGOColor }}>
                    {Number(averageRating || 0).toFixed(1)} ({totalReviews}{" "}
                    {totalReviews === 1 ? "review" : "reviews"})
                  </Typography>
              </Box>

              {/* Price Box */}
              <Box
                sx={{
                  backgroundColor: "#f9f9f9",
                  p: 3,
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {product.price > product.totalPrice && (
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: "line-through",
                        color: "#9e9e9e",
                        mr: 2,
                      }}
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
                    ₹
                    {parseFloat(product.totalPrice || product.price).toFixed(2)}
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
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </Box>

                {/* Stock Info */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <InventoryIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    In Stock: {product.stock}
                  </Typography>
                </Box>
              </Box>

              {/* Description */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Description
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                >
                  {product.details || "No description available"}
                </Typography>
              </Box>

              {/* Review Section */}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Ratings & Reviews
          </Typography>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
            >
              <Tab label="Add Review" />
              <Tab label={`All Reviews (${reviews.length})`} />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={activeTab} index={0}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
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
                sx={{ mb: 2, color: Colors.LOGOlight }}
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
                sx={{
                  bgcolor: Colors.LOGOColor,
                  "&:hover": { bgcolor: Colors.LOGOColorHover },
                }}
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit Review"
                )}
              </Button>
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
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
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {review.reviewer?.name || "Anonymous User"}
                      </Typography>
                      <Rating
                        value={review.rating}
                        precision={1}
                        readOnly
                        size="small"
                        sx={{ color: Colors.LOGOlight }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            )}
          </TabPanel>

        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetails;
