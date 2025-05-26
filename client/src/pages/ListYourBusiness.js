


// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   InputAdornment,
//   MenuItem,
//   Box,
//   CircularProgress,
//   Divider,
//   Card,
//   CardMedia,
//   IconButton,
//   Autocomplete
// } from "@mui/material";
// import {
//   PhotoCamera,
//   Business,
//   Person,
//   Phone,
//   Email,
//   Home,
//   Description,
//   Close,
//   Search
// } from "@mui/icons-material";
// import axios from "../axiosInstance";
// import Navbar from "../Components/Navbar";
// import { useSelector } from "react-redux";

// const ListYourBusiness = () => {
//   const { user } = useSelector((state) => state.user);
//   const [formData, setFormData] = useState({
//     businessName: "",
//     ownerName: "",
//     phone: "",
//     email: "",
//     address: "",
//     category: "",
//     // categoryId: "",
//     description: "",
//     images: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [categoryInput, setCategoryInput] = useState("");

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get('/api/v1/categories/get');
//       const sorted = [...(res.data.getCategories || [])].sort((a, b) =>
//         a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//       );
//       setCategories(sorted);
//     } catch (error) {
//       console.error('Failed to fetch categories:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files).slice(0, 5 - formData.images.length);
//     setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
//   };

//   const removeImage = (index) => {
//     const newImages = formData.images.filter((_, i) => i !== index);
//     setFormData(prev => ({ ...prev, images: newImages }));
//   };

//   const handleCategorySelect = (event, value) => {
//     if (value) {
//       const selectedCategory = categories.find(cat => cat.name === value);
//       if (selectedCategory) {
//         setFormData(prev => ({
//           ...prev,
//           // category: selectedCategory.name,
//           category: selectedCategory._id
//         }));
//       } else {
//         // For custom/new category
//         setFormData(prev => ({
//           ...prev,
//           category: value,
//           // categoryId: "" // No ID for custom categories
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         category: "",
//         // categoryId: ""
//       }));
//     }
//     setCategoryInput(value || "");
//   };

//   // add business 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === "images") {
//         value.forEach(image => data.append("images", image));
//       } else if (value !== undefined && value !== null) {
//         data.append(key, value);
//       }
//     });
//     data.append("userId", user._id)
//     try {
//       const res = await axios.post("/api/v1/business/add", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert(res.data.message || "Business added successfully!");
//       setFormData({
//         businessName: "",
//         ownerName: "",
//         phone: "",
//         email: "",
//         address: "",
//         category: "",
//         // categoryId: "",
//         description: "",
//         images: []
//       });
//       setCategoryInput("");

//     } catch (error) {
//       alert(error.response?.data?.message || "Submission failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <Container maxWidth="md" sx={{ py: 6 }}>
//         <Paper
//           elevation={3}
//           sx={{
//             p: { xs: 3, md: 5 },
//             borderRadius: 4,
//             background: "linear-gradient(to bottom right, #f9f9ff, #ffffff)",
//             boxShadow: "0px 8px 45px rgba(3, 0, 71, 0.09)",
//             border: "1px solid rgba(0, 0, 0, 0.05)"
//           }}
//         >
//           <Box textAlign="center" mb={5}>
//             <Box
//               sx={{
//                 width: 80,
//                 height: 80,
//                 backgroundColor: "#84139520",
//                 borderRadius: "50%",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 mb: 3
//               }}
//             >
//               <Business sx={{ fontSize: 40, color: "#841395" }} />
//             </Box>
//             <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#2d2d2d" }}>
//               List Your Business
//             </Typography>
//             <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
//               Join our community of local businesses and reach thousands of potential customers
//             </Typography>
//           </Box>

//           <Divider sx={{ mb: 4, borderColor: "rgba(0, 0, 0, 0.08)" }} />

