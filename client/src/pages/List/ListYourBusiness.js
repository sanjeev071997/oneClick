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
//   Card,
//   CardMedia,
//   IconButton,
//   Autocomplete,
//   Avatar,
//   Link,
//   Divider,
//   Alert as MuiAlert,
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
//   Search,
//   Add,
//   CheckCircle,
//   Facebook,
//   Instagram,
//   Twitter,
//   LinkedIn,
//   Language,
//   YouTube,
//   WhatsApp,
//   Share,
// } from "@mui/icons-material";
// import axios from "../axiosInstance";
// import Navbar from "../Components/Navbar";
// import { useSelector } from "react-redux";
// import Footer from "../Components/Footer";
// import { State, City } from "country-state-city";
// import { message } from "antd";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Colors, FontWeight } from "../Comman";

// const ListYourBusiness = () => {
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.user);
//   const [formData, setFormData] = useState({
//     businessName: "",
//     ownerName: "",
//     phone: "",
//     email: "",
//     address: "",
//     state: "",
//     city: "",
//     category: "",
//     description: "",
//     images: [],
//   });
//   const location = useLocation();
//   const { planName, planPrice, planId } = location.state || {};
//   const [statesList, setStatesList] = useState([]);
//   const [citiesList, setCitiesList] = useState([]);
//   const states = State.getStatesOfCountry("IN");
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [categoryInput, setCategoryInput] = useState("");
//   const [activeStep, setActiveStep] = useState(0);
//   const [success, setSuccess] = useState(false);
//   const [links, setLinks] = useState({
//     facebook: "",
//     instagram: "",
//     twitter: "",
//     linkedin: "",
//     website: "",
//     youtube: "",
//     whatsapp: "",
//   });
//   const [showLoginAlert, setShowLoginAlert] = useState(!user);

//   useEffect(() => {
//     if (!user) {
//       message.warning("You need to login to list your business");
//       navigate("/login", { state: { from: location.pathname } });
//     }
//     fetchCategories();
//     setStatesList(states);
//   }, [user, navigate, location.pathname]);

//   const handleChangeLinks = (e) => {
//     setLinks({ ...links, [e.target.name]: e.target.value });
//   };

//   const steps = [
//     "Business Information",
//     "Contact Details",
//     "Images",
//     "Social Media",
//     "Review & Submit",
//   ];

//   const socialPlatforms = [
//     { name: "facebook", icon: <Facebook />, color: "#1877F2" },
//     { name: "instagram", icon: <Instagram />, color: "#E4405F" },
//     { name: "twitter", icon: <Twitter />, color: "#1DA1F2" },
//     { name: "linkedin", icon: <LinkedIn />, color: "#0A66C2" },
//     { name: "website", icon: <Language />, color: "#1976d2" },
//     { name: "youtube", icon: <YouTube />, color: "#FF0000" },
//     { name: "whatsapp", icon: <WhatsApp />, color: "#25D366" },
//   ];

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("/api/v1/categories/get");
//       const sorted = [...(res.data.getCategories || [])].sort((a, b) =>
//         a.name.toLowerCase().localeCompare(b.name.toLowerCase())
//       );
//       setCategories(sorted);
//     } catch (error) {
//       message.error("Failed to load business categories.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (formData.state) {
//       const selectedState = statesList.find((s) => s.name === formData.state);
//       if (selectedState) {
//         setCitiesList(City.getCitiesOfState("IN", selectedState.isoCode));
//       } else {
//         setCitiesList([]);
//       }
//       setFormData((prev) => ({ ...prev, city: "" }));
//     } else {
//       setCitiesList([]);
//     }
//   }, [formData.state, statesList]);

