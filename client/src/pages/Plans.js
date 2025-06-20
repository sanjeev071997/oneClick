import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Snackbar,
  Alert
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import { FontWeight, Colors } from "../Comman";
import axios from "../axiosInstance";
import { useSelector } from "react-redux";

const PricingPlans = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.user);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0 for monthly, 1 for annually
  const [displayPlans, setDisplayPlans] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const getPlans = async () => {
    try {
      const response = await axios.get("/api/v1/plans/all");
      const plansArray = Array.isArray(response.data)
        ? response.data
        : response.data.plans || response.data.data || [];

      const formattedPlans = plansArray.map((plan) => ({
        id: plan._id,
        name: plan.planName,
        monthlyPrice: plan.monthlyPlanPrice,
        annualPrice: plan.annuallyPlanPrice,
        monthlyPeriod: plan.monthlyDuration,
        annualPeriod: plan.annuallyDuration,
        description: plan.planDescription,
        features: plan.planFeatures,
        popular: plan.planName.toLowerCase() === "premium plan",
        isActive: plan.isActive,
        planStatus: plan.planStatus
      }));

      setPlans(formattedPlans);
      setDisplayPlans(formatPlansForDisplay(formattedPlans, 0));
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
      setDisplayPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPlansForDisplay = (plansData, tabIndex) => {
    return plansData.map(plan => ({
      ...plan,
      displayPrice: tabIndex === 0 ? plan.monthlyPrice : plan.annualPrice,
      displayPeriod: tabIndex === 0 ? plan.monthlyPeriod : plan.annualPeriod,
      isAnnual: tabIndex === 1
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setDisplayPlans(formatPlansForDisplay(plans, newValue));
  };

  useEffect(() => {
    getPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    if (!user) {
      setSnackbarMessage("Please login to select a plan");
      setSnackbarOpen(true);
      return;
    }

    // Navigate for any plan (not just Basic Plan)
    navigate("/add/business", {
      state: {
        planName: plan.name,
        planPrice: plan.displayPrice,
        isAnnual: plan.isAnnual,
        planId: plan.id
      }
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip
              label="Pricing Plans"
              variant="outlined"
              sx={{
                mb: 2,
                color: Colors.LOGOColor,
                borderColor: Colors.LOGOlight,
                fontWeight: FontWeight.heading2
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: FontWeight.heading2,
                color: Colors.darkText,
                mb: 2,
                fontSize: isMobile ? "2rem" : "2.5rem"
              }}
            >
              Simple, transparent pricing
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: Colors.lightText,
                maxWidth: 600,
                mx: "auto",
                fontSize: isMobile ? "1rem" : "1.1rem"
              }}
            >
              Choose the plan that fits your business needs. No hidden fees.
            </Typography>
          </Box>

          {/* Billing Toggle */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4,
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 1,
            maxWidth: 300,
            mx: 'auto',
            boxShadow: 1,
            border: `1px solid ${Colors.LOGOlight}`
          }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                minHeight: 'auto',
                '& .MuiTabs-indicator': {
                  height: '100%',
                  borderRadius: 2,
                  bgcolor: Colors.LOGOlight,
                  opacity: 0.2
                }
              }}
            >
              <Tab
                label="Monthly"
                sx={{
                  minHeight: 'auto',
                  py: 1,
                  px: 2,
                  fontSize: '0.875rem',
                  fontWeight: activeTab === 0 ? FontWeight.heading2 : FontWeight.heading1,
                  color: activeTab === 0 ? Colors.LOGOColor : Colors.LOGOlight,
                  zIndex: 1
                }}
              />
              <Tab
                label="Annually"
                sx={{
                  minHeight: 'auto',
                  py: 1,
                  px: 2,
                  fontSize: '0.875rem',
                  fontWeight: activeTab === 1 ? FontWeight.heading2 : FontWeight.heading1,
                  color: activeTab === 1 ? Colors.LOGOColor : Colors.LOGOlight,
                  zIndex: 1
                }}
              />
            </Tabs>
          </Box>

          {displayPlans.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Typography variant="h6" color="textSecondary">
                No pricing plans available at the moment.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {displayPlans.map((plan, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      width: "100%", 
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(38, 91, 95, 0.08)",
                      border: plan.popular
                        ? `2px solid ${Colors.LOGOlight}`
                        : "none",
                      transform: plan.popular ? "translateY(-8px)" : "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: plan.popular
                          ? "translateY(-8px) scale(1.01)"
                          : "translateY(-4px)",
                        boxShadow: "0 12px 28px rgba(38, 91, 95, 0.12)"
                      }
                    }}
                  >

                    {plan.popular && (
                      <Box
                        sx={{
                          bgcolor: Colors.LOGOlight,
                          color: Colors.LOGOColor,
                          py: 1,
                          textAlign: "center",
                          fontWeight: FontWeight.heading2,
                          fontSize: "0.9rem"
                        }}
                      >
                        MOST POPULAR
                      </Box>
                    )}

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 4,
                        pb: 3,
                        bgcolor: "white"
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: FontWeight.heading2,
                            color: Colors.darkText
                          }}
                        >
                          {plan.name}
                        </Typography>
                        {plan.popular && (
                          <StarIcon
                            sx={{
                              ml: 1,
                              color: Colors.LOGOColor,
                              fontSize: "1.2rem"
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          color: Colors.lightText,
                          mb: 3,
                          minHeight: "48px"
                        }}
                      >
                        {plan.description}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-end", mb: 1 }}>
                          {plan.displayPrice === "0" ? (
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: FontWeight.heading2,
                                fontSize: 20,
                                color: Colors.LOGOColor,
                                lineHeight: 1
                              }}
                            >
                              Free
                            </Typography>
                          ) : (
                            <>
                              <CurrencyRupeeIcon sx={{ color: Colors.LOGOColor, fontSize: 18 }} />
                              <Typography
                                variant="h3"
                                sx={{
                                  fontWeight: FontWeight.heading2,
                                  fontSize: 18,
                                  color: Colors.LOGOColor,
                                  lineHeight: 1
                                }}
                              >
                                {plan.displayPrice}
                              </Typography>
                            </>
                          )}
                          <Typography
                            variant="body1"
                            sx={{
                              color: Colors.lightText,
                              ml: 1,
                              mb: 0.5
                            }}
                          >
                            /{plan.displayPeriod}
                            {plan.isAnnual && plan.displayPrice !== "0" && (
                              <Box component="span" sx={{
                                fontSize: '0.75rem',
                                color: Colors.LOGOColor,
                                ml: 0.5
                              }}>
                                (Save 20%)
                              </Box>
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3, borderColor: "rgba(38, 91, 95, 0.1)" }} />

                      <Box>
                        {plan.features?.map((feature, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              mb: 2
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                bgcolor: Colors.LOGOlight,
                                color: Colors.LOGOColor,
                                mr: 2,
                                "& svg": { fontSize: "1rem" }
                              }}
                            >
                              <CheckIcon />
                            </Avatar>
                            <Typography
                              variant="body1"
                              sx={{
                                color: Colors.darkText,
                                pt: "2px"
                              }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>

                    <Box sx={{ p: 3, bgcolor: "white", textAlign: "center" }}>
                      <Button
                        variant={plan.popular ? "contained" : "outlined"}
                        fullWidth
                        size="large"
                        onClick={() => handlePlanSelect(plan)}
                        disabled={plan.planStatus === "Coming Soon" || !plan.isActive}
                        sx={{
                          fontWeight: FontWeight.heading1,
                          py: 1.5,
                          borderRadius: "12px",
                          ...(plan.popular
                            ? {
                              bgcolor: Colors.LOGOlight,
                              color: Colors.LOGOColor,
                              "&:hover": {
                                bgcolor: Colors.LOGOlight
                              }
                            }
                            : {
                              borderColor: Colors.LOGOColor,
                              color: Colors.LOGOColor,
                              "&:hover": {
                                bgcolor: "rgba(38, 91, 95, 0.05)",
                                borderColor: Colors.LOGOColor
                              }
                            })
                        }}
                      >
                        {plan.planStatus}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PricingPlans;