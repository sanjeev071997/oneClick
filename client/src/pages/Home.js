import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { Box, Container } from "@mui/material";
import { styled } from "@mui/system";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Categories from "../Components/Categories";
import CategorySection from '../Components/CategorySection'
import  TravelBookings from '../Components/ TravelBookings'
import Footer from '../Components/Footer';

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
  const images = [
    {
      imageUrl: "https://storage.googleapis.com/htlwebsite/Hinduja_Tech_Product_Engineering_Servces_Small_Banner_2x_100_3e928f1ff5/Hinduja_Tech_Product_Engineering_Servces_Small_Banner_2x_100_3e928f1ff5.jpg",
    },
    {
      imageUrl: "https://3.imimg.com/data3/SQ/DN/MY-16602737/banner-design-services.png",
    },
    {
      imageUrl: "https://img.freepik.com/free-vector/cleaning-service-horizontal-banner-template-design_23-2150808848.jpg",
    },
    {
      imageUrl: "https://png.pngtree.com/template/20220519/ourmid/pngtree-home-cleaning-service-banner-editable-of-square-background-suitable-for-social-image_1550879.jpg",
    },
  ];

  

  const settings = {
    dots: false,
    infinite: images?.length > 1, // infinite only if there are multiple images
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

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
              }}
            >
              <img
                src={url?.imageUrl}
                alt={`Slide ${index + 1}`}
                style={{ height: "100%", width: "100%", }}
              />
            </BannerImage>
          ))}
        </Slider>
      </BannerContainer>

     <Categories /> 
     <CategorySection/>
     <TravelBookings />
      <Footer />
    </>
  );
};

export default Home;
