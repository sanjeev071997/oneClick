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
  FormControl,
  InputLabel,
  Select,
  Box,
  CircularProgress,
  Divider,
  Card,
  CardMedia,
  IconButton,
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
  Search
} from "@mui/icons-material";
import axios from "../axiosInstance";
import Navbar from "../Components/Navbar";

const ListYourBusiness = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    category: "",
    description: "",
    images: []
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategory, setOpenCategory] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/v1/categories/get');
      const sorted = [...(res.data.getCategories || [])].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setCategories(sorted);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - formData.images.length);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach(image => data.append("images", image));
      } else {
        data.append(key, value);
      }
    });

    try {
      const res = await axios.post("/api/v1/business/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message || "Business added successfully!");
      setFormData({
        businessName: "",
        ownerName: "",
        phone: "",
        email: "",
        address: "",
        category: "",
        description: "",
        images: []
      });

    } catch (error) {
      alert(error.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: "linear-gradient(to bottom right, #f9f9ff, #ffffff)",
            boxShadow: "0px 8px 45px rgba(3, 0, 71, 0.09)",
            border: "1px solid rgba(0, 0, 0, 0.05)"
          }}
        >
          <Box textAlign="center" mb={5}>
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: "#84139520",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3
              }}
            >
              <Business sx={{ fontSize: 40, color: "#841395" }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#2d2d2d" }}>
              List Your Business
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
              Join our community of local businesses and reach thousands of potential customers
            </Typography>
          </Box>

          <Divider sx={{ mb: 4, borderColor: "rgba(0, 0, 0, 0.08)" }} />

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Business & Owner Info */}
              {[
                { label: "Business Name", name: "businessName", icon: <Business /> },
                { label: "Owner Name", name: "ownerName", icon: <Person /> },
                { label: "Phone Number", name: "phone", icon: <Phone />, type: "tel" },
                { label: "Email", name: "email", icon: <Email />, type: "email" }
              ].map((field, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <TextField
                    fullWidth
                    required
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    value={formData[field.name]}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {React.cloneElement(field.icon, { color: "primary" })}
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.12)"
                        },
                        "&:hover fieldset": {
                          borderColor: "#841395"
                        }
                      }
                    }}
                  />
                </Grid>
              ))}

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Business Address"
                  name="address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.12)"
                      },
                      "&:hover fieldset": {
                        borderColor: "#841395"
                      }
                    }
                  }}
                />
              </Grid>

              {/* Enhanced Category Dropdown with Search */}
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth required>
                  <InputLabel>Business Category</InputLabel>
                  <Select
                    label="Business Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onOpen={() => setOpenCategory(true)}
                    onClose={() => setOpenCategory(false)}
                    open={openCategory}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300
                        }
                      }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.12)"
                        },
                        "&:hover fieldset": {
                          borderColor: "#841395"
                        }
                      }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
                      <TextField
                        fullWidth
                        autoFocus
                        placeholder="Search categories..."
                        variant="standard"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search color="action" />
                            </InputAdornment>
                          ),
                          disableUnderline: true,
                          sx: { fontSize: "0.9rem" }
                        }}
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id} sx={{ py: 1.5 }}>
                          {cat.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled sx={{ py: 1.5 }}>
                        No categories found
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
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
                      <InputAdornment position="start">
                        <Description color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.12)"
                      },
                      "&:hover fieldset": {
                        borderColor: "#841395"
                      }
                    }
                  }}
                />
              </Grid>

              {/* Image Upload Section */}
              <Grid item xs={12}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    border: "2px dashed rgba(132, 19, 149, 0.3)",
                    backgroundColor: "rgba(132, 19, 149, 0.03)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "rgba(132, 19, 149, 0.6)",
                      backgroundColor: "rgba(132, 19, 149, 0.05)"
                    }
                  }}
                >
                  <Box textAlign="center">
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: "#84139510",
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 28, color: "#841395" }} />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ color: "#2d2d2d" }}>
                      Business Images
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Upload up to 5 high-quality images (JPG, PNG)
                    </Typography>

                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCamera />}
                      disabled={formData.images.length >= 5}
                      sx={{
                        borderRadius: 2,
                        borderColor: "#841395",
                        color: "#841395",
                        "&:hover": {
                          backgroundColor: "#84139510",
                          borderColor: "#841395"
                        }
                      }}
                    >
                      Select Images
                      <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
                    </Button>

                    <Typography variant="caption" display="block" mt={1} color="text.secondary">
                      {formData.images.length} of 5 files selected
                    </Typography>
                  </Box>

                  {/* Preview */}
                  {formData.images.length > 0 && (
                    <Box mt={3}>
                      <Grid container spacing={2}>
                        {formData.images.map((img, idx) => (
                          <Grid item xs={6} sm={4} md={3} key={idx}>
                            <Card sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
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
                                  backgroundColor: "rgba(0,0,0,0.6)",
                                  color: "#fff",
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.8)"
                                  }
                                }}
                              >
                                <Close fontSize="small" />
                              </IconButton>
                            </Card>
                            <Typography 
                              variant="caption" 
                              noWrap 
                              title={img.name}
                              sx={{ 
                                display: "block", 
                                mt: 0.5,
                                color: "text.secondary"
                              }}
                            >
                              {img.name.length > 20 ? `${img.name.substring(0, 17)}...` : img.name}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Card>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                  sx={{
                    py: 2,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderRadius: 2,
                    textTransform: "none",
                    letterSpacing: 0.5,
                    background: "linear-gradient(45deg, #841395, #a517ba)",
                    boxShadow: "0 4px 15px rgba(132, 19, 149, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #6a0d7a, #841395)",
                      boxShadow: "0 6px 20px rgba(132, 19, 149, 0.4)"
                    },
                    "&:disabled": {
                      background: "rgba(0, 0, 0, 0.12)"
                    }
                  }}
                >
                  {loading ? "Processing..." : "Submit Business Listing"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default ListYourBusiness;