// import React from "react";
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   Box,
//   Chip,
//   Avatar,
//   useTheme,
//   useMediaQuery,
//   Divider
// } from "@mui/material";
// import CheckIcon from "@mui/icons-material/Check";
// import StarIcon from "@mui/icons-material/Star";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
// import Footer from '../Components/Footer';
// import Navbar from '../Components/Navbar';
// import { FontWeight, Colors } from "../Comman";

// const PricingPlans = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const navigate = useNavigate();

//   const plans = [
//     {
//       name: "Free",
//       price: "0",
//       period: "per month",
//       description: "Ideal for trying out our services",
//       features: [
//         "Up to 10 leads/month",
//         "Basic business profile",
//         "Community access"
//       ],
//       popular: false
//     },
//     {
//       name: "Starter",
//       price: "Coming soon",
//       period: "",
//       description: "Perfect for small businesses getting started",
//       features: [
//         "Up to 50 leads/month",
//         "Basic business profile",
//         "Email support",
//         "Community access"
//       ],
//       popular: false
//     },
//     {
//       name: "Growth",
//       price: "Coming soon",
//       period: "",
//       description: "For businesses ready to scale",
//       features: [
//         "Unlimited leads",
//         "Enhanced profile",
//         "Priority support",
//         "Basic analytics",
//         "Featured in category"
//       ],
//       popular: true 
//     },
//     {
//       name: "Enterprise",
//       price: "Coming soon",
//       period: "",
//       description: "Tailored solutions for large businesses",
//       features: [
//         "Dedicated account manager",
//         "API access",
//         "White-label options",
//         "Advanced analytics",
//         "Custom integrations"
//       ],
//       popular: false
//     }
//   ];

//   const handlePlanSelect = (plan) => {
//     if (plan.name === "Free") {
//       navigate("/add/business", {
//         state: {
//           planName: plan.name,
//           planPrice: plan.price,
//         }
//       });
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ py: 8 }}>
//         <Container maxWidth="lg">
//           <Box textAlign="center" mb={6}>
//             <Chip
//               label="Pricing Plans"
//               variant="outlined"
//               sx={{
//                 mb: 2,
//                 color: Colors.LOGOColor,
//                 borderColor: Colors.LOGOlight,
//                 fontWeight: FontWeight.heading2
//               }}
//             />
//             <Typography
//               variant="h3"
//               sx={{
//                 fontWeight: FontWeight.heading2,
//                 color: Colors.darkText,
//                 mb: 2,
//                 fontSize: isMobile ? "2rem" : "2.5rem"
//               }}
//             >
//               Simple, transparent pricing
//             </Typography>
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 color: Colors.lightText,
//                 maxWidth: 600,
//                 mx: "auto",
//                 fontSize: isMobile ? "1rem" : "1.1rem"
//               }}
//             >
//               Choose the plan that fits your business needs. No hidden fees.
//             </Typography>
//           </Box>

//           <Grid container spacing={3} justifyContent="center">
//             {plans.map((plan, index) => (
//               <Grid item xs={12} md={3} key={index}>
//                 <Card
//                   sx={{
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     borderRadius: "16px",
//                     overflow: "hidden",
//                     boxShadow: "0 8px 24px rgba(38, 91, 95, 0.08)",
//                     border: plan.popular
//                       ? `2px solid ${Colors.LOGOlight}`
//                       : "none",
//                     transform: plan.popular ? "translateY(-8px)" : "none",
//                     transition: "all 0.3s ease",
//                     "&:hover": {
//                       transform: plan.popular
//                         ? "translateY(-8px) scale(1.01)"
//                         : "translateY(-4px)",
//                       boxShadow: "0 12px 28px rgba(38, 91, 95, 0.12)"
//                     }
//                   }}
//                 >
//                   {plan.popular && (
//                     <Box
//                       sx={{
//                         bgcolor: Colors.LOGOlight,
//                         color: Colors.LOGOColor,
//                         py: 1,
//                         textAlign: "center",
//                         fontWeight: FontWeight.heading2,
//                         fontSize: "0.9rem"
//                       }}
//                     >
//                       MOST POPULAR
//                     </Box>
//                   )}