//           <Box component="form" onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               {/* Business & Owner Info */}
//               {[
//                 { label: "Business Name", name: "businessName", icon: <Business /> },
//                 { label: "Owner Name", name: "ownerName", icon: <Person /> },
//                 { label: "Phone Number", name: "phone", icon: <Phone />, type: "tel" },
//                 { label: "Email", name: "email", icon: <Email />, type: "email" }
//               ].map((field, i) => (
//                 <Grid item xs={12} sm={6} key={i}>
//                   <TextField
//                     fullWidth
//                     required
//                     label={field.label}
//                     name={field.name}
//                     type={field.type || "text"}
//                     value={formData[field.name]}
//                     onChange={handleChange}
//                     variant="outlined"
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           {React.cloneElement(field.icon, { color: "primary" })}
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         borderRadius: 2,
//                         "& fieldset": {
//                           borderColor: "rgba(0, 0, 0, 0.12)"
//                         },
//                         "&:hover fieldset": {
//                           borderColor: "#841395"
//                         }
//                       }
//                     }}
//                   />
//                 </Grid>
//               ))}

//               {/* Address */}
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   required
//                   label="Business Address"
//                   name="address"
//                   multiline
//                   rows={2}
//                   value={formData.address}
//                   onChange={handleChange}
//                   variant="outlined"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Home color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                       "& fieldset": {
//                         borderColor: "rgba(0, 0, 0, 0.12)"
//                       },
//                       "&:hover fieldset": {
//                         borderColor: "#841395"
//                       }
//                     }
//                   }}
//                 />
//               </Grid>

//               {/* Category Field with Search and Custom Entry */}
//               <Grid item xs={12}>
//                 <Autocomplete
//                   freeSolo
//                   options={categories.map((category) => category.name)}
//                   inputValue={categoryInput}
//                   onInputChange={(event, newInputValue) => {
//                     setCategoryInput(newInputValue);
//                   }}
//                   onChange={handleCategorySelect}
//                   value={formData.category}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Business Category"
//                       required
//                       placeholder="Search or type a new category"
//                       variant="outlined"
//                       InputProps={{
//                         ...params.InputProps,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <Search color="action" />
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: 2,
//                           "& fieldset": {
//                             borderColor: "rgba(0, 0, 0, 0.12)"
//                           },
//                           "&:hover fieldset": {
//                             borderColor: "#841395"
//                           }
//                         }
//                       }}
//                     />
//                   )}
//                   renderOption={(props, option) => (
//                     <MenuItem {...props} key={option}>
//                       {option}
//                     </MenuItem>
//                   )}
//                   noOptionsText={
//                     categoryInput ? (
//                       <Typography>
//                         Press enter to use "{categoryInput}"
//                       </Typography>
//                     ) : (
//                       "Type to search categories"
//                     )
//                   }
//                 />
//               </Grid>

//               {/* Description */}
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Business Description"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   multiline
//                   rows={4}
//                   variant="outlined"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start" sx={{mt:-7}}>
//                         <Description color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: 2,
//                       "& fieldset": {
//                         borderColor: "rgba(0, 0, 0, 0.12)"
//                       },
//                       "&:hover fieldset": {
//                         borderColor: "#841395"
//                       }
//                     }
//                   }}
//                 />
//               </Grid>

//               {/* Image Upload Section */}
//               <Grid item xs={12}>
//                 <Card
//                   variant="outlined"
//                   sx={{
//                     p: 3,
//                     borderRadius: 2,
//                     border: "2px dashed rgba(132, 19, 149, 0.3)",
//                     backgroundColor: "rgba(132, 19, 149, 0.03)",
//                     transition: "all 0.3s ease",
//                     "&:hover": {
//                       borderColor: "rgba(132, 19, 149, 0.6)",
//                       backgroundColor: "rgba(132, 19, 149, 0.05)"
//                     }
//                   }}
//                 >
//                   <Box textAlign="center">
//                     <Box
//                       sx={{
//                         width: 60,
//                         height: 60,
//                         backgroundColor: "#84139510",
//                         borderRadius: "50%",
//                         display: "inline-flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         mb: 2
//                       }}
//                     >
//                       <PhotoCamera sx={{ fontSize: 28, color: "#841395" }} />
//                     </Box>
//                     <Typography variant="h6" gutterBottom sx={{ color: "#2d2d2d" }}>
//                       Business Images
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                       Upload up to 5 high-quality images (JPG, PNG)
//                     </Typography>