//   const handleNext = () => {
//     if (activeStep === 0) {
//       if (
//         !formData.businessName ||
//         !formData.state ||
//         !formData.city ||
//         !formData.category
//       ) {
//         message.error(
//           "Please fill in all required fields for Business Information."
//         );
//         return;
//       }
//     } else if (activeStep === 1) {
//       if (
//         !formData.ownerName ||
//         !formData.phone ||
//         !formData.email ||
//         !formData.address
//       ) {
//         message.error(
//           "Please fill in all required fields for Contact Details."
//         );
//         return;
//       }
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (formData.email && !emailRegex.test(formData.email)) {
//         message.error("Please enter a valid email address.");
//         return;
//       }
//     } else if (activeStep === steps.length - 2) {
//       if (!formData.images || formData.images.length === 0) {
//         message.warning(
//           "Are you sure you want to proceed without adding any business images?"
//         );
//       }
//     }
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const currentImagesCount = formData.images.length;
//     const filesToAdd = files.slice(0, 5 - currentImagesCount);

//     if (files.length > filesToAdd.length) {
//       message.warn(
//         `You can only upload a maximum of 5 images. ${
//           files.length - filesToAdd.length
//         } image(s) were not added.`
//       );
//     }
//     setFormData((prev) => ({
//       ...prev,
//       images: [...prev.images, ...filesToAdd],
//     }));
//   };

//   const removeImage = (index) => {
//     const newImages = formData.images.filter((_, i) => i !== index);
//     setFormData((prev) => ({ ...prev, images: newImages }));
//   };

//   const handleCategorySelect = (event, value) => {
//     if (value) {
//       const selectedCategory = categories.find((cat) => cat.name === value);
//       if (selectedCategory) {
//         setFormData((prev) => ({
//           ...prev,
//           category: selectedCategory._id,
//         }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           category: value,
//         }));
//       }
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         category: "",
//       }));
//     }
//     setCategoryInput(value || "");
//   };

//   const handleSubmit = async () => {
//     setLoading(true);

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === "images") {
//         value.forEach((image) => data.append("images", image));
//       } else if (value !== undefined && value !== null) {
//         data.append(key, value);
//       }
//     });

//     data.append("userId", user?._id);
//     data.append("planName", planName);
//     data.append("planPrice", planPrice);
//     data.append("planId", planId);
//     data.append("socialLinks", JSON.stringify(links));

//     try {
//       const res = await axios.post("/api/v1/business/add", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         message.success("Your business has been successfully listed!");
//         setSuccess(true);
//         setFormData({
//           businessName: "",
//           ownerName: "",
//           phone: "",
//           email: "",
//           address: "",
//           state: "",
//           city: "",
//           category: "",
//           description: "",
//           images: [],
//         });
//         setLinks({
//           facebook: "",
//           instagram: "",
//           twitter: "",
//           linkedin: "",
//           website: "",
//           youtube: "",
//           whatsapp: "",
//         });
//         setCategoryInput("");
//         setCitiesList([]);
//       } else {
//         message.error(res.data.message || "Submission failed.");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       message.error(
//         error.response?.data?.message || "An error occurred during submission."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStepContent = (step) => {
//     const textFieldSx = {
//       mb: 3,
//       "& .MuiOutlinedInput-root": {
//         "& fieldset": {
//           borderColor: Colors.BLACK,
//         },
//         "&:hover fieldset": {
//           borderColor: Colors.LOGOlight,
//         },
//         "&.Mui-focused fieldset": {
//           borderColor: Colors.LOGOColor,
//         },
//       },
//       "& .MuiInputLabel-root": {
//         color: Colors.BLACK,
//       },
//       "& .MuiInputLabel-root.Mui-focused": {
//         color: Colors.LOGOColor,
//       },
//       "& .MuiInputBase-input": {
//         color: Colors.LOGOColor,
//       },
//     };

//     switch (step) {
//       case 0:
//         return (
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 required
//                 label="Business Name"
//                 name="businessName"
//                 value={formData.businessName}
//                 onChange={handleChange}
//                 variant="outlined"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Business sx={{ color: Colors.LOGOColor }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={textFieldSx}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 required
//                 label="Select State"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 variant="outlined"
//                 sx={{
//                   ...textFieldSx,
//                   minWidth: 280,
//                 }}
//                 SelectProps={{
//                   MenuProps: {
//                     PaperProps: {
//                       sx: {
//                         maxHeight: 300,
//                         width: 300,
//                       },
//                     },
//                   },
//                 }}
//               >
//                 {statesList.map((state) => (
//                   <MenuItem
//                     key={state.isoCode}
//                     value={state.name}
//                     sx={{ color: Colors.LOGOColor }}
//                   >
//                     {state.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {formData.state && (
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   select
//                   required
//                   label="Select City"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   variant="outlined"
//                   sx={{
//                     ...textFieldSx,
//                     minWidth: 280,
//                   }}
//                   SelectProps={{
//                     MenuProps: {
//                       PaperProps: {
//                         sx: {
//                           maxHeight: 300,
//                           width: 300,
//                         },
//                       },
//                     },
//                   }}
//                   disabled={citiesList.length === 0}
//                 >
//                   {citiesList.length > 0 ? (
//                     citiesList.map((city) => (
//                       <MenuItem
//                         key={city.name}
//                         value={city.name}
//                         sx={{ color: Colors.LOGOColor }}
//                       >
//                         {city.name}
//                       </MenuItem>
//                     ))
//                   ) : (
//                     <MenuItem
//                       value=""
//                       disabled
//                       sx={{ color: Colors.LOGOlight }}
//                     >
//                       No cities available for this state
//                     </MenuItem>
//                   )}
//                 </TextField>
//               </Grid>
//             )}

//             <Grid item xs={12}>
//               <Autocomplete
//                 freeSolo
//                 options={categories.map((category) => category.name)}
//                 inputValue={categoryInput}
//                 onInputChange={(event, newInputValue) => {
//                   setCategoryInput(newInputValue);
//                 }}
//                 onChange={handleCategorySelect}
//                 value={categoryInput}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Business Category"
//                     required
//                     placeholder="Search or type a new category"
//                     variant="outlined"
//                     sx={textFieldSx}
//                     InputProps={{
//                       ...params.InputProps,
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <Search sx={{ color: Colors.LOGOColor }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 )}
//                 renderOption={(props, option) => (
//                   <MenuItem
//                     {...props}
//                     key={option}
//                     sx={{ color: Colors.LOGOColor }}
//                   >
//                     {option}
//                   </MenuItem>
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Business Description (optional)"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 multiline
//                 rows={4}
//                 variant="outlined"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start" sx={{ mt: -7 }}>
//                       <Description sx={{ color: Colors.LOGOColor }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={textFieldSx}
//               />
//             </Grid>
//           </Grid>
//         );
//       case 1:
//         return (
//           <Grid container spacing={3}>
//             {[
//               { label: "Owner Name", name: "ownerName", icon: <Person /> },
//               {
//                 label: "Phone Number",
//                 name: "phone",
//                 icon: <Phone />,
//                 type: "tel",
//                 helperText:
//                   "Please include the country code, e.g. +91XXXXXXXXXX",
//               },
//               { label: "Email", name: "email", icon: <Email />, type: "email" },
//               {
//                 label: "Business Address",
//                 name: "address",
//                 icon: <Home />,
//                 multiline: true,
//                 rows: 2,
//               },
//             ].map((field, i) => (
//               <Grid item xs={12} key={i}>
//                 <TextField
//                   fullWidth
//                   required={field.name !== "email"}
//                   label={field.label}
//                   name={field.name}
//                   type={field.type || "text"}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   variant="outlined"
//                   multiline={field.multiline}
//                   rows={field.rows}
//                   helperText={field.helperText || ""}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         {React.cloneElement(field.icon, {
//                           sx: { color: Colors.LOGOColor },
//                         })}
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={textFieldSx}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         );
//       case 2:
//         return (
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <Box
//                 sx={{
//                   border: `2px dashed ${Colors.LOGOColor}`,
//                   borderRadius: 2,
//                   p: 4,
//                   textAlign: "center",
//                   backgroundColor: `${Colors.LOGOColor}10`,
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     backgroundColor: `${Colors.LOGOColor}20`,
//                     transform: "translateY(-2px)",
//                   },
//                 }}
//               >
//                 <input
//                   accept="image/*"
//                   style={{ display: "none" }}
//                   id="business-images"
//                   type="file"
//                   multiple
//                   onChange={handleImageChange}
//                 />
//                 <label htmlFor="business-images">
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Avatar
//                       sx={{
//                         bgcolor: `${Colors.LOGOColor}20`,
//                         width: 60,
//                         height: 60,
//                         mb: 2,
//                       }}
//                     >
//                       <PhotoCamera
//                         sx={{ fontSize: 30, color: Colors.LOGOColor }}
//                       />
//                     </Avatar>
//                     <Typography
//                       variant="h6"
//                       gutterBottom
//                       sx={{ color: Colors.LOGOColor }}
//                     >
//                       Upload Business Images
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{ mb: 2 }}
//                     >
//                       Drag & drop images here or click to browse (Max 5 images)
//                     </Typography>
//                     <Button
//                       variant="contained"
//                       startIcon={<Add />}
//                       component="span"
//                       disabled={formData.images.length >= 5}
//                       sx={{
//                         backgroundColor: Colors.LOGOlight,
//                         "&:hover": {
//                           backgroundColor: Colors.LOGOColor,
//                         },
//                       }}
//                     >
//                       Select Images
//                     </Button>
//                   </Box>
//                 </label>
//               </Box>

