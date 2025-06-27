
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Card,
  CardMedia,
  Divider,
  Stack,
  Paper,
  useMediaQuery,
  useTheme,
  Rating,
  Container,
  Fade,
  Grow
} from "@mui/material";
import { Colors } from "../Comman";
import { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const ProductDetails = () => {
  const { state } = useLocation();
  const product = state?.product;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const images = product?.images || [];
  const [selectedImage, setSelectedImage] = useState(
    images[0]?.url || images[0] || ""
  );
  const [zoom, setZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">No product found</Typography>
      </Box>
    );
  }

  const handleImageHover = (e) => {
    if (!isSmallScreen) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setZoomPosition({ x, y });
      setZoom(true);
    }
  };

  const handleImageLeave = () => {
    setZoom(false);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column (Images) */}
          <Grid item xs={12} md={6} lg={5}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isSmallScreen ? 'column' : 'row-reverse',
              gap: 2
            }}>
              {/* Main Image */}
              <Box sx={{ 
                flex: 1, 
                position: 'relative',
                width: '100%'
              }}>
                <Grow in={true} timeout={500}>
                  <Card 
                    sx={{ 
                      p: 1, 
                      borderRadius: 3,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      position: 'relative',
                      height: '100%'
                    }}
                    onMouseMove={handleImageHover}
                    onMouseLeave={handleImageLeave}
                  >
                    <CardMedia
                      component="img"
                      image={selectedImage}
                      alt={product.name}
                      sx={{
                        height: isMediumScreen ? 400 : 500,
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        transform: zoom ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                      }}
                    />
                    {zoom && (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `url(${selectedImage}) no-repeat`,
                        backgroundSize: '200%',
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        opacity: 0.5,
                        pointerEvents: 'none'
                      }} />
                    )}
                  </Card>
                </Grow>
              </Box>

              {/* Thumbnail Images */}
              {!isSmallScreen && (
                <Box sx={{
                  width: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  overflowY: 'auto',
                  maxHeight: 500,
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: 4,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: Colors.LOGOColor,
                    borderRadius: 2,
                  }
                }}>
                  {images.map((img, index) => {
                    const imgUrl = img.url || img;
                    return (
                      <Fade in={true} key={index} timeout={(index + 1) * 200}>
                        <Paper
                          elevation={selectedImage === imgUrl ? 4 : 1}
                          sx={{
                            width: 70,
                            height: 70,
                            cursor: "pointer",
                            borderRadius: 2,
                            overflow: "hidden",
                            flexShrink: 0,
                            border:
                              selectedImage === imgUrl
                                ? `2px solid ${Colors.LOGOColor}`
                                : "1px solid #e0e0e0",
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }
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
                      </Fade>
                    );
                  })}
                </Box>
              )}
            </Box>

            {/* Thumbnail Images for Small Screens */}
            {isSmallScreen && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ 
                  mt: 2,
                  overflowX: "auto",
                  pb: 1,
                  width: '100%'
                }}
              >
                {images.map((img, index) => {
                  const imgUrl = img.url || img;
                  return (
                    <Fade in={true} key={index} timeout={(index + 1) * 200}>
                      <Paper
                        elevation={selectedImage === imgUrl ? 4 : 1}
                        sx={{
                          width: 80,
                          height: 80,
                          cursor: "pointer",
                          borderRadius: 2,
                          overflow: "hidden",
                          flexShrink: 0,
                          border:
                            selectedImage === imgUrl
                              ? `2px solid ${Colors.LOGOColor}`
                              : "1px solid #e0e0e0",
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
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
                    </Fade>
                  );
                })}
              </Stack>
            )}
          </Grid>

          {/* Right Column (Details) */}
          <Grid item xs={12} md={6} lg={7}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  mb: 2
                }}
              >
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Chip 
                  label={product.category} 
                  color="secondary" 
                  sx={{ 
                    mr: 2,
                    borderRadius: 1,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '0.7rem'
                  }} 
                />
                <Rating
                  value={4.5}
                  precision={0.5}
                  readOnly
                  sx={{ color: Colors.LOGOColor }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  (24 reviews)
                </Typography>
              </Box>

              <Box sx={{ 
                backgroundColor: '#f9f9f9', 
                p: 3, 
                borderRadius: 2,
                mb: 3,
                borderLeft: `4px solid ${Colors.LOGOColor}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
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
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>

              </Box>

              <Divider sx={{ my: 3 }} />


              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                  {product.details || "No description available"}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetails;