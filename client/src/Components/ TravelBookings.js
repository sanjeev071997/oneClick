import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Link, Divider, useTheme, useMediaQuery, Grid, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Flight as FlightIcon,
  DirectionsBus as BusIcon,
  Train as TrainIcon,
  Hotel as HotelIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material';
import axios from '../axiosInstance';

const TravelCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
  height: '100%',
}));

const TravelBookings = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'lg')); // 600px - 1200px (includes Surface Pro 7)
  const isLarge = useMediaQuery(theme.breakpoints.up('lg')); // > 1200px
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/categories/get");
      setCategories(res.data.getCategories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTravelClick = (name) => {
    if (!categories || categories.length === 0) return;
    const category = categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    if (category) {
      navigate(`/category/${category.name}`, { state: { category } });
    } else {
      navigate(`/category/${name}`);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const travelOptions = [
    { icon: <FlightIcon sx={{ color: '#1976d2' }} />, title: "Flight", poweredBy: "Easemytrip.com", name: "Flights" },
    { icon: <BusIcon sx={{ color: '#d81b60' }} />, title: "Bus", subtitle: "Affordable Rides", name: "Bus" },
    { icon: <TrainIcon sx={{ color: '#ff9800' }} />, title: "Train", subtitle: "Budget-friendly Travel", name: "Trains" },
    { icon: <HotelIcon sx={{ color: '#4caf50' }} />, title: "Hotel", subtitle: "Stay Comfortable", name: "hotels" },
    { icon: <CarIcon sx={{ color: '#9c27b0' }} />, title: "Car Rentals", poweredBy: "Easemytrip.com", name: "Car Rentals" }
  ];

  const TravelOption = ({ icon, title, subtitle, poweredBy, name }) => (
    <Grid item xs={6} sm={3} md={2.4} sx={{ 
      display: 'flex', 
      justifyContent: 'center',
      mb: isSmall ? 2 : 0,
      minWidth: isMedium ? '20%' : 'auto'
    }}>
      <Box
        onClick={() => handleTravelClick(name)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: isSmall ? 80 : isMedium ? 90 : 100,
          px: 1,
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease-in-out'
          }
        }}
      >
        <Box sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          p: isSmall ? 1 : isMedium ? 1.25 : 1.5,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          aspectRatio: '1/1'
        }}>
          {React.cloneElement(icon, {
            sx: {
              ...icon.props.sx,
              fontSize: isSmall ? '24px' : isMedium ? '26px' : '28px',
              width: '100%',
              height: '100%'
            }
          })}
        </Box>
        <Typography variant="body2" fontWeight="600" sx={{ 
          fontSize: isSmall ? '0.75rem' : isMedium ? '0.8rem' : '0.875rem',
          whiteSpace: 'nowrap'
        }}>
          {title}
        </Typography>
        {(poweredBy || subtitle) && (
          <Typography variant="caption" sx={{
            color: '#388e3c',
            fontSize: isSmall ? '0.6rem' : isMedium ? '0.65rem' : '0.7rem',
            lineHeight: 1.2,
            mt: 0.5,
            whiteSpace: 'nowrap'
          }}>
            {poweredBy ? `By ${poweredBy}` : subtitle}
          </Typography>
        )}
      </Box>
    </Grid>
  );

  return (
    <Container maxWidth={false} sx={{ 
      mt: 5,
      px: { xs: 2, sm: 3, md: 4 } // Better padding for different screens
    }}>
      <TravelCard sx={{ 
        ml: { xs: 0, sm: 0 },
        mr: { xs: 0, sm: 0 },
        px: { sm: 3 } // Add horizontal padding on small and up
      }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          {/* Left Text Section */}
          <Grid item xs={12} md={3} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: { xs: 'none', md: '1px solid #e0e0e0' },
            textAlign: { xs: 'center', md: 'left' },
            pr: { md: 3 },
            mb: { xs: 2, md: 0 },
            minWidth: isMedium ? '250px' : 'auto'
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.4rem', md: '1.5rem' } 
            }}>
              Travel Bookings
            </Typography>
            <Typography variant="body2" sx={{
              mb: 2,
              fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
              color: theme.palette.text.secondary
            }}>
              Instant ticket bookings for your best travel experience
            </Typography>
            <Link
              href="#"
              underline="hover"
              onClick={(e) => {
                e.preventDefault();
                navigate('/explore');
              }}
              sx={{
                fontWeight: 500,
                color: '#0070f3',
                alignSelf: { xs: 'center', md: 'flex-start' },
                fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' }
              }}
            >
              Explore More
            </Link>
            {isSmall && <Divider sx={{ width: '100%', my: 2 }} />}
          </Grid>

          {/* Right Travel Options Section */}
          <Grid item xs={12} md={9} sx={{
            pl: { md: 3 },
            overflow: isMedium ? 'hidden' : 'visible' 
          }}>
            <Grid
              container
              spacing={isSmall ? 1 : 2}
              sx={{
                justifyContent: {
                  xs: 'space-between',
                  sm: 'space-around',
                  md: 'space-between',
                },
                flexWrap: isMedium ? 'nowrap' : 'wrap', 
                overflowX: isMedium ? 'auto' : 'visible', 
                pb: isMedium ? 1 : 0, // Add padding for scrollbar
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.grey[300],
                  borderRadius: '2px',
                }
              }}
            >
              {travelOptions?.map((option, index) => (
                <TravelOption
                  key={index}
                  icon={option.icon}
                  title={option.title}
                  subtitle={option.subtitle}
                  poweredBy={option.poweredBy}
                  name={option.name}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </TravelCard>
    </Container>
  );
};

export default TravelBookings;