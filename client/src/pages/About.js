import React from "react";
import { Grid, Typography, Box, Container, useTheme, useMediaQuery } from "@mui/material";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { styled } from "@mui/system";
import { Colors, FontWeight, FontFamily } from "../Comman"

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${Colors.LOGOColor} 60%, ${Colors.LOGOlight} 90%)`,
  WebkitBackgroundClip: "text",
  fontWeight: FontWeight.heading2,
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
                <Typography variant="h2" gutterBottom sx={{ fontWeight: FontWeight.heading1, fontFamily: FontFamily.inriaSerif, color: Colors.LOGOColor }}>
                  <GradientText>Our Story</GradientText> Begins Here
                </Typography>
                <Typography variant="h6" paragraph sx={{ fontWeight: FontWeight.heading1, fontFamily: FontFamily.inriaSerif, color: Colors.LOGOColor }}>
                  QuickDials was born from a simple idea — to bridge the gap between small businesses and the customers searching for them. In a world where visibility is everything, we built a platform that empowers local vendors, startups, and entrepreneurs to showcase their services, get discovered, and thrive.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: Colors.LOGOColor,
                    fontFamily: FontFamily.inriaSerif,
                  }}
                >
                  Whether you're just starting out or looking to scale, QuickDials offers the tools, reach, and community to help your business grow faster and smarter.
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
                <Typography variant="h4" gutterBottom sx={{ fontWeight: FontWeight.heading1, fontFamily: FontFamily.inriaSerif, color: Colors.LOGOColor }}>
                  Our <GradientText>Mission</GradientText>
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: FontWeight.heading1, fontFamily: FontFamily.inriaSerif, color: Colors.LOGOColor }}>
                  Empowering Local Businesses to Be Seen, Heard, and Chosen
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: FontWeight.heading1, fontFamily: FontFamily.inriaSerif, color: Colors.LOGOColor }}>
                  At QuickDials, our mission is to provide every business — big or small — the digital visibility they deserve. We believe growth starts with being discovered.
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: FontWeight.heading1, fontFamily: FontFamily.inriaSerif, color: Colors.LOGOColor }}>
                  Our platform connects businesses with real customers through quality leads, allowing them to thrive in a competitive digital world without needing technical expertise.
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
                <Typography variant="h4" gutterBottom sx={{ fontWeight: FontWeight.heading1, fontFamily: FontFamily.inriaSerif, color: Colors.LOGOColor }}>
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
                    background: `linear-gradient(to bottom, ${Colors.LOGOColor}, ${Colors.LOGOlight})`,
                    borderRadius: "2px",
                  }
                }}>
                  <Typography variant="body1" sx={{ fontWeight: FontWeight.heading1, fontFamily: FontFamily.inriaSerif, color: Colors.LOGOColor }}>
                    At QuickDials, we saw a growing challenge — small and local businesses struggling to be found in the crowded digital space.
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: FontWeight.heading1, fontFamily: FontFamily.inriaSerif, color: Colors.LOGOColor }}>
                    We envisioned a platform where visibility doesn't depend on big budgets, but on simplicity, accessibility, and performance.
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: FontWeight.heading1, fontFamily: FontFamily.inriaSerif, color: Colors.LOGOColor }}>
                    Today, QuickDials is building a platform to empower local businesses by helping them get discovered and connect with potential customers — simply, quickly, and effectively.
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