//                   <CardContent
//                     sx={{
//                       flexGrow: 1,
//                       p: 4,
//                       pb: 3,
//                       bgcolor: "white"
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         mb: 2
//                       }}
//                     >
//                       <Typography
//                         variant="h5"
//                         sx={{
//                           fontWeight: FontWeight.heading2,
//                           color: Colors.darkText
//                         }}
//                       >
//                         {plan.name}
//                       </Typography>
//                       {plan.popular && (
//                         <StarIcon
//                           sx={{
//                             ml: 1,
//                             color: Colors.LOGOColor,
//                             fontSize: "1.2rem"
//                           }}
//                         />
//                       )}
//                     </Box>

//                     <Typography
//                       variant="body1"
//                       sx={{
//                         color: Colors.lightText,
//                         mb: 3,
//                         minHeight: "48px"
//                       }}
//                     >
//                       {plan.description}
//                     </Typography>

//                     <Box sx={{ mb: 3 }}>
//                       <Box sx={{ display: "flex", alignItems: "flex-end", mb: 1 }}>
//                         {plan.price === "0" ? (
//                           <Typography
//                             variant="h3"
//                             sx={{
//                               fontWeight: FontWeight.heading2,
//                               fontSize: 20,
//                               color: Colors.LOGOColor,
//                               lineHeight: 1
//                             }}
//                           >
//                             Free
//                           </Typography>
//                         ) : (
//                           <>
//                             <CurrencyRupeeIcon sx={{ color: Colors.LOGOColor, fontSize: 18 }} />
//                             <Typography
//                               variant="h3"
//                               sx={{
//                                 fontWeight: FontWeight.heading2,
//                                 fontSize: 18,
//                                 color: Colors.LOGOColor,
//                                 lineHeight: 1
//                               }}
//                             >
//                               {plan.price}
//                             </Typography>
//                           </>
//                         )}
//                         {plan.period && (
//                           <Typography
//                             variant="body1"
//                             sx={{
//                               color: Colors.lightText,
//                               ml: 1,
//                               mb: 0.5
//                             }}
//                           >
//                             {plan.period}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Box>

//                     <Divider sx={{ my: 3, borderColor: "rgba(38, 91, 95, 0.1)" }} />

//                     <Box>
//                       {plan.features.map((feature, i) => (
//                         <Box
//                           key={i}
//                           sx={{
//                             display: "flex",
//                             alignItems: "flex-start",
//                             mb: 2
//                           }}
//                         >
//                           <Avatar
//                             sx={{
//                               width: 24,
//                               height: 24,
//                               bgcolor: Colors.LOGOlight,
//                               color: Colors.LOGOColor,
//                               mr: 2,
//                               "& svg": { fontSize: "1rem" }
//                             }}
//                           >
//                             <CheckIcon />
//                           </Avatar>
//                           <Typography
//                             variant="body1"
//                             sx={{
//                               color: Colors.darkText,
//                               pt: "2px"
//                             }}
//                           >
//                             {feature}
//                           </Typography>
//                         </Box>
//                       ))}
//                     </Box>
//                   </CardContent>

//                   <Box sx={{ p: 3, bgcolor: "white", textAlign: "center" }}>
//                     <Button
//                       variant={plan.popular ? "contained" : "outlined"}
//                       fullWidth
//                       size="large"
//                       onClick={() => handlePlanSelect(plan)}
//                       disabled={plan.name !== "Free"}
//                       sx={{
//                         fontWeight: FontWeight.heading1,
//                         py: 1.5,
//                         borderRadius: "12px",
//                         ...(plan.popular
//                           ? {
//                             bgcolor: Colors.LOGOlight,
//                             color: Colors.LOGOColor,
//                             "&:hover": {
//                               bgcolor: Colors.LOGOlight
//                             }
//                           }
//                           : {
//                             borderColor: Colors.LOGOColor,
//                             color: Colors.LOGOColor,
//                             "&:hover": {
//                               bgcolor: "rgba(38, 91, 95, 0.05)",
//                               borderColor: Colors.LOGOColor
//                             }
//                           })
//                       }}
//                     >
//                       {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
//                     </Button>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>
//       <Footer />
//     </>
//   );
// };

