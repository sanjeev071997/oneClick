import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
  CardActions,
  IconButton,
} from "@mui/material";
import { message } from "antd";
import axios from "../../axiosInstance";
import { Colors } from "../../Comman";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';

const BusinessProducts = () => {
  const { user } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/product/get/${user._id}`);
      console.log(res, "product")
      setProducts(res.data?.data || []);
    } catch (err) {
      message.error("You don't have any product yet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchProducts();
    }
  }, [user?._id]);

  const getFirstImage = (product) => {
    return Array.isArray(product.images) && product.images.length > 0
      ? product.images[0].url || product.images[0]
      : null;
  };

  const handleCardClick = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const StaticStars = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
      {[...Array(5)].map((_, index) => (
        <StarIcon key={index} sx={{ color: '#FFD700', fontSize: '1rem' }} />
      ))}
    </Box>
  );

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
            const image = getFirstImage(product);
            const originalPrice = parseFloat(product.originalPrice || product.price * 1.3);
            const currentPrice = parseFloat(product.price);
            const discountPercentage = originalPrice > currentPrice
              ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
              : 0;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  onClick={() => handleCardClick(product)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    transition: "0.3s",
                   
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    bgcolor: "#fff",
                    overflow: "hidden",
                  }}
                >
                  {/*  discount badge */}
                  {discountPercentage > 0 && (
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
                      {discountPercentage}% OFF
                    </Box>
                  )}

                  {/* Product Image */}
                  <Box
                    sx={{
                      height: 180,
                      backgroundColor: '#f9f9f9',
                      p: 0,
                    }}
                  >
                    <img
                      src={image || ""}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                       backgroundSize: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>


                  {/* Product Details */}
                  <CardContent sx={{ flexGrow: 1, pt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', mb: 0.5 }}>
                      {product.category}
                    </Typography>
                    <StaticStars />
                    <Typography variant="subtitle2" fontWeight="bold" noWrap>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      {originalPrice > currentPrice && (
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: "line-through",
                            color: "#9e9e9e",
                            mr: 1,
                          }}
                        >
                          {originalPrice.toFixed(2)}
                        </Typography>
                      )}
                      <Typography variant="body1" fontWeight="bold" color="text.primary">
                        {currentPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* View Button */}
                  <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                    <IconButton
                      aria-label="view details"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(product);
                      }}
                      sx={{
                        backgroundColor: Colors.LOGOColor,
                        color: "white",
                        "&:hover": {
                          backgroundColor: Colors.LOGOlight,
                        },
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </CardActions>
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
