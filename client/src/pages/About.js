import React from "react";
import { Grid, Typography, Box, Container, useTheme, useMediaQuery } from "@mui/material";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { styled } from "@mui/system";

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "inline-block",
}));

const StyledImage = styled("img")(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: theme.shadows[4],
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const AboutUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: theme.palette.background.paper }}>
        {/* Hero Section */}
        <SectionContainer>
          <Container maxWidth="lg">
            <Grid container alignItems="center" spacing={6}>
              <Grid item xs={12} md={6}>
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  <GradientText>Our Story</GradientText> Begins Here
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  HubSpot's company and culture are crafted, not cobbled, for a delightful experience.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Founded in 2006, we've grown from a simple idea to a global platform helping millions of businesses grow better.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledImage
                  src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=1050&q=80"
                  alt="Team collaboration"
                  width="100%"
                />
              </Grid>
            </Grid>
          </Container>
        </SectionContainer>

        {/* Mission Section */}
        <SectionContainer sx={{ backgroundColor: theme.palette.grey[50] }}>
          <Container maxWidth="lg">
            <Grid container alignItems="center" spacing={6} direction={isMobile ? "column-reverse" : "row"}>
              <Grid item xs={12} md={6}>
                <StyledImage
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1050&q=80"
                  alt="Diverse team"
                  width="100%"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                  Our <GradientText>Mission</GradientText>
                </Typography>
                <Typography variant="h6" color="primary" paragraph>
                  Helping Millions of Organizations Grow Better
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We believe not just in growing bigger, but in growing better. Growing better means aligning the success of your business with the success of your customers.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our platform is designed to create win-win scenarios where businesses and their customers thrive together.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </SectionContainer>

        {/* History Section */}
        <SectionContainer>
          <Container maxWidth="lg">
            <Grid container alignItems="center" spacing={6}>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                  Our <GradientText>Journey</GradientText>
                </Typography>
                <Box sx={{ 
                  position: "relative",
                  pl: 3,
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: "2px",
                  }
                }}>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    In 2004, fellow MIT graduate students Brian Halligan and Dharmesh Shah noticed a major shift in consumer behavior. Buyers no longer responded to interruptive ads—they wanted helpful information.
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    In 2006, they founded HubSpot to help companies shift from interruptive marketing to inbound marketing.
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Today, led by CEO Yamini Rangan, HubSpot serves millions of customers worldwide with our AI-powered Smart CRM platform.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledImage
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1050&q=80"
                  alt="Founders"
                  width="100%"
                />
              </Grid>
            </Grid>
          </Container>
        </SectionContainer>

        
         
       
      </Box>
      <Footer />
    </>
  );
};

export default AboutUs;