//               {formData.images.length > 0 && (
//                 <Box mt={3}>
//                   <Typography
//                     variant="subtitle2"
//                     gutterBottom
//                     sx={{ color: Colors.LOGOColor }}
//                   >
//                     Selected Images ({formData.images.length}/5)
//                   </Typography>
//                   <Grid container spacing={2}>
//                     {formData.images.map((img, idx) => (
//                       <Grid item xs={6} sm={4} md={3} key={idx}>
//                         <Card
//                           sx={{
//                             position: "relative",
//                             transition: "all 0.3s ease",
//                             "&:hover": {
//                               transform: "scale(1.03)",
//                               boxShadow: `0 4px 20px 0 ${Colors.LOGOlight}40`,
//                             },
//                           }}
//                         >
//                           <CardMedia
//                             component="img"
//                             height="140"
//                             image={URL.createObjectURL(img)}
//                             alt={img.name}
//                             sx={{ objectFit: "cover" }}
//                           />
//                           <IconButton
//                             size="small"
//                             onClick={() => removeImage(idx)}
//                             sx={{
//                               position: "absolute",
//                               top: 5,
//                               right: 5,
//                               backgroundColor: "rgba(0,0,0,0.5)",
//                               color: "white",
//                               "&:hover": {
//                                 backgroundColor: "rgba(0,0,0,0.7)",
//                               },
//                             }}
//                           >
//                             <Close fontSize="small" />
//                           </IconButton>
//                         </Card>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Box>
//               )}
//             </Grid>
//           </Grid>
//         );