//                     <Button
//                       variant="outlined"
//                       component="label"
//                       startIcon={<PhotoCamera />}
//                       disabled={formData.images.length >= 5}
//                       sx={{
//                         borderRadius: 2,
//                         borderColor: "#841395",
//                         color: "#841395",
//                         "&:hover": {
//                           backgroundColor: "#84139510",
//                           borderColor: "#841395"
//                         }
//                       }}
//                     >
//                       Select Images
//                       <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
//                     </Button>

//                     <Typography variant="caption" display="block" mt={1} color="text.secondary">
//                       {formData.images.length} of 5 files selected
//                     </Typography>
//                   </Box>

//                   {/* Preview */}
//                   {formData.images.length > 0 && (
//                     <Box mt={3}>
//                       <Grid container spacing={2}>
//                         {formData.images.map((img, idx) => (
//                           <Grid item xs={6} sm={4} md={3} key={idx}>
//                             <Card sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
//                               <CardMedia
//                                 component="img"
//                                 height="140"
//                                 image={URL.createObjectURL(img)}
//                                 alt={img.name}
//                                 sx={{ objectFit: "cover" }}
//                               />
//                               <IconButton
//                                 size="small"
//                                 onClick={() => removeImage(idx)}
//                                 sx={{
//                                   position: "absolute",
//                                   top: 5,
//                                   right: 5,
//                                   backgroundColor: "rgba(0,0,0,0.6)",
//                                   color: "#fff",
//                                   "&:hover": {
//                                     backgroundColor: "rgba(0,0,0,0.8)"
//                                   }
//                                 }}
//                               >
//                                 <Close fontSize="small" />
//                               </IconButton>
//                             </Card>
//                             <Typography
//                               variant="caption"
//                               noWrap
//                               title={img.name}
//                               sx={{
//                                 display: "block",
//                                 mt: 0.5,
//                                 color: "text.secondary"
//                               }}
//                             >
//                               {img.name.length > 20 ? `${img.name.substring(0, 17)}...` : img.name}
//                             </Typography>
//                           </Grid>
//                         ))}
//                       </Grid>
//                     </Box>
//                   )}
//                 </Card>
//               </Grid>

//               {/* Submit Button */}
//               <Grid item xs={12}>
//                 <Button
//                   type="submit"
//                   fullWidth
//                   size="large"
//                   variant="contained"
//                   disabled={loading}
//                   startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
//                   sx={{
//                     py: 2,
//                     fontWeight: "bold",
//                     fontSize: "1rem",
//                     borderRadius: 2,
//                     textTransform: "none",
//                     letterSpacing: 0.5,
//                     background: "linear-gradient(45deg, #841395, #a517ba)",
//                     boxShadow: "0 4px 15px rgba(132, 19, 149, 0.3)",
//                     "&:hover": {
//                       background: "linear-gradient(45deg, #6a0d7a, #841395)",
//                       boxShadow: "0 6px 20px rgba(132, 19, 149, 0.4)"
//                     },
//                     "&:disabled": {
//                       background: "rgba(0, 0, 0, 0.12)"
//                     }
//                   }}
//                 >
//                   {loading ? "Processing..." : "Submit Business Listing"}
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>
//         </Paper>
//       </Container>
//     </>
//   );
// };

// export default ListYourBusiness;

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
  Chip
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
  CheckCircle
} from "@mui/icons-material";
import axios from "../axiosInstance";
import Navbar from "../Components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../Components/Footer";

