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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tooltip,
  Grid,
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
  Search,
  Facebook,
  Instagram,
  Link as LinkIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";
import axios from '../../axiosInstance';
import { Colors } from '../../Comman';
import { State, City } from "country-state-city";

const Business = () => {
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

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get("/api/v1/business/get", {
        params: { userId: user._id },
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
    setStates(State.getStatesOfCountry("IN"));
  }, [user]);

  useEffect(() => {
    if (formData.state) {
      setCities(City.getCitiesOfState("IN", formData.state));
    } else {
      setCities([]);
    }
  }, [formData.state]);

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

  const handleOpenDialog = (type, business = null) => {
    setDialogType(type);
    setSelectedBusiness(business);
    if (type === "edit" && business) {
      setFormData({
        businessName: business?.businessName || "",
        phone: business.phone || "",
        email: business.email || "",
        address: business.address || "",
        city: business.city || "",
        state: business.state || "",
        description: business.description || "",
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
      
      Object.entries(formData.socialLinks).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      newImages.forEach((img) => {
        formDataToSend.append("images", img.file);
      });

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "2rem",
            color: Colors.LOGOColor,
            fontWeight: 700,
            pb: 1,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 60,
              height: 4,
              backgroundColor: Colors.LOGOColor,
              borderRadius: 2,
            },
          }}
        >
          Business Listings
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="Search businesses..."
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
                "& fieldset": { border: "none" },
                boxShadow: 1,
              },
            }}
            sx={{
              width: { xs: "100%", sm: "300px" },
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddBusiness />}
            onClick={() => navigate("/plans")}
            sx={{
              bgcolor: Colors.LOGOColor,
              "&:hover": { bgcolor: Colors.LOGOlight },
              whiteSpace: "nowrap",
            }}
          >
            Add Business
          </Button>
        </Box>
      </Box>

      {filteredBusinesses.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            background: "linear-gradient(145deg, #f5f7fa, #e4e8ed)",
          }}
        >
          {searchTerm ? (
            <>
              <Search sx={{ fontSize: 80, color: Colors.LOGOColor, mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                No businesses found
              </Typography>
              <Typography color="text.secondary" mb={4}>
                No results for "{searchTerm}"
              </Typography>
              <Button
                onClick={() => setSearchTerm("")}
                variant="contained"
                sx={{
                  bgcolor: Colors.LOGOColor,
                  "&:hover": { bgcolor: Colors.LOGOlight },
                }}
              >
                Clear Search
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
                  mb: 3,
                }}
              >
                <AddBusiness sx={{ fontSize: 60, color: "white" }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                No Businesses Listed
              </Typography>
              <Typography color="text.secondary" mb={4}>
                Get started by adding your first business
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddBusiness />}
                onClick={() => navigate("/plans")}
                sx={{
                  bgcolor: Colors.LOGOColor,
                  "&:hover": { bgcolor: Colors.LOGOlight },
                }}
              >
                Create Listing
              </Button>
            </>
          )}
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: Colors.LOGOlight }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>Business</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>Social</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>Rating</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600, textAlign: "center" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBusinesses.map((business) => (
                  <TableRow key={business._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={business.images?.[0]?.url}
                          alt={business.businessName}
                          sx={{ width: 56, height: 56 }}
                        />
                        <Box>
                          <Typography fontWeight={600}>{business.businessName}</Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {business.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Phone fontSize="small" color="primary" />
                          <Typography>{business.phone}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Email fontSize="small" color="primary" />
                          <Typography>{business.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOn fontSize="small" color="primary" />
                        <Typography>
                          {business.city}, {business.state}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {business.address}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {business.socialLinks?.facebook && (
                          <Tooltip title="Facebook">
                            <IconButton
                              size="small"
                              href={business.socialLinks.facebook}
                              target="_blank"
                              sx={{ color: "#1877F2" }}
                            >
                              <Facebook fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {business.socialLinks?.instagram && (
                          <Tooltip title="Instagram">
                            <IconButton
                              size="small"
                              href={business.socialLinks.instagram}
                              target="_blank"
                              sx={{ color: "#E4405F" }}
                            >
                              <Instagram fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {business.socialLinks?.website && (
                          <Tooltip title="Website">
                            <IconButton
                              size="small"
                              href={business.socialLinks.website}
                              target="_blank"
                              sx={{ color: Colors.LOGOColor }}
                            >
                              <LinkIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Star fontSize="small" />}
                        label={`${Number(business?.rating || 0).toFixed(1)} (${business?.ratingCount || 0})`}
                        size="small"
                        sx={{
                          bgcolor: Colors.LOGOlight,
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog("edit", business)}
                          sx={{ color: Colors.LOGOColor }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
            py: 2,
          }}
        >
          <Box display="flex" alignItems="center">
            <Edit sx={{ mr: 1.5 }} />
            <Typography variant="h6" fontWeight={600}>
              Edit Business
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-indicator": {
              backgroundColor: Colors.LOGOColor,
              height: 3,
            },
          }}
        >
          <Tab
            label="Basic Info"
            sx={{
              fontWeight: 600,
              color: activeTab === 0 ? Colors.LOGOColor : "text.secondary",
            }}
          />
          <Tab
            label="Media"
            sx={{
              fontWeight: 600,
              color: activeTab === 1 ? Colors.LOGOColor : "text.secondary",
            }}
          />
        </Tabs>

        <DialogContent dividers sx={{ p: 0 }}>
          {activeTab === 0 ? (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box mb={3}>
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                      Business Information
                    </Typography>
                    <TextField
                      fullWidth
                      label="Business Name"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      margin="normal"
                      size="small"
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
                      size="small"
                      sx={{ mt: 2 }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                      Contact Details
                    </Typography>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      margin="normal"
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                      size="small"
                      sx={{ mt: 2 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box mb={3}>
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                      Location
                    </Typography>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      margin="normal"
                      multiline
                      rows={3}
                      size="small"
                    />
                    <FormControl fullWidth margin="normal" size="small" sx={{ mt: 2 }}>
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
                    <FormControl fullWidth margin="normal" size="small">
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
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                      Social Links
                    </Typography>
                    <TextField
                      fullWidth
                      label="Facebook"
                      name="socialLinks.facebook"
                      value={formData.socialLinks.facebook}
                      onChange={handleChange}
                      margin="normal"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Facebook color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Instagram"
                      name="socialLinks.instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleChange}
                      margin="normal"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Instagram color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Website"
                      name="socialLinks.website"
                      value={formData.socialLinks.website}
                      onChange={handleChange}
                      margin="normal"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mt: 2 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Business Images ({formData.images.length + newImages.length}/5)
              </Typography>
              
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr 1fr",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 2,
                  mb: 3,
                }}
              >
                {formData.images.map((img) => (
                  <Box
                    key={img._id}
                    sx={{
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      aspectRatio: "1/1",
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Business ${img._id}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(img._id, false)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {newImages.map((img, index) => (
                  <Box
                    key={`new-${index}`}
                    sx={{
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      aspectRatio: "1/1",
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`New ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(img.url, true)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {formData.images.length + newImages.length < 5 && (
                  <Button
                    component="label"
                    variant="outlined"
                    sx={{
                      aspectRatio: "1/1",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderStyle: "dashed",
                      borderColor: "divider",
                      "&:hover": {
                        borderColor: Colors.LOGOColor,
                        backgroundColor: "rgba(25, 118, 210, 0.04)",
                      },
                    }}
                  >
                    <AddPhotoAlternate
                      sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Add Photos
                    </Typography>
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

              <Typography variant="body2" color="text.secondary">
                Upload up to 5 high-quality images (JPEG, PNG)
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              color: "text.secondary",
              borderColor: "divider",
              "&:hover": {
                borderColor: "text.secondary",
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
              bgcolor: Colors.LOGOColor,
              "&:hover": {
                bgcolor: Colors.LOGOlight,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Business;