import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";
import { message } from "antd";
import axios from "../../axiosInstance";
import { Colors } from "../../Comman";
import { useNavigate, useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import Rating from "@mui/material/Rating";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InventoryIcon from "@mui/icons-material/Inventory";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const BusinessProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [errorReviews, setErrorReviews] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/product/get/${id}`);
      setProducts(res.data?.data || []);
    } catch (err) {
      message.warning("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (id) => {
    try {
      const res = await axios.get(`/api/v1/product/review/get/${id}`);
      return res.data?.data || [];
    } catch (err) {
      console.error(`Failed to fetch reviews for product ${id}:`, err);
      return [];
    }
  };

  const fetchAllReviews = async () => {
    setLoadingReviews(true);
    setErrorReviews(null);
    try {
      const reviewsPromises = products.map(product => 
        fetchReviews(product._id)
      );
      const allReviews = await Promise.all(reviewsPromises);
      
      const reviewsMap = {};
      products.forEach((product, index) => {
        reviewsMap[product._id] = allReviews[index];
      });
      
      setReviews(reviewsMap);
    } catch (err) {
      setErrorReviews("Failed to load reviews. Please try again.");
      message.error("Failed to load reviews.");
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id]);

  useEffect(() => {
    if (products.length > 0) {
      fetchAllReviews();
    }
  }, [products]);

  const handleCardClick = (product) => {
    navigate(`/product/${product?._id}`);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Function to calculate average rating and number of reviews for a product
  const getReviewStats = (id) => {
    const productReviews = reviews[id] || [];
    if (productReviews.length === 0) {
      return { averageRating: 0, numOfReviews: 0 };
    }
    
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = sum / productReviews.length;
    
    return {
      averageRating,
      numOfReviews: productReviews.length
    };
  };

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Typography
          variant="body1"
          sx={{ color: Colors.textDark, textAlign: "center", py: 4 }}
        >
          No products available for this business.
        </Typography>
      ) : (
        <Grid container spacing={3} mt={1}>
          {products.map((product) => {
            const image =
              Array.isArray(product.images) && product.images.length > 0
                ? product.images[0].url || product.images[0]
                : "";

            const { averageRating, numOfReviews } = getReviewStats(product._id);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product?._id}>
                <Card
                  onClick={() => handleCardClick(product)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    width: "100%",
                    height: "100%",
                    transition: "0.3s",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    bgcolor: "#fff",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: `0px 4px 20px ${Colors.LOGOColor}33`,
                      transform: "scale(1.01)",
                    },
                  }}
                >
                  {product.discount > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bgcolor: Colors.LOGOColor,
                        color: "white",
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        px: 0.5,
                        py: 1,
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "4px",
                        zIndex: 2,
                      }}
                    >
                      {product.discount}% OFF
                    </Box>
                  )}

                  <Box
                    sx={{
                      height: 180,
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <img
                      src={image}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, pt: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: "uppercase", mb: 0.5 }}
                    >
                      {product.category || "General"}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Rating
                        value={averageRating}
                        precision={0.1}
                        readOnly
                        size="small"
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        sx={{ color: Colors.LOGOColor }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({numOfReviews} reviews)
                      </Typography>
                    </Box>

                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      noWrap
                      title={product.name}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.details}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        mt: 1,
                      }}
                    >
                      <Box>
                        {product.price > product.totalPrice && (
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: "line-through",
                              color: "#9e9e9e",
                              mr: 1,
                            }}
                          >
                            ₹{parseFloat(product.price).toFixed(2)}
                          </Typography>
                        )}
                        <Typography variant="h6" color="text.primary">
                          ₹
                          {parseFloat(
                            product.totalPrice || product.price
                          ).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <InventoryIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          In stock: {product.stock}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        gap: 1,
                      }}
                    >
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Added on {formatDate(product.createdAt)}
                        <ArrowForwardIcon sx={{ fontSize: 14 }} />
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
};

export default BusinessProducts;