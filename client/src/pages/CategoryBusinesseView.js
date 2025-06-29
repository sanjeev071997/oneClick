import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import axios from "../axiosInstance";
import { useSelector } from "react-redux";
import { message } from "antd";
import Footer from "../Components/Footer";
import BusinessTabs from "../Components/Business/BusinessTabs";
import BusinessHeader from "../Components/Business/BusinessHeader";
import BusinessOverview from "../Components/Business/BusinessOverview";
import BusinessServices from "../Components/Business/BusinessServices";
import BusinessProducts from "../Components/Business/BusinessProducts";
import BusinessMedia from "../Components/Business/BusinessMedia";
import BusinessReviews from "../Components/Business/BusinessReviews";
import BusinessContact from "../Components/Business/BusinessContact";

const CategoryBusinessView = () => {
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const [business, setBusiness] = useState("");
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const res = await axios.get(`/api/v1/business/get/${id}`);
        setBusiness(res.data.getBusiness);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    if (id) {
      fetchDataById();
    }
  }, [id]);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          totalReviews
        ).toFixed(1)
      : 0;

  const getReview = async () => {
    if (!business?._id) return;
    try {
      const response = await axios.post("/api/v1/review/get", {
        businessId: business._id,
      });
      if (response.data.success === true) {
        setReviews(response.data.data);
      } else {
        message.error("Failed to load reviews.");
      }
    } catch (error) {
      message.error("An error occurred while fetching reviews.");
    }
  };

  useEffect(() => {
    getReview();
  }, [business]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          maxWidth: 1300,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        {/* Header Section */}
        <BusinessHeader
          business={business}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />

        {/* Business Info Tabs */}
        <Box sx={{ mb: 4 }}>
          <BusinessTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            totalReviews={totalReviews}
          />

          {activeTab === "overview" && <BusinessOverview business={business} />}

          {activeTab === "services" && <BusinessServices business={business} />}

          {activeTab === "products" && <BusinessProducts business={business} />}

          {activeTab === "media" && <BusinessMedia business={business} />}

          {activeTab === "reviews" && (
            <BusinessReviews
              business={business}
              user={user}
              reviews={reviews}
              getReview={getReview}
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          )}

          {activeTab === "contact" && <BusinessContact business={business} />}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default CategoryBusinessView;
