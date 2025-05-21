import React from 'react';
import { Box, Grid, Typography, Button, Avatar, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Flight as FlightIcon,
  DirectionsBus as BusIcon,
  Train as TrainIcon,
  Hotel as HotelIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material';

const TravelCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: theme.spacing(4),
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

const TravelOption = ({ icon, title, subtitle }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2, my: 1 }}>
    <Avatar sx={{ bgcolor: '#4f46e5', width: 56, height: 56, mb: 1 }}>
      {icon}
    </Avatar>
    <Typography variant="body1" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="caption" sx={{ color: '#718096' }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const TravelBookings = () => {
  return (
    <Box sx={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: { xs: '20px', md: '40px' },
      backgroundColor: '#f5f7fa'
    }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TravelCard>
            {/* Header Section */}
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2d3748', mb: 1 }}>
              Travel Bookings
            </Typography>
            <Typography variant="body1" sx={{ color: '#4a5568', mb: 2 }}>
              Instant ticket bookings for your best travel experience
            </Typography>
            <Button variant="contained" sx={{
              backgroundColor: '#4f46e5',
              color: 'white',
              borderRadius: '8px',
              padding: '8px 24px',
              textTransform: 'none',
              fontWeight: '500',
              mb: 4,
              '&:hover': {
                backgroundColor: '#4338ca'
              }
            }}>
              Explore More
            </Button>

            {/* Travel Icons Section */}
            <Stack direction="row" justifyContent="center" flexWrap="wrap">
              <TravelOption 
                icon={<FlightIcon />} 
                title="Flight" 
                subtitle="Easemytrip.com" 
              />
              <TravelOption 
                icon={<BusIcon />} 
                title="Bus" 
                subtitle="Affordable Rides" 
              />
              <TravelOption 
                icon={<TrainIcon />} 
                title="Train" 
                subtitle="IRCTC Services" 
              />
              <TravelOption 
                icon={<HotelIcon />} 
                title="Hotel" 
                subtitle="Best Deals" 
              />
              <TravelOption 
                icon={<CarIcon />} 
                title="Car Rentals" 
                subtitle="Drive Anywhere" 
              />
            </Stack>
          </TravelCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TravelBookings;