//       case 3:
//         return (
//           <Box sx={{ mx: "auto", mt: 4 }}>
//             <Typography
//               variant="h5"
//               gutterBottom
//               sx={{ color: Colors.LOGOColor }}
//             >
//               Social Media Links
//             </Typography>

//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={3}>
//                 {socialPlatforms.map(({ name, icon, color }, i) => (
//                   <Grid item xs={12} sm={6} key={i}>
//                     <TextField
//                       fullWidth
//                       label={name.charAt(0).toUpperCase() + name.slice(1)}
//                       name={name}
//                       type="url"
//                       value={links[name]}
//                       onChange={handleChangeLinks}
//                       variant="outlined"
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             {React.cloneElement(icon, { sx: { color } })}
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         ...textFieldSx,
//                         "& .MuiInputBase-input": {
//                           color: Colors.LOGOColor,
//                         },
//                       }}
//                       placeholder={`https://${name}.com/your-profile`}
//                     />
//                   </Grid>
//                 ))}
//               </Grid>
//             </form>
//           </Box>
//         );
//       case 4:
//         return (
//           <Box
//             sx={{
//               p: 4,
//               border: `1px solid ${Colors.LOGOlight}`,
//               borderRadius: 3,
//               backgroundColor: "#f9f9f9",
//               boxShadow: `0 4px 20px 0 ${Colors.LOGOlight}20`,
//             }}
//           >
//             {/* Plan Information */}
//             <Box
//               sx={{
//                 mb: 4,
//                 p: 3,
//                 backgroundColor: `${Colors.LOGOColor}08`,
//                 borderRadius: 2,
//                 borderLeft: `4px solid ${Colors.LOGOColor}`,
//                 boxShadow: `0 2px 10px 0 ${Colors.LOGOlight}10`,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{
//                   mb: 2,
//                   color: Colors.LOGOColor,
//                   fontWeight: FontWeight.bold,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <Business sx={{ mr: 1, color: Colors.LOGOColor }} /> Selected
//                 Plan
//               </Typography>

