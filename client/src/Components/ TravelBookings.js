import React from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';
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
  display: 'flex',
  height: 'auto',
}));

const TravelOption = ({ icon, title, subtitle, poweredBy }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center', 
    width: 120, 
    mx: 1 
  }}>
    <Box sx={{ 
      border: '1px solid #e0e0e0', 
      borderRadius: '2%', 
      p: 1.5, 
      mb: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="body2" fontWeight="600">
      {title}
    </Typography>
    {poweredBy && (
      <Typography variant="caption" sx={{ color: '#388e3c' }}>
        Powered By {poweredBy}
      </Typography>
    )}
    {subtitle && (
      <Typography variant="caption" sx={{ color: '#388e3c' }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const TravelBookings = () => {
  return (
    <Box sx={{ maxWidth: 1380, mx: 'auto', py: 0,mt:3,  border: '1px solid #e0e0e0',  borderRadius: 2, }}>
      <TravelCard>
        {/* Left Text Section */}
        <Box sx={{ 
          width: '30%', 
          pr: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Travel Bookings
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Instant ticket bookings for your best travel experience
          </Typography>
          <Link href="#" underline="hover" sx={{ 
            fontWeight: 500, 
            color: '#0070f3',
            alignSelf: 'flex-start'
          }}>
            Explore More
          </Link>
        </Box>

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        {/* Right Travel Options Section */}
        <Box sx={{ 
          width: '70%',
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'space-around'
        }}>
          <TravelOption 
            icon={<FlightIcon fontSize="small" sx={{ color: '#1976d2' }} />} 
            title="Flight" 
            poweredBy="Easemytrip.com" 
          />
          <TravelOption 
            icon={<BusIcon fontSize="small" sx={{ color: '#d81b60' }} />} 
            title="Bus" 
            subtitle="Affordable Rides" 
          />
          <TravelOption 
            icon={<TrainIcon fontSize="small" sx={{ color: '#ff9800' }} />} 
            title="Train" 
            subtitle="Budget-friendly Stay" 
          />
          <TravelOption 
            icon={<HotelIcon fontSize="small" sx={{ color: '#4caf50' }} />} 
            title="Hotel" 
            subtitle="Drive Easy Anywhere" 
          />
          <TravelOption 
            icon={<CarIcon fontSize="small" sx={{ color: '#9c27b0' }} />} 
            title="Car Rentals" 
          />
        </Box>
      </TravelCard>
    </Box>
  );
};

export default TravelBookings;