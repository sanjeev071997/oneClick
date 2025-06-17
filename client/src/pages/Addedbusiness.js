
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
} from "@mui/material";
import {
  Edit,
  Delete,
  AddPhotoAlternate,
  Close,
  Phone,
  Email,
  LocationOn,
  Star,
  AddBusiness,
  Image,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";
import axios from "../axiosInstance";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Colors } from "../Comman";

const AddedBusiness = () => {
  const { user } = useSelector((state) => state.user);
  const navigate= useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch businesses
  const fetchBusinesses = async () => {
    try {
      const res = await axios.get("/api/v1/business/get", { userId: user._id });
      setBusinesses(res.data.data);
    } catch (error) {
      message.error("Failed to fetch businesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchBusinesses();
  }, [user]);

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
        description: business.description,
        images: business.images || [],
      });
      setDeletedImages([]);
      setNewImages([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewImages([]);
    setActiveTab(0);
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      formDataToSend.append("description", formData.description);
      formDataToSend.append("id", selectedBusiness._id);

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

  // Handle business deletion

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.delete("/api/v1/business/delete", {
        data: { id: selectedBusiness._id },
      });
  
      if (res.data.success === true) {
        message.success("Business deleted successfully");
        fetchBusinesses();
        handleCloseDialog();
      } else {
        message.error("Failed to delete business");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Deletion failed");
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
        {businesses.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              background: "rgba(245, 245, 245, 0.7)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                bgcolor: "primary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <AddBusiness sx={{ fontSize: 60,  color: "#ffffff" }} />
            </Box>
            <Typography variant="h5" gutterBottom>
              No Businesses Listed Yet
            </Typography>
            <Typography color="text.secondary" mb={4}>
              Get started by adding your first business to showcase your services
            </Typography>
            <Button
             onClick={() => navigate('/plans')}
              variant="contained"
              size="large"
              sx={{ px: 5, borderRadius: 2 , color: "#ffffff", backgroundColor: Colors.LOGOlight, "&:hover": { backgroundColor: Colors.LOGOlight } }}
              startIcon={<AddBusiness />}
            >
              Create Your First Listing
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {businesses.map((business) => (
              <Grid item xs={12} sm={6} lg={4} key={business._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 3,
                    },
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
                        color: Colors.LOGOlight,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Star fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="caption">
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
                        {business.address}
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
                      borderTop: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<Image />}
                      onClick={() => handleOpenDialog("edit", business)}
                    >
                      {business.images?.length || 0} Photos
                    </Button>
                    <Box>
                      <IconButton
                        onClick={() => handleOpenDialog("edit", business)}
                        sx={{ color: "primary.main" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenDialog("delete", business)}
                        sx={{ color: "error.main", ml: 1 }}
                      >
                        <Delete />
                      </IconButton>
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
              bgcolor: "primary.main",
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
                  Business Images ({formData.images.length + newImages.length}/5)
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
                    sx={{ py: 2 }}
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
                "&:hover": {
                  backgroundColor: Colors.LOGOlight,
                },
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

        {/* Delete Dialog */}
        <Dialog
          open={openDialog && dialogType === "delete"}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle
            sx={{
              bgcolor: "error.main",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Confirm Deletion</Typography>
            <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ textAlign: "center", py: 4 }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "error.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <Delete sx={{ fontSize: 50, color: "error.main" }} />
            </Box>
            <Typography variant="h6" gutterBottom>
              Delete {selectedBusiness?.businessName}?
            </Typography>
            <Typography color="text.secondary">
              This will permanently remove all business data including images and
              reviews.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            <Button onClick={handleCloseDialog} sx={{ color: "text.secondary" }}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loading}
              sx={{ px: 4 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Delete"
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