//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <Typography
//                     variant="subtitle1"
//                     sx={{
//                       fontWeight: FontWeight.medium,
//                       color: Colors.LOGOlight,
//                     }}
//                   >
//                     Plan Name:
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       color: Colors.LOGOColor,
//                       fontWeight: FontWeight.bold,
//                     }}
//                   >
//                     {planName || "Not selected"}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography
//                     variant="subtitle1"
//                     sx={{
//                       fontWeight: FontWeight.medium,
//                       color: Colors.LOGOlight,
//                     }}
//                   >
//                     Plan Price:
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       color: Colors.LOGOColor,
//                       fontWeight: FontWeight.bold,
//                     }}
//                   >
//                     {planPrice ? `₹${planPrice}` : "Not selected"}
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </Box>

//             {/* Business Information Section */}
//             <Box sx={{ mb: 4 }}>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   mb: 2,
//                   color: Colors.LOGOColor,
//                   fontWeight: FontWeight.bold,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <Business sx={{ mr: 1, color: Colors.LOGOColor }} /> Business
//                 Information
//               </Typography>

//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <DetailItem
//                     label="Business Name"
//                     value={formData.businessName}
//                     icon={<Business sx={{ color: Colors.LOGOColor }} />}
//                   />
//                   <DetailItem
//                     label="Category"
//                     value={
//                       categories.find((c) => c._id === formData.category)
//                         ?.name || categoryInput
//                     }
//                     icon={<Search sx={{ color: Colors.LOGOColor }} />}
//                   />
//                   <DetailItem
//                     label="Description"
//                     value={formData.description || "Not provided"}
//                     icon={<Description sx={{ color: Colors.LOGOColor }} />}
//                     multiline
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <DetailItem
//                     label="Location"
//                     value={`${formData.city || ""}${
//                       formData.city && formData.state ? ", " : ""
//                     }${formData.state || ""}`}
//                     icon={<Home sx={{ color: Colors.LOGOColor }} />}
//                   />
//                 </Grid>
//               </Grid>
//             </Box>

//             <Divider sx={{ my: 3, borderColor: Colors.LOGOlight }} />

//             {/* Contact Information Section */}
//             <Box sx={{ mb: 4 }}>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   mb: 2,
//                   color: Colors.LOGOColor,
//                   fontWeight: FontWeight.bold,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <Person sx={{ mr: 1, color: Colors.LOGOColor }} /> Contact
//                 Information
//               </Typography>

//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <DetailItem
//                     label="Owner Name"
//                     value={formData.ownerName}
//                     icon={<Person sx={{ color: Colors.LOGOColor }} />}
//                   />
//                   <DetailItem
//                     label="Phone"
//                     value={formData.phone}
//                     icon={<Phone sx={{ color: Colors.LOGOColor }} />}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <DetailItem
//                     label="Email"
//                     value={formData.email || "Not provided"}
//                     icon={<Email sx={{ color: Colors.LOGOColor }} />}
//                   />
//                   <DetailItem
//                     label="Address"
//                     value={formData.address}
//                     icon={<Home sx={{ color: Colors.LOGOColor }} />}
//                     multiline
//                   />
//                 </Grid>
//               </Grid>
//             </Box>

//             <Divider sx={{ my: 3, borderColor: Colors.LOGOlight }} />

