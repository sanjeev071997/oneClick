import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Link, Divider, useTheme, useMediaQuery, Grid } from '@mui/material';
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
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [loading, setLoading] = useState(false)


  
const [categories, setCategories] = useState([]);

const fetchCategories = async () => {
  setLoading(true); // <== Important to show it's loading
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
  if (!categories || categories.length === 0) {
    return;
  }

  const category = categories.find(cat => 
    cat.name.toLowerCase() === name.toLowerCase()
  );

  if (category) {
    navigate(`/category/${category.name}`, { state: { category } });
  } else {
    navigate(`/category/${name}`); // fallback
  }
};


 useEffect(() => {
    fetchCategories();
  }, []);

  

  const travelOptions = [
    {
      icon: <FlightIcon sx={{ color: '#1976d2' }} />,
      title: "Flight",
      poweredBy: "Easemytrip.com",
      name: "Flights"
    },
    {
      icon: <BusIcon sx={{ color: '#d81b60' }} />,
      title: "Bus",
      subtitle: "Affordable Rides",
      name: "Bus"
    },
    {
      icon: <TrainIcon sx={{ color: '#ff9800' }} />,
      title: "Train",
      subtitle: "Budget-friendly Travel",
      name: "Trains"
    },
    {
      icon: <HotelIcon sx={{ color: '#4caf50' }} />,
      title: "Hotel",
      subtitle: "Stay Comfortable",
      name: "hotels"
    },
    {
      icon: <CarIcon sx={{ color: '#9c27b0' }} />,
      title: "Car Rentals",
      poweredBy: "Easemytrip.com",
      name: "Car Rentals"
    }
  ];


  const TravelOption = ({ icon, title, subtitle, poweredBy, name }) => (
    <Grid item xs={6} sm={4} md={2.4} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box 
        onClick={() => handleTravelClick(name)}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          width: '100%',
          maxWidth: 120,
          mb: { xs: 2, md: 0 },
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
          p: { xs: 1, sm: 1.5 }, 
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
              fontSize: { xs: '24px', sm: '28px' },
              width: '100%',
              height: '100%'
            }
          })}
        </Box>
        <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.875rem' }}>
          {title}
        </Typography>
        {(poweredBy || subtitle) && (
          <Typography variant="caption" sx={{ 
            color: '#388e3c',
            fontSize: '0.7rem',
            lineHeight: 1.2,
            mt: 0.5
          }}>
            {poweredBy ? `Powered By ${poweredBy}` : subtitle}
          </Typography>
        )}
      </Box>
    </Grid>
  );

  return (
    <Box sx={{ 
      maxWidth: 1380, 
      mx: 'auto', 
      py: 0,
      mt: 3,  
      border: '1px solid #e0e0e0',  
      borderRadius: 2,
      width: '95%',
      [theme.breakpoints.up('sm')]: {
        width: '100%'
      }
    }}>
      <TravelCard>
        <Grid container spacing={2} sx={{ alignItems: isDesktop ? 'center' : 'flex-start' }}>
          {/* Left Text Section */}
          <Grid item xs={12} md={3} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: isMedium ? 'none' : '1px solid #e0e0e0',
            pr: isMedium ? 0 : 4,
            pb: isMedium ? 2 : 0,
            textAlign: isMedium ? 'center' : 'left'
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: '1.5rem' }}>
              Travel Bookings
            </Typography>
            <Typography variant="body2" sx={{ 
              mb: 2, 
              fontSize: '1rem',
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
                alignSelf: isMedium ? 'center' : 'flex-start',
                fontSize: '1rem'
              }}
            >
              Explore More
            </Link>
            {isMedium && (
              <Divider sx={{ width: '100%', my: 3 }} />
            )}
          </Grid>

          {/* Right Travel Options Section */}
          <Grid item xs={12} md={9}>
            <Grid
              container
              spacing={1}
              sx={{
                justifyContent: {
                  xs: 'space-between',
                  sm: 'center',
                  md: 'space-between',
                },
                alignItems: 'center',
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
                  onClick={() => handleTravelClick(option.name)}
                  />
                ))}
             
            </Grid>
          </Grid>
        </Grid>
      </TravelCard>
    </Box>
  );
};

export default TravelBookings;
