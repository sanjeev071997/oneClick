import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CircularProgress,
    Box,
    Button,
    Chip, 
} from "@mui/material";
import axios from "../axiosInstance";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Colors } from "../Comman";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import heroBanner1 from '../Images/beauty.jpg';
import heroBanner2 from '../Images/car.jpg';


const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- fetch Function ---
    const fetchAllProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get("/api/v1/product/all");
            setProducts(res.data?.allProduct || []);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError("Failed to load products. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // --- Effects ---
    useEffect(() => {
        fetchAllProducts();
    }, []);

    // --- Slider Settings ---
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
        arrows: false,
        fade: true,
        cssEase: "ease-in-out",
    };

    const sliderImages = [
        { src: heroBanner1 },
        { src: heroBanner2 },
    ];

    return (
        <>
            <Navbar />

            {/* Hero Slider Section */}
            <Box
                sx={{
                    mb: 6,
                    overflow: "hidden",
                    maxHeight: { xs: 300, sm: 400, md: 450 },
                }}
            >
                <Slider {...sliderSettings}>
                    {sliderImages.map((item, index) => (
                        <Box key={index} sx={{ position: "relative" }}>
                            <img
                                src={item.src}
                                alt={item.alt}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    filter: "brightness(0.7)",
                                }}
                            />

                        </Box>
                    ))}
                </Slider>
            </Box>

            <Container maxWidth="xl" sx={{ py: 6 }}>
                {/* Section Title */}
                <Box sx={{ textAlign: "center", mb: 5, mt: -7 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            fontFamily: "Segoe UI, Roboto, sans-serif",
                            color: Colors.LOGOColor,
                            textTransform: "uppercase",
                            position: "relative",
                            display: "inline-block",
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                width: "60%",
                                height: "4px",
                                bottom: -8,
                                left: "20%",
                                bgcolor: Colors.LOGOColor,
                                borderRadius: 2,
                            }
                        }}
                    >
                        Our Products
                    </Typography>
                </Box>

                {/* Product Listing */}
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 8, minHeight: '300px' }}>
                        <CircularProgress color="primary" />
                        <Typography variant="h6" color="text.secondary" ml={2}>Loading products...</Typography>
                    </Box>
                ) : error ? (
                    <Box sx={{ textAlign: "center", mt: 8, minHeight: '300px' }}>
                        <Typography variant="h6" color="error">
                            {error}
                        </Typography>
                        <Button onClick={fetchAllProducts} sx={{ mt: 2 }}>
                            Reload Products
                        </Button>
                    </Box>
                ) : products.length === 0 ? (
                    <Box sx={{ textAlign: "center", mt: 8, minHeight: '300px' }}>
                        <Typography variant="h6" color="text.secondary">
                            No products found. Check back soon!
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {products.map((product) => {
                            const imageUrl =
                                product.images?.[0]?.url || product.images?.[0]

                            // Calculate discount percentage if original price is greater than total price
                            const discountPercentage =
                                product.price > product.totalPrice
                                    ? Math.round(((product.price - product.totalPrice) / product.price) * 100)
                                    : 0;

                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                    <Card
                                        component={RouterLink}
                                        to={`/product/${product._id}`}
                                        sx={{
                                            borderRadius: 3,
                                            boxShadow: 3,
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: 6,
                                                textDecoration: "none",
                                            },
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            textDecoration: "none",
                                        }}
                                    >
                                       
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="220"
                                                image={imageUrl}
                                                alt={product.name || "Product image"}
                                                sx={{ objectFit: "cover", borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
                                            />
                                            {/* Discount Chip */}
                                            {discountPercentage > 0 && (
                                                <Chip
                                                    label={`${discountPercentage}% OFF`}
                                                    size="small"
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
                                                        py: 1.2,
                                                        borderTopRightRadius: "0px",
                                                        borderBottomRightRadius: "6px",
                                                        borderTopLeftRadius: "0px",
                                                        borderBottomLeftRadius: "0px",
                                                        height: "80px",
                                                        zIndex: 2,
                                                    }}
                                                />
                                            )}


                                        </Box>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                gutterBottom
                                                sx={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: "vertical",
                                                }}
                                            >
                                                {product.name}
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
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
                                                <Typography
                                                    variant="h6"
                                                    color={Colors.LOGOColor}
                                                    fontWeight="bold"
                                                >
                                                    ₹
                                                    {parseFloat(
                                                        product.totalPrice || product.price
                                                    ).toFixed(2)}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    mt: 2,
                                                    color: Colors.LOGOColor,
                                                    borderColor: Colors.LOGOColor,
                                                    "&:hover": {
                                                        bgcolor: Colors.LOGOlight,
                                                        borderColor: Colors.LOGOlight,
                                                        color: "white",
                                                    },
                                                    textTransform: "none",
                                                }}
                                                component={RouterLink}
                                                to={`/product/${product._id}`}
                                            >
                                                View Details
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default Shop;