//             {/* Media Section */}
//             <Box sx={{ mb: 4 }}>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   mb: 2,
//                   color: Colors.LOGOColor,
//                   fontWeight: FontWeight.bold,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <PhotoCamera sx={{ mr: 1, color: Colors.LOGOColor }} /> Media
//               </Typography>

//               <Typography
//                 variant="subtitle1"
//                 sx={{ mb: 1, color: Colors.LOGOlight }}
//               >
//                 Images ({formData.images.length}/5)
//               </Typography>

//               {formData.images.length > 0 ? (
//                 <Grid container spacing={2}>
//                   {formData.images.map((img, index) => (
//                     <Grid item xs={6} sm={4} md={3} key={index}>
//                       <Card
//                         sx={{
//                           position: "relative",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             transform: "scale(1.03)",
//                             boxShadow: `0 4px 20px 0 ${Colors.LOGOlight}40`,
//                           },
//                         }}
//                       >
//                         <CardMedia
//                           component="img"
//                           height="140"
//                           image={
//                             typeof img === "string"
//                               ? img
//                               : URL.createObjectURL(img)
//                           }
//                           alt={`Business ${index}`}
//                           sx={{ objectFit: "cover" }}
//                         />
//                       </Card>
//                     </Grid>
//                   ))}
//                 </Grid>
//               ) : (
//                 <Typography variant="body2" color="text.secondary">
//                   No images uploaded
//                 </Typography>
//               )}
//             </Box>

//             <Divider sx={{ my: 3, borderColor: Colors.LOGOlight }} />

//             {/* Social Media Section */}
//             <Box>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   mb: 2,
//                   color: Colors.LOGOColor,
//                   fontWeight: FontWeight.bold,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <Share sx={{ mr: 1, color: Colors.LOGOColor }} /> Social Media
//                 Links
//               </Typography>

//               {Object.entries(links).some(([_, value]) => value) ? (
//                 <Grid container spacing={2}>
//                   {socialPlatforms.map(({ name, icon, color }) => {
//                     const url = links[name];
//                     if (!url) return null;

//                     return (
//                       <Grid item xs={12} sm={6} key={name}>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             p: 1.5,
//                             backgroundColor: "#f5f5f5",
//                             borderRadius: 1,
//                             transition: "all 0.3s ease",
//                             "&:hover": {
//                               transform: "translateY(-2px)",
//                               boxShadow: `0 2px 10px 0 ${color}20`,
//                             },
//                           }}
//                         >
//                           <Box sx={{ color, mr: 2 }}>{icon}</Box>
//                           <Link
//                             href={url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             sx={{
//                               color: Colors.LOGOColor,
//                               wordBreak: "break-all",
//                               "&:hover": {
//                                 color: Colors.LOGOlight,
//                               },
//                             }}
//                           >
//                             {url}
//                           </Link>
//                         </Box>
//                       </Grid>
//                     );
//                   })}
//                 </Grid>
//               ) : (
//                 <Typography variant="body2" color="text.secondary">
//                   No social media links provided
//                 </Typography>
//               )}
//             </Box>
//           </Box>
//         );
//       default:
//         return "Unknown step";
//     }
//   };

