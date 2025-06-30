import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
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
  InputAdornment,
} from "@mui/material";
import {
  Edit,
  Phone,
  Email,
  Star,
  AddBusiness,
  Search,
  Facebook,
  Instagram,
  Link as LinkIcon,
  Add,
  Twitter,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";
import dayjs from "dayjs";
import { State, City } from "country-state-city";
import axios from "../../axiosInstance";
import { Colors } from "../../Comman";
import BusinessQRCode from "./BusinessQRCode";
import EditBusinessUser from "./EditBusinessUser";

const Business = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(null);

  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    email: "",
    address: "",
    service: [],
    city: "",
    state: "",
    openTime: null,
    closeTime: null,
    businessExperience: "",
    description: "",
    images: [],
    category: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      whatsapp: "",
      website: "",
      youtube: "",
    },
  });
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [serviceInput, setServiceInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get("/api/v1/business/get");
      setBusinesses(res.data.data);
      setFilteredBusinesses(res.data.data);
    } catch (error) {
      message.error(
        "No businesses found. Please add a business to get started."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/v1/categories/get");
      setCategories(res.data.getCategories || []);
    } catch (error) {
      message.error("Failed to load categories");
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchBusinesses();
      fetchCategories();
    }
    setStates(State.getStatesOfCountry("IN"));
  }, [user?._id]);

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
      // Find the complete state object that matches the business's state
      const matchedState = states.find(
        (s) => s.isoCode === business.state || s.name === business.state
      );
      // First prepare all the form data
      const initialFormData = {
        businessName: business.businessName || "",
        phone: business.phone || "",
        email: business.email || "",
        address: business.address || "",
        service: business.service || [],
        city: business.city || "",
        openTime: business.openTime || null,
        closeTime: business.closeTime || null,
        businessExperience: business.businessExperience || "",
        state: matchedState ? matchedState.isoCode : business.state || "",
        description: business.description || "",
        images: business.images || [],
        category: business.category?._id || "",
        socialLinks: {
          linkedin: business.socialLinks?.linkedin || "",
          facebook: business.socialLinks?.facebook || "",
          instagram: business.socialLinks?.instagram || "",
          twitter: business.socialLinks?.twitter || "",
          whatsapp: business.socialLinks?.whatsapp || "",
          website: business.socialLinks?.website || "",
          youtube: business.socialLinks?.youtube || "",
        },
      };
      // Now set the form data
      setFormData(initialFormData);
      setCategoryInput(business.category?.name || "");
      setDeletedImages([]);
      setNewImages([]);
    } else {
      // Reset form for new business
      setFormData({
        businessName: "",
        phone: "",
        email: "",
        address: "",
        service: [],
        city: "",
        state: "",
        description: "",
        businessExperience: "",
        images: [],
        category: "",
        socialLinks: {
          facebook: "",
          instagram: "",
          twitter: "",
          whatsapp: "",
          website: "",
          youtube: "",
        },
      });
      setCategoryInput("");
    }
    setOpenDialog(true);
  };

  useEffect(() => {
    if (formData.state) {
      const selectedState = states.find((s) => s.isoCode === formData.state);
      if (selectedState) {
        setCities(City.getCitiesOfState("IN", selectedState.isoCode));
      }
    } else {
      setCities([]);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [formData.state, states]);

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

  const handleAddService = () => {
    if (
      serviceInput.trim() &&
      !formData.service.includes(serviceInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        service: [...prev.service, serviceInput.trim()],
      }));
      setServiceInput("");
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteService = (serviceToDelete) => {
    setFormData((prev) => ({
      ...prev,
      service: prev.service.filter((service) => service !== serviceToDelete),
    }));
  };

  const handleCategorySelect = (event, value) => {
    if (value) {
      const selectedCategory = categories.find((cat) => cat.name === value);
      if (selectedCategory) {
        setFormData((prev) => ({
          ...prev,
          category: selectedCategory._id,
        }));
      }
    }
    setCategoryInput(value || "");
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
      formDataToSend.append("businessExperience", formData.businessExperience);
      formData.service.forEach((item) => {
        formDataToSend.append("service", item);
      });
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("id", selectedBusiness._id);
      formDataToSend.append(
        "socialLinks",
        JSON.stringify(formData.socialLinks)
      );
      newImages.forEach((img) => {
        formDataToSend.append("images", img.file);
      });

      formDataToSend.append(
        "openTime",
        dayjs.isDayjs(formData.openTime)
          ? formData.openTime.toISOString()
          : dayjs(formData.openTime).isValid()
          ? dayjs(formData.openTime).toISOString()
          : ""
      );

      formDataToSend.append(
        "closeTime",
        dayjs.isDayjs(formData.closeTime)
          ? formData.closeTime.toISOString()
          : dayjs(formData.closeTime).isValid()
          ? dayjs(formData.closeTime).toISOString()
          : ""
      );

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
            startIcon={<Add />}
            onClick={() => navigate("/upgrade/plan")}
            sx={{
              backgroundColor: "#9EDC29",
              "&:hover": { backgroundColor: "#7CB51F" },
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: Colors.LOGOColor }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Business
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Services
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Contact
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Social
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Rating
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBusinesses.map((business) => (
                    <TableRow key={business._id} hover>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={business.images?.[0]?.url}
                            alt={business.businessName}
                            sx={{ width: 56, height: 56 }}
                          />
                          <Box>
                            <Typography fontWeight={600}>
                              {business.businessName}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography>{business?.category?.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {business?.service?.map((service, index) => (
                            <Chip
                              key={index}
                              label={service}
                              size="small"
                              sx={{
                                backgroundColor: Colors.LOGOlight,
                                color: "white",
                              }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Phone fontSize="small" color="primary" />
                            <Typography>{business.phone}</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Email fontSize="small" color="primary" />
                            <Typography>{business.email}</Typography>
                          </Box>
                        </Box>
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

                          {business.socialLinks?.twitter && (
                            <Tooltip title="Twitter">
                              <IconButton
                                size="small"
                                href={business.socialLinks.twitter}
                                target="_blank"
                                sx={{ color: Colors.LOGOColor }}
                              >
                                <Twitter fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {business.socialLinks?.linkedin && (
                            <Tooltip title="Twitter">
                              <IconButton
                                size="small"
                                href={business.socialLinks.linkedin}
                                target="_blank"
                                sx={{ color: Colors.LOGOColor }}
                              >
                                <LinkedIn fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {business.socialLinks?.youtube && (
                            <Tooltip title="Twitter">
                              <IconButton
                                size="small"
                                href={business.socialLinks.youtube}
                                target="_blank"
                                sx={{ color: Colors.LOGOColor }}
                              >
                                <YouTube fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {business.socialLinks?.whatsapp && (
                            <Tooltip title="Twitter">
                              <IconButton
                                size="small"
                                href={business.socialLinks.whatsapp}
                                target="_blank"
                                sx={{ color: Colors.LOGOColor }}
                              >
                                <whatsApp fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<Star fontSize="small" />}
                          label={`${Number(business?.rating || 0).toFixed(
                            1
                          )} (${business?.ratingCount || 0})`}
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
                        <BusinessQRCode
                          businessId={business?._id}
                          businessName={business?.businessName}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {/* Edit Dialog */}
      <EditBusinessUser
        openDialog={openDialog}
        dialogType={dialogType}
        handleCloseDialog={handleCloseDialog}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        handleChange={handleChange}
        categories={categories}
        categoryInput={categoryInput}
        setCategoryInput={setCategoryInput}
        handleCategorySelect={handleCategorySelect}
        serviceInput={serviceInput}
        setServiceInput={setServiceInput}
        handleAddService={handleAddService}
        handleDeleteService={handleDeleteService}
        states={states}
        cities={cities}
        handleUpdate={handleUpdate}
        loading={loading}
        newImages={newImages}
        handleRemoveImage={handleRemoveImage}
        handleImageUpload={handleImageUpload}
        setFormData={setFormData}
      />
    </Container>
  );
};

export default Business;
