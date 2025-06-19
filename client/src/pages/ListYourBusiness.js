import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  InputAdornment,
  MenuItem,
  Box,
  CircularProgress,
  Card,
  CardMedia,
  IconButton,
  Autocomplete,
  Avatar,
  Chip,
  Link,
  Stack,
} from "@mui/material";
import {
  PhotoCamera,
  Business,
  Person,
  Phone,
  Email,
  Home,
  Description,
  Close,
  Search,
  Add,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Language,
  YouTube,
  WhatsApp,
} from "@mui/icons-material";
import axios from "../axiosInstance";
import Navbar from "../Components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../Components/Footer";
import { State, City } from "country-state-city";
import { message } from "antd";
import QRCode from "react-qr-code";
import { useLocation, useNavigate } from "react-router-dom";
import { Colors, FontWeight } from "../Comman";

const ListYourBusiness = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    city: "",
    category: "",
    description: "",
    images: [],
  });
  const location = useLocation();
  const { planName, planPrice, planId } = location.state || {};
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const states = State.getStatesOfCountry("IN");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    website: "",
    youtube: "",
    whatsapp: "",
  });

  const handleChangeLinks = (e) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  // const steps = ["Business Information", "Contact Details", "Media & Description", "Review & Submit", "Payment"];

  const steps = [
    "Business Information",
    "Contact Details",
    "Images",
    "Social Media",
    "Review & Submit",
  ];

  const socialPlatforms = [
    { name: "facebook", icon: <Facebook />, color: "#1877F2" },
    { name: "instagram", icon: <Instagram />, color: "#E4405F" },
    { name: "twitter", icon: <Twitter />, color: "#1DA1F2" },
    { name: "linkedin", icon: <LinkedIn />, color: "#0A66C2" },
    { name: "website", icon: <Language />, color: "#1976d2" },
    { name: "youtube", icon: <YouTube />, color: "#FF0000" },
    { name: "whatsapp", icon: <WhatsApp />, color: "#25D366" },
  ];

  // Fetch categories from the server
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/v1/categories/get");
      const sorted = [...(res.data.getCategories || [])].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setCategories(sorted);
    } catch (error) {
      message.error("Failed to load business categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    setStatesList(states);
  }, []);

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

  const handleNext = () => {
    if (activeStep === 0) {
      if (
        !formData.businessName ||
        !formData.state ||
        !formData.city ||
        !formData.category ||
        !formData.description
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
        !formData.address
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const currentImagesCount = formData.images.length;
    const filesToAdd = files.slice(0, 5 - currentImagesCount);

    if (files.length > filesToAdd.length) {
      message.warn(
        `You can only upload a maximum of 5 images. ${
          files.length - filesToAdd.length
        } image(s) were not added.`
      );
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...filesToAdd],
    }));
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleCategorySelect = (event, value) => {
    if (value) {
      const selectedCategory = categories.find((cat) => cat.name === value);
      if (selectedCategory) {
        setFormData((prev) => ({
          ...prev,
          category: selectedCategory._id,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          category: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        category: "",
      }));
    }
    setCategoryInput(value || "");
  };

  // const handleSubmit = async () => {
  //   setLoading(true);

  //   const data = new FormData();
  //   Object.entries(formData).forEach(([key, value]) => {
  //     if (key === "images") {
  //       value.forEach(image => data.append("images", image));
  //     } else if (value !== undefined && value !== null) {
  //       data.append(key, value);
  //     }
  //   });
  //   data.append("userId", user?._id);
  //   data.append("planName", planName);
  //   data.append("planPrice", planPrice);
  //   data.append("planId", planId);
  //   data.append("socialLinks", JSON.stringify(links));

  //   try {
  //     const res = await axios.post("/api/v1/business/add", data, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (res.data.success) {
  //       message.success("Your business has been successfully listed!");
  //       setSuccess(true);
  //       setFormData({
  //         businessName: "",
  //         ownerName: "",
  //         phone: "",
  //         email: "",
  //         address: "",
  //         state: "",
  //         city: "",
  //         category: "",
  //         description: "",
  //         images: []
  //       });
  //       setCategoryInput("");
  //       setCitiesList([]);
  //     } else {
  //       message.error(res.data.message || "Submission failed.");
  //     }

  //   } catch (error) {
  //     console.error("Submission error:", error);
  //     message.error(error.response?.data?.message || "An error occurred during submission.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    setLoading(true);

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((image) => data.append("images", image));
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

      if (res.data.success) {
        message.success("Your business has been successfully listed!");
        setSuccess(true);
        setFormData({
          businessName: "",
          ownerName: "",
          phone: "",
          email: "",
          address: "",
          state: "",
          city: "",
          category: "",
          description: "",
          images: [],
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

  const getStepContent = (step) => {
    const textFieldSx = {
      mb: 3,
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: Colors.BLACK,
        },
        "&:hover fieldset": {
          borderColor: Colors.BLACK,
        },
        "&.Mui-focused fieldset": {
          borderColor: Colors.LOGOlight,
        },
      },
      "& .MuiInputLabel-root": {
        color: Colors.BLACK,
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: Colors.LOGOlight,
      },
      "& .MuiInputBase-input": {
        color: "#000000",
      },
    };

    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business sx={{ color: Colors.LOGOColor }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                required
                label="Select State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  ...textFieldSx,
                  minWidth: 280,
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        width: 300,
                      },
                    },
                  },
                }}
              >
                {statesList.map((state) => (
                  <MenuItem
                    key={state.isoCode}
                    value={state.name}
                    sx={{ color: Colors.LOGOColor }}
                  >
                    {state.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {formData.state && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Select City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    ...textFieldSx,
                    minWidth: 280,
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          width: 300,
                        },
                      },
                    },
                  }}
                  disabled={citiesList.length === 0}
                >
                  {citiesList.length > 0 ? (
                    citiesList.map((city) => (
                      <MenuItem
                        key={city.name}
                        value={city.name}
                        sx={{ color: Colors.LOGOColor }}
                      >
                        {city.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem
                      value=""
                      disabled
                      sx={{ color: Colors.LOGOlight }}
                    >
                      No cities available for this state
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={categories.map((category) => category.name)}
                inputValue={categoryInput}
                onInputChange={(event, newInputValue) => {
                  setCategoryInput(newInputValue);
                }}
                onChange={handleCategorySelect}
                value={categoryInput}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Business Category"
                    required
                    placeholder="Search or type a new category"
                    variant="outlined"
                    sx={textFieldSx}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: Colors.LOGOColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <MenuItem
                    {...props}
                    key={option}
                    sx={{ color: Colors.LOGOColor }}
                  >
                    {option}
                  </MenuItem>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: -7 }}>
                      <Description sx={{ color: Colors.LOGOColor }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            {[
              { label: "Owner Name", name: "ownerName", icon: <Person /> },
              {
                label: "Phone Number",
                name: "phone",
                icon: <Phone />,
                type: "tel",
                helperText: "Please include the country code, e.g. +91XXXXXXXXXX",
              },
              { label: "Email", name: "email", icon: <Email />, type: "email" },
              {
                label: "Business Address",
                name: "address",
                icon: <Home />,
                multiline: true,
                rows: 2,
              },
            ].map((field, i) => (
              <Grid item xs={12} key={i}>
                <TextField
                  fullWidth
                  required={field.name !== "email"}
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name]}
                  onChange={handleChange}
                  variant="outlined"
                  multiline={field.multiline}
                  rows={field.rows}
                  helperText={field.helperText || ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {React.cloneElement(field.icon, {
                          sx: { color: Colors.LOGOColor },
                        })}
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />
              </Grid>
            ))}
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: `2px dashed ${Colors.LOGOColor}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  backgroundColor: `${Colors.LOGOColor}10`,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: `${Colors.LOGOColor}20`,
                  },
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="business-images"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <label htmlFor="business-images">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${Colors.LOGOColor}20`,
                        width: 60,
                        height: 60,
                        mb: 2,
                      }}
                    >
                      <PhotoCamera
                        sx={{ fontSize: 30, color: Colors.LOGOColor }}
                      />
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      Upload Business Images
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Drag & drop images here or click to browse (Max 5 images)
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{
                        color: Colors.WHITE,
                        borderColor: Colors.LOGOlight,
                      }}
                      startIcon={<Add />}
                      component="span"
                      disabled={formData.images.length >= 5}
                    >
                      Select Images
                    </Button>
                  </Box>
                </label>
              </Box>

              {formData.images.length > 0 && (
                <Box mt={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Images ({formData.images.length}/5)
                  </Typography>
                  <Grid container spacing={2}>
                    {formData.images.map((img, idx) => (
                      <Grid item xs={6} sm={4} md={3} key={idx}>
                        <Card sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={URL.createObjectURL(img)}
                            alt={img.name}
                            sx={{ objectFit: "cover" }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(idx)}
                            sx={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.7)",
                              },
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box sx={{ mx: "auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Social Media Links
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {[
                  {
                    label: "Instagram",
                    name: "instagram",
                    icon: <Instagram />,
                  },
                  { label: "Facebook", name: "facebook", icon: <Facebook /> },
                  { label: "WhatsApp", name: "whatsapp", icon: <WhatsApp /> },
                  { label: "LinkedIn", name: "linkedin", icon: <LinkedIn /> },
                  { label: "Twitter", name: "twitter", icon: <Twitter /> },
                  { label: "YouTube", name: "youtube", icon: <YouTube /> },
                  { label: "Website", name: "website", icon: <Language /> },
                ].map((field, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type="url"
                      value={formData[field.name]}
                      onChange={handleChangeLinks}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {React.cloneElement(field.icon, {
                              sx: { color: Colors.LOGOColor },
                            })}
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldSx}
                      placeholder={`https://${field.name}.com/your-profile`}
                    />
                  </Grid>
                ))}
              </Grid>
            </form>
          </Box>
        );
      case 4:
        return (
          <Box
            sx={{ p: 3, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 2 }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ mb: 3, display: "flex", alignItems: "center" }}
            >
              <CheckCircle sx={{ color: Colors.LOGOColor, mr: 1 }} /> Review
              Your Business Information
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: 900 }}
              >
                Plan Name:
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: Colors.LOGOColor, mr: 2, fontWeight: 700 }}
              >
                {planName}
              </Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: 900 }}
              >
                Plan Price:
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: Colors.LOGOColor, fontWeight: 700 }}
              >
                {planPrice}
              </Typography>
            </Box>

            <Grid container spacing={3} mt={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Business Name
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: Colors.LOGOColor }}
                >
                  {formData.businessName}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: Colors.LOGOColor }}
                >
                  {formData.city ? `${formData.city}, ` : ""}
                  {formData.state}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: Colors.LOGOColor }}
                >
                  {categories.find((c) => c._id === formData.category)?.name ||
                    categoryInput ||
                    "N/A"}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: Colors.LOGOColor }}
                >
                  {formData.description || "Not provided"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={<Person sx={{ color: Colors.LOGOColor }} />}
                    label={formData.ownerName}
                    sx={{
                      mr: 1,
                      mb: 1,
                      color: Colors.LOGOColor,
                      borderColor: Colors.LOGOlight,
                    }}
                    variant="outlined"
                  />
                  <Chip
                    icon={<Phone sx={{ color: Colors.LOGOColor }} />}
                    label={formData.phone}
                    sx={{
                      mr: 1,
                      mb: 1,
                      color: Colors.LOGOColor,
                      borderColor: Colors.LOGOlight,
                    }}
                    variant="outlined"
                  />
                  {formData.email && (
                    <Chip
                      icon={<Email sx={{ color: Colors.LOGOColor }} />}
                      label={formData.email}
                      sx={{
                        mb: 1,
                        color: Colors.LOGOColor,
                        borderColor: Colors.LOGOlight,
                      }}
                      variant="outlined"
                    />
                  )}
                </Box>

                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: Colors.LOGOColor }}
                >
                  {formData.address}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Social Media Links
                  </Typography>

                  <Stack spacing={1}>
                    {socialPlatforms.map(({ name, icon, color }) => {
                      const url = links[name];
                      if (!url) return null;

                      return (
                        <Box
                          key={name}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box sx={{ color }}>{icon}</Box>
                          <Link
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ color: "primary.main", fontSize: "16px" }}
                          >
                            {url}
                          </Link>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>

                <Typography variant="subtitle2" color="text.secondary">
                  Images
                </Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                  {formData.images && formData.images.length > 0 ? (
                    formData.images.map((img, index) => (
                      <img
                        key={index}
                        src={
                          typeof img === "string"
                            ? img
                            : URL.createObjectURL(img)
                        }
                        alt={`Uploaded ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: `1px solid ${Colors.LOGOlight}`,
                        }}
                      />
                    ))
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{ color: Colors.LOGOlight }}
                    >
                      No images uploaded
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      // case 5:
      //   return (
      //     <Box sx={{
      //       p: 3,
      //       border: '1px solid rgba(0,0,0,0.12)',
      //       borderRadius: 2,
      //       textAlign: 'center'
      //     }}>
      //       <Typography variant="h5" gutterBottom sx={{ mb: 3, color: Colors.LOGOColor }}>
      //         Complete Your Payment
      //       </Typography>

      //       <Box sx={{
      //         backgroundColor: '#f5f5f5',
      //         p: 3,
      //         borderRadius: 2,
      //         mb: 3,
      //         display: 'inline-block'
      //       }}>
      //         <Typography variant="h6" sx={{ mb: 2 }}>
      //           Plan: <strong>{planName || "Growth"}</strong>
      //         </Typography>
      //         <Typography variant="h4" sx={{ mb: 3, color: Colors.LOGOColor }}>
      //           Price: <strong>${planPrice || "299"}</strong>
      //         </Typography>

      //         <Box sx={{
      //           p: 2,
      //           backgroundColor: 'white',
      //           borderRadius: 1,
      //           display: 'inline-block',
      //           mb: 3
      //         }}>
      //           <QRCode
      //             value={`Payment for ${planName || "Growth"} plan - $${planPrice || "299"}`}
      //             size={128}
      //             bgColor="#ffffff"
      //             fgColor="#000000"
      //             level="L"
      //           />
      //         </Box>

      //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      //           Scan the QR code to complete payment
      //         </Typography>
      //       </Box>

      //       <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
      //         Your business listing will be activated once payment is confirmed.
      //       </Typography>
      //     </Box>
      //   );
      default:
        return "Unknown step";
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
          <Paper elevation={3} sx={{ p: 6, borderRadius: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  bgcolor: Colors.LOGOColor,
                  width: 80,
                  height: 80,
                  mx: "auto",
                }}
              >
                <CheckCircle sx={{ fontSize: 50, color: Colors.WHITE }} />
              </Avatar>
            </Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#2d2d2d" }}
            >
              Congratulations!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Your business has been successfully listed.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                navigate("/plans");
              }}
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                backgroundColor: Colors.LOGOlight,
              }}
            >
              List Another Business
            </Button>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "#ffffff",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
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
              }}
            >
              <Business sx={{ fontSize: 50, color: Colors.LOGOColor }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#2d2d2d" }}
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

          <Box sx={{ width: "100%", mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              {steps.map((label, index) => (
                <React.Fragment key={label}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor:
                          activeStep >= index
                            ? Colors.LOGOColor
                            : "rgba(0, 0, 0, 0.12)",
                        color:
                          activeStep >= index
                            ? Colors.WHITE
                            : "rgba(0, 0, 0, 0.5)",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        fontWeight: activeStep === index ? "bold" : "normal",
                        color:
                          activeStep >= index
                            ? Colors.LOGOColor
                            : "text.secondary",
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                  {index !== steps.length - 1 && (
                    <Box
                      sx={{
                        width: 50,
                        height: 2,
                        bgcolor:
                          activeStep > index
                            ? Colors.LOGOColor
                            : "rgba(0, 0, 0, 0.12)",
                        alignSelf: "center",
                        mx: 1,
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>{getStepContent(activeStep)}</Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