//   if (success) {
//     return (
//       <>
//         <Navbar />
//         <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
//           <Paper
//             elevation={3}
//             sx={{
//               p: 6,
//               borderRadius: 4,
//               background: `linear-gradient(135deg, ${Colors.LOGOlight}10, ${Colors.LOGOColor}10)`,
//             }}
//           >
//             <Box sx={{ mb: 4 }}>
//               <Avatar
//                 sx={{
//                   bgcolor: Colors.LOGOColor,
//                   width: 80,
//                   height: 80,
//                   mx: "auto",
//                 }}
//               >
//                 <CheckCircle sx={{ fontSize: 50, color: Colors.WHITE }} />
//               </Avatar>
//             </Box>
//             <Typography
//               variant="h4"
//               gutterBottom
//               sx={{ fontWeight: "bold", color: Colors.LOGOColor }}
//             >
//               Congratulations!
//             </Typography>
//             <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
//               Your business has been successfully listed.
//             </Typography>
//             <Button
//               variant="contained"
//               size="large"
//               onClick={() => {
//                 navigate("/plans");
//               }}
//               sx={{
//                 px: 6,
//                 py: 1.5,
//                 borderRadius: 2,
//                 fontWeight: "bold",
//                 textTransform: "none",
//                 fontSize: "1rem",
//                 backgroundColor: Colors.LOGOlight,
//                 "&:hover": {
//                   backgroundColor: Colors.LOGOColor,
//                 },
//               }}
//             >
//               List Another Business
//             </Button>
//           </Paper>
//         </Container>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <Container maxWidth="lg" sx={{ py: 6 }}>
//         {showLoginAlert && (
//           <MuiAlert
//             severity="warning"
//             sx={{
//               mb: 3,
//               backgroundColor: `${Colors.LOGOlight}20`,
//               color: Colors.LOGOColor,
//               border: `1px solid ${Colors.LOGOlight}`,
//             }}
//             onClose={() => setShowLoginAlert(false)}
//           >
//             You need to login to list your business
//           </MuiAlert>
//         )}
//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 3, md: 4 },
//             borderRadius: 4,
//             background: "#ffffff",
//             boxShadow: `0px 10px 30px ${Colors.LOGOlight}10`,
//             border: `1px solid ${Colors.LOGOlight}20`,
//           }}
//         >
//           <Box textAlign="center" mb={5}>
//             <Box
//               sx={{
//                 width: 100,
//                 height: 100,
//                 backgroundColor: `${Colors.LOGOColor}10`,
//                 borderRadius: "50%",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 mb: 3,
//                 boxShadow: `0 4px 20px 0 ${Colors.LOGOlight}20`,
//               }}
//             >
//               <Business sx={{ fontSize: 50, color: Colors.LOGOColor }} />
//             </Box>
//             <Typography
//               variant="h4"
//               fontWeight="bold"
//               gutterBottom
//               sx={{ color: Colors.LOGOColor }}
//             >
//               List Your Business
//             </Typography>
//             <Typography
//               variant="subtitle1"
//               color="text.secondary"
//               sx={{ maxWidth: 600, mx: "auto" }}
//             >
//               Join our community and showcase your business to thousands of
//               potential customers
//             </Typography>
//           </Box>

//           <Box sx={{ width: "100%", mb: 4 }}>
//             <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
//               {steps.map((label, index) => (
//                 <React.Fragment key={label}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Avatar
//                       sx={{
//                         width: 36,
//                         height: 36,
//                         bgcolor:
//                           activeStep >= index
//                             ? Colors.LOGOColor
//                             : "rgba(0, 0, 0, 0.12)",
//                         color:
//                           activeStep >= index
//                             ? Colors.WHITE
//                             : "rgba(0, 0, 0, 0.5)",
//                         fontWeight: "bold",
//                         boxShadow: `0 2px 10px 0 ${Colors.LOGOlight}20`,
//                       }}
//                     >
//                       {index + 1}
//                     </Avatar>
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         mt: 1,
//                         fontWeight: activeStep === index ? "bold" : "normal",
//                         color:
//                           activeStep >= index
//                             ? Colors.LOGOColor
//                             : "text.secondary",
//                       }}
//                     >
//                       {label}
//                     </Typography>
//                   </Box>
//                   {index !== steps.length - 1 && (
//                     <Box
//                       sx={{
//                         width: 50,
//                         height: 2,
//                         bgcolor:
//                           activeStep > index
//                             ? Colors.LOGOColor
//                             : "rgba(0, 0, 0, 0.12)",
//                         alignSelf: "center",
//                         mx: 1,
//                       }}
//                     />
//                   )}
//                 </React.Fragment>
//               ))}
//             </Box>
//           </Box>

//           <Box sx={{ mb: 4 }}>{getStepContent(activeStep)}</Box>

