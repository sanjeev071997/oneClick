import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { styled } from "@mui/system";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerContainer = styled(Box)({
  position: "relative",
  overflow: "hidden",
  width: "100%",
});

const BannerImage = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#000",
});

const ViewBusiness = ({ businessData }) => {
  const settings = {
    dots: true,
    infinite: businessData?.images?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Container>
      {/* Banner Slider */}
      <BannerContainer>
        <Slider {...settings}>
          {businessData?.images?.map((img, index) => (
            <BannerImage key={index} sx={{ height: "300px" , borderRadius: "8px"}}>
              <img
                src={img?.url}
                alt={`Slide ${index + 1}`}
                style={{ height: "100%", width: "100%", borderRadius: "8px" }}
              />
            </BannerImage>
          ))}
        </Slider>
      </BannerContainer>

      {/* Basic Business Info */}
      <Card sx={{ my: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#2C3E50",
              letterSpacing: "2.5px",
              lineHeight: 1.8,
            }}
          >
            Business Details
          </Typography>
          <Typography
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontFamily: "Poppins, sans-serif",
              color: "#2C3E50",
              letterSpacing: "2.5px",
              lineHeight: 1.8,
              fontSize: "1.2rem",
            }}
          >
            {businessData?.businessName || "Business Name N/A"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#2C3E50",
              letterSpacing: "1.5px",
              lineHeight: 1.8,
            }}
          >
            <strong>Owner:</strong> {businessData?.ownerName || "N/A"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#2C3E50",
              letterSpacing: "1.5px",
              lineHeight: 1.8,
            }}
          >
            <strong>Category:</strong> {businessData?.category?.name || "N/A"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#2C3E50",
              letterSpacing: "1.5px",
              lineHeight: 1.8,
            }}
          >
            <strong>Phone:</strong> {businessData?.phone || "N/A"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#2C3E50",
              letterSpacing: "1.5px",
              lineHeight: 1.8,
            }}
          >
            <strong>Email:</strong> {businessData?.email || "N/A"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#2C3E50",
              letterSpacing: "1.5px",
              lineHeight: 1.8,
            }}
          >
            <strong>Description:</strong> {businessData?.description || "N/A"}
          </Typography>
        </CardContent>
      </Card>

      {/* Location Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#2C3E50",
              letterSpacing: "2.5px",
              lineHeight: 1.8,
            }}
          >
            <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1, color:"#1976d2" }} />
            Location Details
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "#2C3E50",
              letterSpacing: "1.5px",
              lineHeight: 1.8,
            }}
          >
            <strong>Address:</strong> {businessData?.address || "N/A"}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ViewBusiness;
