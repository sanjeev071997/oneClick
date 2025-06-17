import React from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  Chip,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import {useNavigate} from "react-router-dom";

const PlanView = ({ plan }) => {
  const navigate= useNavigate();

  const currentPlan = plan || {
    name: "Premium Plan",
    price: 999,
    expiryDate: "2025-12-31",
    features: [
      "Unlimited Access",
      "Priority Support",
      "Free Upgrades",
      "Exclusive Content",
      "Advanced Analytics"
    ],
    isActive: true,
  };

  return (
    <>
    <Navbar />
    <Box
      maxWidth={800}
      mx="auto"
      mt={5}
      px={2}
    >
      <Card 
        elevation={0}
        sx={{ 
          borderRadius: 4, 
          p: 0,
          border: '1px solid rgba(0,0,0,0.1)',
          background: 'linear-gradient(to bottom, #ffffff, #f5faf6)',
          overflow: 'hidden',
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 8,
            background: 'linear-gradient(to right, #275559, #9EDC29)',
          }
        }}
      >
        <Box p={4}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ 
                fontFamily: "Poppins, sans-serif",
                color: '#275559'
              }}
            >
              Your Current Plan
            </Typography>
            
            {currentPlan.isActive && (
              <Chip
                label="Active"
                color="success"
                size="small"
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32'
                }}
              />
            )}
          </Stack>

          <Divider sx={{ 
            my: 2, 
            borderColor: 'rgba(0,0,0,0.08)',
            borderBottomWidth: 2 
          }} />

          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Avatar sx={{ 
              bgcolor: '#275559', 
              width: 56, 
              height: 56,
              fontSize: 24,
              fontWeight: 'bold'
            }}>
              {currentPlan.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="#275559">
                {currentPlan.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CurrencyRupeeIcon fontSize="small" sx={{ color: '#9EDC29' }} />
                <Typography variant="h6" fontWeight={700} color="#275559">
                  {currentPlan.price}/mo
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Box 
            sx={{
              backgroundColor: '#f0f7e8',
              borderRadius: 2,
              p: 2,
              mb: 3,
              borderLeft: '4px solid #9EDC29'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <EventIcon fontSize="small" sx={{ color: '#275559' }} />
              <Typography variant="body2" color="#275559" fontWeight={500}>
                Expires on: {new Date(currentPlan.expiryDate).toLocaleDateString()}
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ 
            my: 2, 
            borderColor: 'rgba(0,0,0,0.08)',
            borderBottomWidth: 2 
          }} />

          <Typography 
            variant="subtitle1" 
            gutterBottom 
            fontWeight={600}
            sx={{ color: '#275559' }}
          >
            Plan Benefits:
          </Typography>
          
          <Stack spacing={1} mb={3}>
            {currentPlan.features.map((feature, index) => (
              <Stack 
                key={index} 
                direction="row" 
                alignItems="center" 
                spacing={1}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: '#f5faf6'
                  }
                }}
              >
                <CheckCircleIcon sx={{ color: '#9EDC29' }} />
                <Typography variant="body1" sx={{ color: '#275559' }}>
                  {feature}
                </Typography>
                {index < 2 && (
                  <Chip 
                    icon={<StarIcon sx={{ color: '#ffc107', fontSize: 16 }} />} 
                    label="Popular" 
                    size="small" 
                    sx={{ 
                      ml: 'auto!important',
                      backgroundColor: '#fff8e1',
                      color: '#ff8f00',
                      fontSize: 12
                    }} 
                  />
                )}
              </Stack>
            ))}
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
               onClick={() => navigate('/plans')}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#275559',
                '&:hover': {
                  backgroundColor: '#1a3a3d'
                },
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold'
              }}
            >
              Upgrade Plan
            </Button>
            <Button
         onClick={() => navigate('/contact')}
              variant="outlined"
              fullWidth
              sx={{
                color: '#275559',
                borderColor: '#275559',
                '&:hover': {
                  borderColor: '#1a3a3d'
                },
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold'
              }}
            >
              Manage Subscription
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
    <Footer />
    </>
  );
};

export default PlanView;