//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", sm: "row" },
//               justifyContent: "space-between",
//               alignItems: "center",
//               gap: 2,
//               mt: 3,
//             }}
//           >
//             <Button
//               disabled={activeStep === 0}
//               onClick={handleBack}
//               sx={{
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: 2,
//                 fontWeight: "bold",
//                 textTransform: "none",
//                 fontSize: "1rem",
//                 backgroundColor: Colors.LOGOlight,
//                 color: "white",
//                 width: { xs: "100%", sm: "auto" },
//                 "&:hover": {
//                   backgroundColor: Colors.LOGOColor,
//                 },
//                 "&:disabled": {
//                   backgroundColor: `${Colors.LOGOlight}50`,
//                 },
//               }}
//             >
//               Back
//             </Button>

//             {activeStep === steps.length - 1 ? (
//               <Button
//                 variant="contained"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 startIcon={
//                   loading ? (
//                     <CircularProgress size={24} color="inherit" />
//                   ) : null
//                 }
//                 sx={{
//                   px: 6,
//                   py: 1.5,
//                   borderRadius: 2,
//                   fontWeight: "bold",
//                   textTransform: "none",
//                   fontSize: "1rem",
//                   backgroundColor: Colors.LOGOlight,
//                   width: { xs: "100%", sm: "auto" },
//                   "&:hover": {
//                     backgroundColor: Colors.LOGOColor,
//                   },
//                   "&:disabled": {
//                     backgroundColor: `${Colors.LOGOlight}50`,
//                   },
//                 }}
//               >
//                 {loading ? "Submitting..." : "Review & Submit"}
//               </Button>
//             ) : (
//               <Button
//                 variant="contained"
//                 onClick={handleNext}
//                 sx={{
//                   px: 6,
//                   py: 1.5,
//                   borderRadius: 2,
//                   fontWeight: "bold",
//                   textTransform: "none",
//                   fontSize: "1rem",
//                   backgroundColor: Colors.LOGOlight,
//                   width: { xs: "100%", sm: "auto" },
//                   "&:hover": {
//                     backgroundColor: Colors.LOGOColor,
//                   },
//                 }}
//               >
//                 Next
//               </Button>
//             )}
//           </Box>
//         </Paper>
//       </Container>
//       <Footer />
//     </>
//   );
// };

// // Helper component for consistent detail items
// const DetailItem = ({ label, value, icon, multiline = false }) => (
//   <Box sx={{ mb: 2 }}>
//     <Typography
//       variant="subtitle2"
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         mb: 0.5,
//         color: Colors.LOGOlight,
//       }}
//     >
//       {React.cloneElement(icon, { sx: { fontSize: 16, mr: 1 } })}
//       {label}
//     </Typography>
//     {multiline ? (
//       <Typography
//         variant="body1"
//         sx={{
//           color: Colors.LOGOColor,
//           whiteSpace: "pre-line",
//           ml: 3,
//           lineHeight: 1.6,
//         }}
//       >
//         {value}
//       </Typography>
//     ) : (
//       <Typography
//         variant="body1"
//         sx={{
//           color: Colors.LOGOColor,
//           fontWeight: FontWeight.medium,
//           ml: 3,
//         }}
//       >
//         {value || "Not provided"}
//       </Typography>
//     )}
//   </Box>
// );

// export default ListYourBusiness;

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
import axios from '../../axiosInstance'
import Navbar from '../../Components/Navbar'
import { useSelector } from "react-redux";
import Footer from '../../Components/Footer'
import { useLocation, useNavigate } from "react-router-dom";
import { State, City } from "country-state-city";
import { Colors } from '../../Comman'
import BusinessInfoStep from '../List/BusinessInfoStep'
import ContactDetailsStep from '../List/ContactDetailsStep'
import ImagesStep from '../List/ImagesStep'
import SocialMediaStep from '../List/SocialMediaStep'
import ReviewSubmitStep from '../List/ReviewSubmitStep'
import SuccessView from '../List/SuccessView'
import StepperHeader from '../List/StepperHeader'
import { message } from "antd";

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
        formData.service.length === 0  // Added services validation
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
        !formData.city
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
      formData.service.length === 0
    ) {
      message.error("Please fill in all required fields.");
      return;
    }
  
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
        // Reset form data
        setFormData({
          businessName: "",
          ownerName: "",
          phone: "",
          email: "",
          services: [],
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