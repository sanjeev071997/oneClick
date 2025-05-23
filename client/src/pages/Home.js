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
import CategoriesBanner from '../Components/CategoriesBanner'
import Gatik from './gatik.jpg'



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
  console.log(Gatik, "Gatik")
  const images = [
  
    {
      imageUrl:Gatik
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
    infinite: images?.length > 1, 
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
     <CategoriesBanner />
      <Footer />
    </>
  );
};

export default Home;
