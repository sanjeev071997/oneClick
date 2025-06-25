import React, { useEffect, useState } from "react";
import {
  Box, Typography, Divider, Chip, Button, Stack, Avatar, CircularProgress, Grid
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EventIcon from "@mui/icons-material/Event";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axiosInstance";
import { message } from "antd";
import { Colors } from "../../Comman";

const PlanView = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [businessPlans, setBusinessPlans] = useState([]);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get("/api/v1/business/get", {
        data: { userId: user._id }
      });

      const businesses = res.data?.data || [];
      const plans = businesses
        .filter(business => business.planId)
        .map(business => ({
          businessName: business.businessName,
          plan: {
            name: business.planId.planName,
            price: business.planId.monthlyPlanPrice !== "0" && business.planId.monthlyPlanPrice !== null
              ? business.planId.monthlyPlanPrice
              : business.planId.annuallyPlanPrice,
            duration: business.planId.monthlyDuration !== null
              ? business.planId.monthlyDuration
              : business.planId.annuallyDuration,
            features: business.planId.planFeatures || [],
            isActive: business.planId.isActive,
            createdAt: business.planId.createdAt
          }
        }));

      if (plans.length > 0) {
        setBusinessPlans(plans);
      } else {
        message.warning("No plans associated with your businesses.");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch businesses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchBusinesses();
  }, [user]);

  if (loading) {
    return (
      <Box height="60vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (businessPlans.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="text.secondary">
          No plan details available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth={1200} mx="auto" mt={5} px={2} mb={5}>
      {/* Business Heading */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "2rem",
          color: Colors.LOGOColor,
          fontWeight: 700,
          display: "inline-block",
          position: "relative",
          pb: 1,
          alignSelf: { xs: "center", sm: "flex-start" },
        }}
      >
        Business Plans
        <Box
          sx={{
            content: '""',
            width: 60,
            height: 3,
            bgcolor: Colors.LOGOColor,
            margin: "8px auto 0",
            borderRadius: 2,
          }}
        />
      </Typography>

      <Stack spacing={4} mt={3}>
        {businessPlans.map(({ businessName, plan }, index) => (
          <Box
            key={index}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderBottom: '1px solid #eee',
              backgroundColor: plan.isActive ? 'rgba(158, 220, 41, 0.08)' : 'background.paper',
              borderRadius: 2,
              transition: 'all 0.3s ease-in-out',
              position: 'relative',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }} 
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }} 
              spacing={{ xs: 2, sm: 3 }}
            >
              <Box sx={{ flexGrow: 1 }}> 
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Typography variant="h6" fontWeight="bold" color={Colors.LOGOColor}>
                    {businessName}
                  </Typography>
                  {plan.isActive && (
                    <Chip
                      label="Active Plan"
                      color="success"
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        ml: 1,
                      }}
                    />
                  )}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{
                    bgcolor: Colors.LOGOColor,
                    color: '#fff',
                    width: 40,
                    height: 40,
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}>
                    {plan.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color={Colors.LOGOlight}>
                      {plan.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <CurrencyRupeeIcon fontSize="small" sx={{ color: Colors.LOGOColor }} />
                      <Typography variant="h5" fontWeight={700} color={Colors.LOGOColor}>
                        {plan.price}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">/{plan.duration}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ minWidth: { sm: 180 }, textAlign: { xs: 'left', sm: 'right' } }}>
                <Stack direction="row" alignItems="center" spacing={1} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                  <EventIcon fontSize="small" sx={{ color: Colors.LOGOColor }} />
                  <Typography variant="body2" color="text.secondary">
                    Started: {new Date(plan.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Typography>
                </Stack>
                <Button
                  onClick={() => navigate('/plans')}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: { xs: 2, sm: 1 },
                    backgroundColor: Colors.LOGOlight,
                    color: Colors.LOGOColor,
                    '&:hover': { backgroundColor: Colors.LOGOColor, color: '#fff' },
                    py: 0.8,
                    borderRadius: 1,
                    fontWeight: 'medium',
                    textTransform: 'none',
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Upgrade Plan
                </Button>
              </Box>
            </Stack>
            {index < businessPlans.length - 1 && (
              <Divider sx={{ mt: 4, borderColor: 'rgba(0,0,0,0.05)' }} />
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default PlanView;