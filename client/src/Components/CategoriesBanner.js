
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
      { label: 'Truck Transport', image: require('../Images/truck.jpg'), name: 'Transport Services' },
      { label: 'Bike Transport', image: require('../Images/bike.jpg'), name: 'Transport Services' },
      { label: 'Car Transport', image: require('../Images/car.webp'), name: 'Transport Services' },
    ],
  },
  {
    title: 'Courier Service',
    services: [
      { label: 'Local Courier', image: require('../Images/local.jpg'), name: 'Courier Delivery' },
      { label: 'National Courier', image: require('../Images/National.webp'), name: 'Courier Delivery' },
      { label: 'International Courier', image: require('../Images/interr.webp'), name: 'Courier Delivery' },
    ],
  },
];

const CategorySection = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get('/api/v1/homehighlights/get');
        setBanners(res.data.homeHighlights || []);
      } catch (error) {
        console.error('Failed to fetch banners', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  

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
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3,  alignItems: 'stretch' }}>
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
                    {category.services.map((service, idx) => (
                      <Grid item xs={4} key={idx}>
                        <Card
                          sx={{ borderRadius: 2, boxShadow: 'none', cursor: 'pointer' }}
                          onClick={() =>
                            navigate(`/category/${service.name}`, {
                              state: { category: service },
                            })
                          }
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
                    ))}
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
      {banners?.map((banner, index) => (
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
              // objectFit: 'cover',
               backgroundSize:"cover",
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

export default CategorySection;

