import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Paper,
  Container,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from '../axiosInstance';
import { Colors, FontFamily, FontWeight } from '../Comman';

const categories = [
  {
    title: 'Transporters',
    services: [
      { label: 'Truck Transport', image: require('../Images/truck.jpg'), name: 'Transporters' },
      { label: 'Bike Transport', image: require('../Images/bike.jpg'), name: 'Transporters' },
      { label: 'Car Transport', image: require('../Images/car.webp'), name: 'Transporters' },
    ],
  },
  {
    title: 'Courier Service',
    services: [
      { label: 'Local Courier', image: require('../Images/local.jpg'), name: 'Courier Service' },
      { label: 'National Courier', image: require('../Images/National.webp'), name: 'Courier Service' },
      { label: 'International Courier', image: require('../Images/interr.webp'), name: 'Courier Service' },
    ],
  },
];

const CategoriesBanner = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch banners and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, categoryRes] = await Promise.all([
          axios.get('/api/v1/homehighlights/get'),
          axios.get('/api/v1/categories/get'),
        ]);

        setBanners(bannerRes.data.homeHighlights || []);
        setCategoryList(categoryRes.data.getCategories || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Get category object by name
  const getCategoryByName = (name) => {
    return categoryList.find(
      (cat) => cat.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Container maxWidth={false} sx={{ mt: 8, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'stretch' }}>
        
        {/* Left Side - Categories */}
        <Box sx={{ flex: 1 }}>
          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  elevation={3}
                  sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: '#D3D3D3' }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: Colors.LOGOColor, fontFamily: FontFamily.Georgia }}
                  >
                    {category.title}
                  </Typography>
                  <Grid container spacing={2}>
                    {category.services.map((service, idx) => {
                      const matchedCategory = getCategoryByName(service.name);

                      return (
                        <Grid item xs={4} key={idx}>
                          <Card
                            sx={{ borderRadius: 2, boxShadow: 'none', cursor: 'pointer' }}
                            onClick={() => {
                              if (matchedCategory?._id) {
                                navigate(`/category/${matchedCategory._id}`, {
                                  state: { category: matchedCategory },
                                });
                              } else {
                                alert(`No category found for ${service.name}`);
                              }
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="140"
                              image={service.image}
                              alt={service.label}
                              sx={{
                                borderRadius: 2,
                                transition: '0.3s',
                                '&:hover': { boxShadow: 3 },
                              }}
                            />
                            <CardContent sx={{ p: 1 }}>
                              <Typography
                                variant="body2"
                                align="center"
                                fontWeight={FontWeight.heading2}
                                sx={{ color: Colors.LOGOColor, fontFamily: FontFamily.inriaSerif }}
                              >
                                {service.label}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Right Side - Banner Slider */}
        <Box
          sx={{
            flex: 1,
            borderRadius: 3,
            overflow: 'hidden',
            height: { xs: 250, sm: 450, md: 548 },
            position: 'relative',
            pb: 4,
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Slider {...sliderSettings}>
              {banners.map((banner, index) => (
                <Box
                  key={index}
                  sx={{
                    height: { xs: 250, sm: 450, md: 548 },
                  }}
                >
                  <img
                    src={banner?.imageUrl}
                    alt={`Banner ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundSize: 'cover',
                      borderRadius: '16px',
                      display: 'block',
                    }}
                  />
                </Box>
              ))}
            </Slider>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default CategoriesBanner;
