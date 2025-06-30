import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  CircularProgress,
  Button,
  Typography,
  Alert as MuiAlert,
} from "@mui/material";
import { Business } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { State, City } from "country-state-city";
import { message } from "antd";
import dayjs from "dayjs";
import axios from "../../axiosInstance";
import Navbar from "../../Components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../../Components/Footer";
import { Colors } from "../../Comman";
import BusinessInfoStep from "../List/BusinessInfoStep";
import ContactDetailsStep from "../List/ContactDetailsStep";
import ImagesStep from "../List/ImagesStep";
import SocialMediaStep from "../List/SocialMediaStep";
import ReviewSubmitStep from "../List/ReviewSubmitStep";
import SuccessView from "../List/SuccessView";
import StepperHeader from "../List/StepperHeader";

const ListYourBusiness = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const { planName, planPrice, planId } = location.state || {};

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    service: [],
    address: "",
    state: "",
    city: "",
    category: "",
    description: "",
    images: [],
    businessExperience: "",
    openTime: null,
    closeTime: null,
  });

  const [links, setLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    website: "",
    youtube: "",
    whatsapp: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [showLoginAlert, setShowLoginAlert] = useState(!user);

  const steps = [
    "Business Information",
    "Contact Details",
    "Images",
    "Social Media",
    "Review & Submit",
  ];

  // Fetch categories and states on mount
  useEffect(() => {
    if (!user) {
      message.warning("You need to login to list your business");
      navigate("/login", { state: { from: location.pathname } });
    }
    fetchCategories();
    setStatesList(State.getStatesOfCountry("IN"));
  }, [user, navigate, location.pathname]);

  // Update cities when state changes
  useEffect(() => {
    if (formData.state) {
      const selectedState = statesList.find((s) => s.name === formData.state);
      if (selectedState) {
        setCitiesList(City.getCitiesOfState("IN", selectedState.isoCode));
      } else {
        setCitiesList([]);
      }
      setFormData((prev) => ({ ...prev, city: "" }));
    } else {
      setCitiesList([]);
    }
  }, [formData.state, statesList]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/v1/categories/get");
      const sorted = [...(res.data.getCategories || [])].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setCategories(sorted);
    } catch (error) {
      message.error("Failed to load business categories.");
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (
        !formData.businessName ||
        !formData.category ||
        formData.service.length === 0 
      ) {
        message.error(
          "Please fill in all required fields for Business Information."
        );
        return;
      }
    } else if (activeStep === 1) {
      if (
        !formData.ownerName ||
        !formData.phone ||
        !formData.email ||
        !formData.address ||
        !formData.state ||
        !formData.city ||
        !formData.businessExperience ||
        !formData.openTime ||
        !formData.closeTime
      ) {
        message.error(
          "Please fill in all required fields for Contact Details."
        );
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        message.error("Please enter a valid email address.");
        return;
      }
    } else if (activeStep === steps.length - 2) {
      if (!formData.images || formData.images.length === 0) {
        message.warning(
          "Are you sure you want to proceed without adding any business images?"
        );
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    // Validate all required fields before submission
    if (
      !formData.businessName ||
      !formData.ownerName ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.state ||
      !formData.city ||
      !formData.category ||
      formData.service.length === 0 ||
      !formData.businessExperience ||
      !formData.openTime ||
      !formData.closeTime
    ) {
      message.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((image) => data.append("images", image));
      } else if (key === "service") {
        value.forEach((item, index) => {
          data.append(`service[${index}]`, item);
        });
      } else if (value !== undefined && value !== null) {
        data.append(key, value);
      } else if (
        (key === "openTime" || key === "closeTime") &&
        dayjs.isDayjs(value)
      ) {
        data.append(key, value.format("HH:mm"));
      } else if (value !== undefined && value !== null) {
        data.append(key, value);
      }
    });

    data.append("userId", user?._id);
    data.append("planName", planName);
    data.append("planPrice", planPrice);
    data.append("planId", planId);
    data.append("socialLinks", JSON.stringify(links));

    try {
      const res = await axios.post("/api/v1/business/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res, "add business");

      if (res.data.success) {
        message.success("Your business has been successfully listed!");
        setSuccess(true);
        // Reset form data
        setFormData({
          businessName: "",
          ownerName: "",
          phone: "",
          email: "",
          service: [],
          address: "",
          state: "",
          city: "",
          category: "",
          description: "",
          images: [],
          businessExperience: "",
          openTime: null,
          closeTime: null,
        });
        setLinks({
          facebook: "",
          instagram: "",
          twitter: "",
          linkedin: "",
          website: "",
          youtube: "",
          whatsapp: "",
        });
        setCategoryInput("");
        setCitiesList([]);
      } else {
        message.error(res.data.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      message.error(
        error.response?.data?.message || "An error occurred during submission."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <SuccessView navigate={navigate} colors={Colors} />;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {showLoginAlert && (
          <MuiAlert
            severity="warning"
            sx={{
              mb: 3,
              backgroundColor: `${Colors.LOGOlight}20`,
              color: Colors.LOGOColor,
              border: `1px solid ${Colors.LOGOlight}`,
            }}
            onClose={() => setShowLoginAlert(false)}
          >
            You need to login to list your business
          </MuiAlert>
        )}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "#ffffff",
            boxShadow: `0px 10px 30px ${Colors.LOGOlight}10`,
            border: `1px solid ${Colors.LOGOlight}20`,
          }}
        >
          <Box textAlign="center" mb={5}>
            <Box
              sx={{
                width: 100,
                height: 100,
                backgroundColor: `${Colors.LOGOColor}10`,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
                boxShadow: `0 4px 20px 0 ${Colors.LOGOlight}20`,
              }}
            >
              <Business sx={{ fontSize: 50, color: Colors.LOGOColor }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ color: Colors.LOGOColor }}
            >
              List Your Business
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Join our community and showcase your business to thousands of
              potential customers
            </Typography>
          </Box>

          <StepperHeader
            steps={steps}
            activeStep={activeStep}
            colors={Colors}
          />

          <Box sx={{ mb: 4 }}>
            {activeStep === 0 && (
              <BusinessInfoStep
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                categoryInput={categoryInput}
                setCategoryInput={setCategoryInput}
                colors={Colors}
              />
            )}

            {activeStep === 1 && (
              <ContactDetailsStep
                formData={formData}
                setFormData={setFormData}
                statesList={statesList}
                citiesList={citiesList}
                colors={Colors}
              />
            )}
            {activeStep === 2 && (
              <ImagesStep
                formData={formData}
                setFormData={setFormData}
                colors={Colors}
              />
            )}

            {activeStep === 3 && (
              <SocialMediaStep
                links={links}
                setLinks={setLinks}
                colors={Colors}
              />
            )}

            {activeStep === 4 && (
              <ReviewSubmitStep
                formData={formData}
                links={links}
                categories={categories}
                categoryInput={categoryInput}
                planName={planName}
                planPrice={planPrice}
                colors={Colors}
              />
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                backgroundColor: Colors.LOGOlight,
                color: "white",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  backgroundColor: Colors.LOGOColor,
                },
                "&:disabled": {
                  backgroundColor: `${Colors.LOGOlight}50`,
                },
              }}
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : null
                }
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                  backgroundColor: Colors.LOGOlight,
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    backgroundColor: Colors.LOGOColor,
                  },
                  "&:disabled": {
                    backgroundColor: `${Colors.LOGOlight}50`,
                  },
                }}
              >
                {loading ? "Submitting..." : "Review & Submit"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                  backgroundColor: Colors.LOGOlight,
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    backgroundColor: Colors.LOGOColor,
                  },
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default ListYourBusiness;
