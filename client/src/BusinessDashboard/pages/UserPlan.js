import React, { useEffect, useState } from "react";
import {
  Box, Card, Typography, Divider, Chip, Button, Stack, Avatar, CircularProgress, Grid
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";

import { useNavigate } from "react-router-dom";
import { useSelector }  from  "react-redux";
import axios from  "../../axiosInstance";
import { message }from "antd";
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
            // Determine price and duration based on availability
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
      <>
      
        <Box height="60vh" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
     
      </>
    );
  }

  if (businessPlans.length === 0) {
    return (
      <>
   
        <Box textAlign="center" mt={10}>
          <Typography variant="h6" color="text.secondary">
            No plan details available.
          </Typography>
        </Box>
     
      </>
    );
  }

  return (
    <>
   
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
        <Grid container spacing={4} mt={3}>
          {businessPlans.map(({ businessName, plan }, index) => (
            <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 0,
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: 'linear-gradient(to bottom, #ffffff, #f5faf6)',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '100%',
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
                    <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "Poppins, sans-serif", color: '#275559' }}>
                      {businessName}
                    </Typography>
                    {plan.isActive && (
                      <Chip label="Active" color="success" size="small"
                        sx={{ fontWeight: 'bold', backgroundColor: '#e8f5e9', color: '#2e7d32' }} />
                    )}
                  </Stack>

                  <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)', borderBottomWidth: 2 }} />

                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Avatar sx={{
                      bgcolor: '#275559',
                      width: 56,
                      height: 56,
                      fontSize: 24,
                      fontWeight: 'bold'
                    }}>
                      {plan.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="#275559">
                        {plan.name}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CurrencyRupeeIcon fontSize="small" sx={{ color: '#9EDC29' }} />
                        <Typography variant="h6" fontWeight={700} color="#275559">
                          {plan.price} / {plan.duration}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  <Box sx={{
                    backgroundColor: '#f0f7e8',
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                    borderLeft: '4px solid #9EDC29'
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <EventIcon fontSize="small" sx={{ color: '#275559' }} />
                      <Typography variant="body2" color="#275559" fontWeight={500}>
                        Started on: {new Date(plan.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)', borderBottomWidth: 2 }} />

                  {/* <Typography variant="subtitle1" gutterBottom fontWeight={600} sx={{ color: '#275559' }}>
                    Plan Benefits:
                  </Typography>

                  <Stack spacing={1} mb={3}>
                    {plan.features.map((feature, index) => (
                      <Stack key={index} direction="row" alignItems="center" spacing={1}
                        sx={{ p: 1, borderRadius: 1, '&:hover': { backgroundColor: '#f5faf6' } }}>
                        <CheckCircleIcon sx={{ color: '#9EDC29' }} />
                        <Typography variant="body1" sx={{ color: '#275559' }}>
                          {feature}
                        </Typography>
                        {index < 2 && (
                          <Chip icon={<StarIcon sx={{ color: '#ffc107', fontSize: 16 }} />}
                            label="Popular" size="small"
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
                  </Stack> */}

                  <Stack
                    direction={{ xs: 'row', sm: 'row', md: 'row' }}
                    spacing={2}
                    width="100%"
                  >
                    <Button
                      onClick={() => navigate('/plans')}
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: '#275559',
                        '&:hover': { backgroundColor: '#1a3a3d' },
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Upgrade Plan
                    </Button>
                    {/* <Button
                      onClick={() => navigate('/contact')}
                      variant="outlined"
                      fullWidth
                      sx={{
                        color: '#275559',
                        borderColor: '#275559',
                        '&:hover': { borderColor: '#1a3a3d', backgroundColor: '#f9f9f9' },
                        py: 1.5,
                        px: { xs: 2, sm: 3, md: 4 },
                        borderRadius: 2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Manage Subscription
                    </Button> */}
                  </Stack>

                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    
    </>
  );
};

export default PlanView;