// export default PricingPlans;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance"; 
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
  Stack,
  Skeleton
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { FontWeight, Colors } from "../Comman";

const PricingPlans = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPlans = async () => {
    try {
      const response = await axios.get("/api/v1/plans/all");
      const plansArray = Array.isArray(response.data)
        ? response.data
        : response.data.plans || response.data.data || [];

      const formattedPlans = plansArray.map((plan) => ({
        id: plan._id,
        name: plan.planName,
        price: plan.planPrice === 0 ? "0" : plan.planPrice,
        period: plan.planDuration === "monthly" ? "per month" : 
               plan.planDuration === "quarterly" ? "per quarter" : 
               "per year",
        description: plan.planDescription,
        features: plan.planFeatures,
        popular: plan.planName.toLowerCase() === "growth",
        isActive: plan.isActive
      }));

      setPlans(formattedPlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    if (plan.name.toLowerCase() === "free") {
      navigate("/add/business", {
        state: {
          planName: plan.name,
          planPrice: plan.price,
        },
      });
    }
  };

  const PriceDisplay = ({ price, period }) => {
    if (price === "0") {
      return (
        <Typography variant="h3" sx={{
          fontWeight: FontWeight.heading2,
          color: Colors.LOGOColor,
          lineHeight: 1,
          mb: 1
        }}>
          Free
        </Typography>
      );
    }
    
    return (
      <Box sx={{ display: "flex", alignItems: "flex-end", mb: 1 }}>
        <CurrencyRupeeIcon sx={{ 
          color: Colors.LOGOColor, 
          fontSize: "2rem",
          mr: 0.5
        }} />
        <Typography variant="h3" sx={{
          fontWeight: FontWeight.heading2,
          fontSize: "2.5rem",
          color: Colors.LOGOColor,
          lineHeight: 1
        }}>
          {price}
        </Typography>
        <Typography variant="body1" sx={{ 
          color: Colors.lightText, 
          ml: 1, 
          mb: 0.5,
          fontSize: "1rem"
        }}>
          {period}
        </Typography>
      </Box>
    );
  };

  const renderSkeletons = () => (
    <Grid container spacing={3} justifyContent="center">
      {[0, 1, 2].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card sx={{ 
            height: "100%", 
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(38, 91, 95, 0.08)"
          }}>
            <CardContent>
              <Skeleton variant="rectangular" width="60%" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="80%" height={20} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="40%" height={50} sx={{ mb: 3 }} />
              <Divider sx={{ my: 3 }} />
              {[0, 1, 2, 3].map((i) => (
                <Box key={i} sx={{ display: "flex", mb: 2 }}>
                  <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                  <Skeleton variant="text" width="80%" height={24} />
                </Box>
              ))}
              <Skeleton variant="rectangular" width="100%" height={50} sx={{ 
                mt: 3,
                borderRadius: "12px"
              }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <Navbar />
      <Box sx={{ 
        py: 8,
        background: "linear-gradient(to bottom, #f9fbfd 0%, #ffffff 100%)"
      }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Chip
              label="PRICING PLANS"
              variant="outlined"
              sx={{
                mb: 2,
                color: Colors.LOGOColor,
                borderColor: Colors.LOGOlight,
                fontWeight: FontWeight.heading2,
                letterSpacing: 1,
                px: 1,
                height: 32
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: FontWeight.heading2,
                color: Colors.darkText,
                mb: 2,
                fontSize: isMobile ? "2rem" : "3rem",
                lineHeight: 1.2
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
                fontSize: isMobile ? "1rem" : "1.1rem",
                lineHeight: 1.6
              }}
            >
              Choose the plan that fits your business needs. Start with our free plan and upgrade anytime.
            </Typography>
          </Box>

          {loading ? (
            renderSkeletons()
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {plans.map((plan, index) => (
                <Grid item xs={12} sm={6} md={4} key={plan.id}>
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
                        : "1px solid rgba(38, 91, 95, 0.1)",
                      transform: plan.popular ? "translateY(-8px)" : "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: plan.popular
                          ? "translateY(-8px) scale(1.01)"
                          : "translateY(-4px)",
                        boxShadow: "0 12px 28px rgba(38, 91, 95, 0.12)",
                      },
                    }}
                  >
                    {plan.popular && (
                      <Box
                        sx={{
                          bgcolor: Colors.LOGOlight,
                          color: Colors.LOGOColor,
                          py: 1.2,
                          textAlign: "center",
                          fontWeight: FontWeight.heading2,
                          fontSize: "0.85rem",
                          letterSpacing: 1
                        }}
                      >
                        MOST POPULAR
                      </Box>
                    )}

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 4,
                        pb: 2,
                        bgcolor: "white",
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: FontWeight.heading2,
                            color: Colors.darkText,
                          }}
                        >
                          {plan.name}
                        </Typography>
                        {plan.popular && (
                          <StarIcon
                            sx={{ 
                              color: Colors.LOGOColor, 
                              fontSize: "1.5rem",
                              ml: 1
                            }}
                          />
                        )}
                      </Stack>

                      <Typography
                        variant="body1"
                        sx={{
                          color: Colors.lightText,
                          mb: 3,
                          minHeight: "48px",
                          mt: 1
                        }}
                      >
                        {plan.description}
                      </Typography>

                      <PriceDisplay price={plan.price} period={plan.period} />

                      <Divider sx={{ 
                        my: 3, 
                        borderColor: "rgba(38, 91, 95, 0.1)" 
                      }} />

                      <Box sx={{ mb: 2 }}>
                        {plan.features.map((feature, i) => (
                          <Box key={i} sx={{ 
                            display: "flex", 
                            alignItems: "flex-start", 
                            mb: 2 
                          }}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                bgcolor: Colors.LOGOlight,
                                color: Colors.LOGOColor,
                                mr: 2,
                                "& svg": { fontSize: "1rem" },
                              }}
                            >
                              <CheckIcon />
                            </Avatar>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: Colors.darkText, 
                                pt: "2px",
                                fontSize: "0.95rem"
                              }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>

                    <Box sx={{ 
                      p: 3, 
                      bgcolor: "white", 
                      textAlign: "center",
                      borderTop: "1px solid rgba(38, 91, 95, 0.05)"
                    }}>
                      <Button
                        variant={plan.popular ? "contained" : "outlined"}
                        fullWidth
                        size="large"
                        onClick={() => handlePlanSelect(plan)}
                        disabled={plan.name.toLowerCase() !== "free"}
                        sx={{
                          fontWeight: FontWeight.heading1,
                          py: 1.5,
                          borderRadius: "12px",
                          fontSize: "1rem",
                          textTransform: "none",
                          letterSpacing: 0.5,
                          ...(plan.popular
                            ? {
                                bgcolor: Colors.LOGOlight,
                                color: Colors.LOGOColor,
                                "&:hover": {
                                  bgcolor: Colors.LOGOlight,
                                  opacity: 0.9
                                },
                              }
                            : {
                                borderColor: Colors.LOGOColor,
                                color: Colors.LOGOColor,
                                "&:hover": {
                                  bgcolor: "rgba(38, 91, 95, 0.05)",
                                  borderColor: Colors.LOGOColor,
                                },
                                "&.Mui-disabled": {
                                  borderColor: "rgba(0, 0, 0, 0.12)",
                                  color: "rgba(0, 0, 0, 0.26)"
                                }
                              }),
                        }}
                      >
                        {plan.name.toLowerCase() === "free" 
                          ? "Get Started" 
                          : plan.name.toLowerCase() === "enterprise" 
                            ? "Contact Us" 
                            : "Coming Soon"}
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
    </>
  );
};

export default PricingPlans;