import React from "react";
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
  Divider
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import { FontWeight, Colors } from "../Comman";


const PricingPlans = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "per month",
      description: "Ideal for trying out our services",
      features: [
        "Up to 10 leads/month",
        "Basic business profile",
        "Community access"
      ],
      popular: false
    },
    {
      name: "Starter",
      price: "99",
      period: "per month",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 50 leads/month",
        "Basic business profile",
        "Email support",
        "Community access"
      ],
      popular: false
    },
    {
      name: "Growth",
      price: "299",
      period: "six month",
      description: "For businesses ready to scale",
      features: [
        "Unlimited leads",
        "Enhanced profile",
        "Priority support",
        "Basic analytics",
        "Featured in category"
      ],
      popular: true 
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large businesses",
      features: [
        "Dedicated account manager",
        "API access",
        "White-label options",
        "Advanced analytics",
        "Custom integrations"
      ],
      popular: false
    }
  ];

  return (
    <>
      <Navbar />
      <Box sx={{ py: 8, }}>
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

          <Grid container spacing={3} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Card
                  sx={{
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
                        fontWeight: 700,
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
                          fontWeight: 700,
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
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: FontWeight.Bold,
                            color: Colors.LOGOColor,
                            lineHeight: 1
                          }}
                        >
                          {plan.price === "0" ? "Free" : `$${plan.price}`}
                        </Typography>
                        {plan.period && (
                          <Typography
                            variant="body1"
                            sx={{
                              color: Colors.lightText,
                              ml: 1,
                              mb: 0.5
                            }}
                          >
                            {plan.period}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 3, borderColor: "rgba(38, 91, 95, 0.1)" }} />

                    <Box>
                      {plan.features.map((feature, i) => (
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
                      onClick={() => navigate("/add/business" )}
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
                      Get Started
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default PricingPlans;