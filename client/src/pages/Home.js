import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { Box, Container } from "@mui/material";
import { styled } from "@mui/system";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Categories from "../Components/Categories";
import CategorySection from "../Components/CategorySection";
import TravelBookings from "../Components/TravelBookings";
import Footer from "../Components/Footer";
import CategoriesBanner from "../Components/CategoriesBanner";
import axios from "../axiosInstance";

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

const Home = () => {
  const [images, setImages] = useState([]);

  const settings = {
    dots: false,
    infinite: images?.length > 1, // infinite only if there are multiple images
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("/api/v1/homebanner/get");
        setImages(res.data.newHomeBanner || []);
      } catch (error) {
        console.error("Failed to fetch banners", error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <>
      <Navbar />
      
      <BannerContainer>
        <Slider {...settings}>
          {images?.map((url, index) => (
            <BannerImage
              key={index}
              sx={{
                height: {
                  xs: "200px",
                  sm: "200px",
                  md: "400px",
                  lg: "500px",
                },
                width: "100%",
              }}
            >
              <img
                src={url?.imageUrl}
                alt={`Slide ${index + 1}`}
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </BannerImage>
          ))}
        </Slider>
      </BannerContainer>

      <Categories />
      <CategorySection />
      <TravelBookings />
      <CategoriesBanner />
      <Footer />
    </>
  );
};

export default Home;
