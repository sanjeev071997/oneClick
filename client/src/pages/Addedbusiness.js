import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Paper,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tabs,
  Tab,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Edit,
  AddPhotoAlternate,
  Close,
  Phone,
  Email,
  LocationOn,
  Star,
  AddBusiness,
  Image,
  Search,
  Facebook,
  Instagram,
  Twitter,
  WhatsApp,
  Link as LinkIcon,
  YouTube,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";
import axios from "../axiosInstance";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Colors, FontSize } from "../Comman";
import { State, City } from "country-state-city";

const AddedBusiness = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    description: "",
    images: [],
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      whatsapp: "",
      website: "",
      youtube: "",
    },
  });
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch businesses
  const fetchBusinesses = async () => {
    try {
      const res = await axios.get("/api/v1/business/get", {
        userId: user._id,
      });
      setBusinesses(res.data.data);
      setFilteredBusinesses(res.data.data);
    } catch (error) {
      message.error("Failed to fetch businesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchBusinesses();
    // Load Indian states (country code: IN)
    setStates(State.getStatesOfCountry("IN"));
  }, [user]);

  // When state changes, load cities for that state
  useEffect(() => {
    if (formData.state) {
      setCities(City.getCitiesOfState("IN", formData.state));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  // Filter businesses based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter((business) =>
        business.businessName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBusinesses(filtered);
    }
  }, [searchTerm, businesses]);

  // Handle dialog operations
  const handleOpenDialog = (type, business = null) => {
    setDialogType(type);
    setSelectedBusiness(business);
    if (type === "edit" && business) {
      setFormData({
        businessName: business?.businessName,
        phone: business.phone,
        email: business.email,
        address: business.address,
        city: business.city,
        state: business.state,
        description: business.description,
        images: business.images || [],
        socialLinks: {
          facebook: business.socialLinks?.facebook || "",
          instagram: business.socialLinks?.instagram || "",
          twitter: business.socialLinks?.twitter || "",
          whatsapp: business.socialLinks?.whatsapp || "",
          website: business.socialLinks?.website || "",
          youtube: business.socialLinks?.youtube || "",
        },
      });
      setDeletedImages([]);
      setNewImages([]);
    } else {
      setFormData({
        businessName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        description: "",
        images: [],
        socialLinks: {
          facebook: "",
          instagram: "",
          twitter: "",
          whatsapp: "",
          website: "",
          youtube: "",
        },
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewImages([]);
    setActiveTab(0);
  };

  // Handle form changes, now handling nested socialLinks
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const socialFieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialFieldName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(
      0,
      5 - formData.images.length + deletedImages.length - newImages.length
    );
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));
    setNewImages((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (imageId, isNew) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((img) => img.url !== imageId));
    } else {
      setDeletedImages((prev) => [...prev, imageId]);
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img._id !== imageId),
      }));
    }
  };

  // Handle business update
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("businessName", formData.businessName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("id", selectedBusiness._id);
      // Append social media links
      formDataToSend.append("facebook", formData.socialLinks.facebook);
      formDataToSend.append("instagram", formData.socialLinks.instagram);
      formDataToSend.append("twitter", formData.socialLinks.twitter);
      formDataToSend.append("whatsapp", formData.socialLinks.whatsapp);
      formDataToSend.append("website", formData.socialLinks.website);
      formDataToSend.append("youtube", formData.socialLinks.youtube);

      // Append new images
      newImages.forEach((img) => {
        formDataToSend.append("images", img.file);
      });

      // Append deleted image IDs
      deletedImages.forEach((id) => {
        formDataToSend.append("deletedImages", id);
      });

      const res = await axios.put("/api/v1/business/update", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        message.success("Business updated successfully");
        fetchBusinesses();
        handleCloseDialog();
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update business"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !businesses.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          {/* Business Heading */}
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "2rem",
              color: Colors.LOGOColor,
              fontWeight: 700,
              display: "inline-block",
              position: "relative",
              pb: 1,
              alignSelf: { xs: "center", sm: "flex-start" },
            }}
          >
            Business
            <Box
              sx={{
                content: '""',
                width: 60,
                height: 3,
                bgcolor: Colors.LOGOColor,
                margin: "8px auto 0",
                borderRadius: 2,
              }}
            />
          </Typography>

          {/* Search Bar */}
          <TextField
            placeholder="Search by business name..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: Colors.LOGOColor }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: 1,
                "& fieldset": { border: "none" },
              },
            }}
            sx={{
              width: { xs: "100%", sm: "450px" },
              maxWidth: "100%",
            }}
            variant="outlined"
          />
        </Box>

        {filteredBusinesses.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              background: "linear-gradient(145deg, #f0f0f0, #e0e0e0)",
              boxShadow:
                "5px 5px 15px rgba(0,0,0,0.1), -5px -5px 15px rgba(255,255,255,0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
            }}
          >
            {searchTerm ? (
              <>
                <Search sx={{ fontSize: 80, color: Colors.LOGOColor, mb: 2 }} />
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  No businesses found
                </Typography>
                <Typography
                  color="text.secondary"
                  mb={4}
                  sx={{ maxWidth: "400px" }}
                >
                  It looks like there are no businesses matching your search for
                  " **{searchTerm}** ". Try a different name or clear the
                  search.
                </Typography>
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="contained"
                  size="large"
                  sx={{
                    px: 5,
                    borderRadius: 2,
                    bgcolor: Colors.LOGOColor,
                    "&:hover": { bgcolor: Colors.LOGOlight },
                    color: "#fff",
                  }}
                >
                  Clear search
                </Button>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: Colors.LOGOColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                    boxShadow:
                      "inset 4px 4px 8px rgba(0,0,0,0.2), inset -4px -4px 8px rgba(255,255,255,0.8)",
                  }}
                >
                  <AddBusiness sx={{ fontSize: 60, color: "#ffffff" }} />
                </Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  No Businesses Listed Yet
                </Typography>
                <Typography
                  color="text.secondary"
                  mb={4}
                  sx={{ maxWidth: "500px" }}
                >
                  It's quiet in here! Get started by adding your first business
                  to showcase your services and attract new customers.
                </Typography>
                <Button
                  onClick={() => navigate("/plans")}
                  variant="contained"
                  size="large"
                  sx={{
                    px: 5,
                    borderRadius: 2,
                    color: "#ffffff",
                    backgroundColor: Colors.LOGOColor,
                    "&:hover": { backgroundColor: Colors.LOGOlight },
                  }}
                  startIcon={<AddBusiness />}
                >
                  Create Your First Listing
                </Button>
              </>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredBusinesses.map((business) => (
              <Grid item xs={12} sm={6} lg={4} key={business._id}>
                <Card
                  sx={{
                    mt: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 3,
                    },
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        business.images?.[0]?.url || "/placeholder-business.jpg"
                      }
                      alt={business.businessName}
                      sx={{ objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        bgcolor: Colors.LOGOlight,
                        color: "white",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.85rem",
                      }}
                    >
                      <Star fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                        {Number(business?.rating || 0).toFixed(1)} (
                        {business?.ratingCount || 0})
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {business.businessName}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1.5}>
                      <LocationOn
                        fontSize="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {business.address}, {business.city}, {business.state}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={1.5}>
                      <Phone
                        fontSize="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {business.phone}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={2}>
                      <Email
                        fontSize="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {business.email}
                      </Typography>
                    </Box>

                    {/* Social Media Links - Adjusted to access socialLinks object */}
                    <Box display="flex" mb={2} flexWrap="wrap" gap={1}>
                      {business.socialLinks?.facebook && (
                        <Button
                          size="small"
                          startIcon={<Facebook />}
                          href={business.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: Colors.LOGOlight,
                            borderColor: Colors.LOGOColor,
                            "&:hover": {
                              bgcolor: Colors.LOGOlight,
                              color: "#fff",
                            },
                          }}
                        >
                          Facebook
                        </Button>
                      )}
                      {business.socialLinks?.instagram && (
                        <Button
                          size="small"
                          startIcon={<Instagram />}
                          href={business.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: Colors.LOGOlight,
                            borderColor: Colors.LOGOColor,
                            "&:hover": {
                              bgcolor: Colors.LOGOlight,
                              color: "#fff",
                            },
                          }}
                        >
                          Instagram
                        </Button>
                      )}
                      {business.socialLinks?.twitter && (
                        <Button
                          size="small"
                          startIcon={<Twitter />}
                          href={business.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: Colors.LOGOlight,
                            borderColor: Colors.LOGOColor,
                            "&:hover": {
                              bgcolor: Colors.LOGOlight,
                              color: "#fff",
                            },
                          }}
                        >
                          Twitter
                        </Button>
                      )}
                      {business.socialLinks?.whatsapp && (
                        <Button
                          size="small"
                          startIcon={<WhatsApp />}
                          href={`https://wa.me/${business.socialLinks.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: Colors.LOGOlight,
                            borderColor: Colors.LOGOColor,
                            "&:hover": {
                              bgcolor: Colors.LOGOlight,
                              color: "#fff",
                            },
                          }}
                        >
                          WhatsApp
                        </Button>
                      )}
                      {business.socialLinks?.website && (
                        <Button
                          size="small"
                          startIcon={<LinkIcon />}
                          href={business.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: Colors.LOGOlight,
                            borderColor: Colors.LOGOColor,
                            "&:hover": {
                              bgcolor: Colors.LOGOlight,
                              color: "#fff",
                            },
                          }}
                        >
                          Website
                        </Button>
                      )}
                      {business.socialLinks?.youtube && (
                        <Button
                          size="small"
                          startIcon={<YouTube />}
                          href={business.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: Colors.LOGOlight,
                            borderColor: Colors.LOGOColor,
                            "&:hover": {
                              bgcolor: Colors.LOGOlight,
                              color: "#fff",
                            },
                          }}
                        >
                          YouTube
                        </Button>
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {business.description}
                    </Typography>
                  </CardContent>

                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<Image />}
                      onClick={() => handleOpenDialog("edit", business)}
                      sx={{ color: Colors.LOGOColor, fontWeight: "medium" }}
                    >
                      {business.images?.length || 0} Photos
                    </Button>
                    <Box>
                      <IconButton
                        onClick={() => handleOpenDialog("edit", business)}
                        sx={{ color: Colors.LOGOColor }}
                      >
                        <Edit />
                      </IconButton>
                      {/* Removed Delete IconButton */}
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Edit Dialog */}
        <Dialog
          open={openDialog && dialogType === "edit"}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle
            sx={{
              bgcolor: Colors.LOGOColor,
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Edit Business</Typography>
            <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Details" />
            <Tab label="Images" />
          </Tabs>

          <DialogContent dividers sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Facebook Profile URL"
                    name="socialLinks.facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Facebook color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Instagram Profile URL"
                    name="socialLinks.instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Instagram color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Twitter Profile URL"
                    name="socialLinks.twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Twitter color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="WhatsApp Number (e.g., 919876543210)"
                    name="socialLinks.whatsapp"
                    value={formData.socialLinks.whatsapp}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WhatsApp color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Website URL"
                    name="socialLinks.website"
                    value={formData.socialLinks.website}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="YouTube Channel/Video URL"
                    name="socialLinks.youtube"
                    value={formData.socialLinks.youtube}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <YouTube color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Business Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={3}
                  />

                  <FormControl fullWidth margin="normal">
                    <InputLabel>State</InputLabel>
                    <Select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      label="State"
                    >
                      {states.map((state) => (
                        <MenuItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>City</InputLabel>
                    <Select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      label="City"
                      disabled={!formData.state}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.name} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                  Business Images (
                  {formData.images.length + newImages.length}/5)
                </Typography>

                <ImageList cols={3} gap={16} sx={{ mb: 3 }}>
                  {formData.images.map((img) => (
                    <ImageListItem key={img._id}>
                      <img
                        src={img.url}
                        alt={`Business ${img._id}`}
                        loading="lazy"
                        style={{ borderRadius: 8 }}
                      />
                      <ImageListItemBar
                        position="top"
                        actionIcon={
                          <IconButton
                            onClick={() => handleRemoveImage(img._id, false)}
                            sx={{ color: "white" }}
                          >
                            <Close />
                          </IconButton>
                        }
                        sx={{
                          background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                          borderRadius: "8px 8px 0 0",
                        }}
                      />
                    </ImageListItem>
                  ))}

                  {newImages.map((img, index) => (
                    <ImageListItem key={`new-${index}`}>
                      <img
                        src={img.url}
                        alt={`New ${index}`}
                        loading="lazy"
                        style={{ borderRadius: 8 }}
                      />
                      <ImageListItemBar
                        position="top"
                        actionIcon={
                          <IconButton
                            onClick={() => handleRemoveImage(img.url, true)}
                            sx={{ color: "white" }}
                          >
                            <Close />
                          </IconButton>
                        }
                        sx={{
                          background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                          borderRadius: "8px 8px 0 0",
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>

                {formData.images.length + newImages.length < 5 && (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddPhotoAlternate />}
                    fullWidth
                    sx={{
                      py: 2,
                      borderColor: Colors.LOGOColor,
                      color: Colors.LOGOColor,
                      "&:hover": { borderColor: Colors.LOGOlight },
                    }}
                  >
                    Upload Images
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </Button>
                )}
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                color: Colors.LOGOColor,
                borderColor: Colors.LOGOColor,
                "&:hover": {
                  backgroundColor: Colors.LOGOlight,
                  color: "#ffffff",
                  borderColor: Colors.LOGOlight,
                },
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdate}
              variant="contained"
              disabled={loading}
              sx={{
                px: 4,
                backgroundColor: Colors.LOGOlight,
                color: "#ffffff",
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#ffffff" }} />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogActions>
        </Dialog>

      
      </Container>
      <Footer />
    </>
  );
};

export default AddedBusiness;