const ListYourBusiness = () => {
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    category: "",
    description: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [success, setSuccess] = useState(false);

  const steps = ["Business Information", "Contact Details", "Media & Description", "Review & Submit"];

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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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

  const handleCategorySelect = (event, value) => {
    if (value) {
      const selectedCategory = categories.find(cat => cat.name === value);
      if (selectedCategory) {
        setFormData(prev => ({
          ...prev,
          category: selectedCategory._id
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          category: value,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        category: "",
      }));
    }
    setCategoryInput(value || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach(image => data.append("images", image));
      } else if (value !== undefined && value !== null) {
        data.append(key, value);
      }
    });
    data.append("userId", user._id)
    try {
      const res = await axios.post("/api/v1/business/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
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
      setCategoryInput("");

    } catch (error) {
      alert(error.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
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
                      <Business color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={categories.map((category) => category.name)}
                inputValue={categoryInput}
                onInputChange={(event, newInputValue) => {
                  setCategoryInput(newInputValue);
                }}
                onChange={handleCategorySelect}
                value={formData.category.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Business Category"
                    required
                    placeholder="Search or type a new category"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <MenuItem {...props} key={option}>
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
                      <Description color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            {[
              { label: "Owner Name", name: "ownerName", icon: <Person /> },
              { label: "Phone Number", name: "phone", icon: <Phone />, type: "tel" },
              { label: "Email", name: "email", icon: <Email />, type: "email" },
              { label: "Business Address", name: "address", icon: <Home />, multiline: true, rows: 2 }
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {React.cloneElement(field.icon, { color: "primary" })}
                      </InputAdornment>
                    ),
                  }}
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
                  border: '2px dashed #841395',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: 'rgba(132, 19, 149, 0.05)',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(132, 19, 149, 0.1)'
                  }
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="business-images"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <label htmlFor="business-images">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#84139520', width: 60, height: 60, mb: 2 }}>
                      <PhotoCamera sx={{ fontSize: 30, color: '#841395' }} />
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      Upload Business Images
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Drag & drop images here or click to browse (Max 5 images)
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
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
                        <Card sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={URL.createObjectURL(img)}
                            alt={img.name}
                            sx={{ objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(idx)}
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)'
                              }
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
          <Box sx={{ p: 3, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <CheckCircle color="primary" sx={{ mr: 1 }} /> Review Your Business Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Business Name</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{formData.businessName}</Typography>

                <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {categories.find(c => c._id === formData.category)?.name || formData.category}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{formData.description || "Not provided"}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Contact Information</Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip icon={<Person />} label={formData.ownerName} sx={{ mr: 1, mb: 1 }} />
                  <Chip icon={<Phone />} label={formData.phone} sx={{ mr: 1, mb: 1 }} />
                  {formData.email && <Chip icon={<Email />} label={formData.email} sx={{ mb: 1 }} />}
                </Box>

                <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{formData.address}</Typography>

                <Typography variant="subtitle2" color="text.secondary">Images</Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                  {formData.images && formData.images.length > 0 ? (
                    formData.images.map((img, index) => (
                      <img
                        key={index}
                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                        alt={`Uploaded ${index}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body1">No images uploaded</Typography>
                  )}
                </Box>

              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 6, borderRadius: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Avatar sx={{ bgcolor: '#4caf50', width: 80, height: 80, mx: 'auto' }}>
                <CheckCircle sx={{ fontSize: 50 }} />
              </Avatar>
            </Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2d2d2d' }}>
              Congratulations!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Your business has been successfully listed.
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => {
                setSuccess(false);
                setActiveStep(0);
              }}
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              List Another Business
            </Button>
          </Paper>
        </Container>
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
            background: '#ffffff',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box textAlign="center" mb={5}>
            <Box
              sx={{
                width: 100,
                height: 100,
                backgroundColor: '#84139510',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}
            >
              <Business sx={{ fontSize: 50, color: '#841395' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#2d2d2d' }}>
              List Your Business
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Join our community and showcase your business to thousands of potential customers
            </Typography>
          </Box>

          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              {steps.map((label, index) => (
                <React.Fragment key={label}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: activeStep >= index ? '#841395' : 'rgba(0, 0, 0, 0.12)',
                        color: activeStep >= index ? '#fff' : 'rgba(0, 0, 0, 0.5)',
                        fontWeight: 'bold'
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        fontWeight: activeStep === index ? 'bold' : 'normal',
                        color: activeStep >= index ? '#841395' : 'text.secondary'
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
                        bgcolor: activeStep > index ? '#841395' : 'rgba(0, 0, 0, 0.12)',
                        alignSelf: 'center',
                        mx: 1
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            {getStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  background: 'linear-gradient(45deg, #841395, #a517ba)',
                  boxShadow: '0 4px 15px rgba(132, 19, 149, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #6a0d7a, #841395)'
                  }
                }}
              >
                {loading ? 'Submitting...' : 'Submit Listing'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  background: 'linear-gradient(45deg, #841395, #a517ba)',
                  boxShadow: '0 4px 15px rgba(132, 19, 149, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #6a0d7a, #841395)'
                  }
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