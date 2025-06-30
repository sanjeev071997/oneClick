import React from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import {
  Close,
  Edit,
  AddPhotoAlternate,
  LinkedIn,
  YouTube,
  WhatsApp,
  Twitter,
  Facebook,
  Instagram,
  Link as LinkIcon,
} from "@mui/icons-material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Colors } from "../../Comman";

const EditBusinessUser = ({
  openDialog,
  dialogType,
  handleCloseDialog,
  activeTab,
  setActiveTab,
  formData,
  handleChange,
  categories,
  categoryInput,
  setCategoryInput,
  handleCategorySelect,
  serviceInput,
  setServiceInput,
  handleAddService,
  handleDeleteService,
  states,
  cities,
  handleUpdate,
  loading,
  newImages,
  handleRemoveImage,
  handleImageUpload,
  setFormData,
}) => {
  return (
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
          label="Business Info"
          sx={{
            fontWeight: 600,
            color: activeTab === 0 ? Colors.LOGOColor : "text.secondary",
          }}
        />
        <Tab
          label="Contact Details"
          sx={{
            fontWeight: 600,
            color: activeTab === 1 ? Colors.LOGOColor : "text.secondary",
          }}
        />
        <Tab
          label="Social Links"
          sx={{
            fontWeight: 600,
            color: activeTab === 2 ? Colors.LOGOColor : "text.secondary",
          }}
        />
        <Tab
          label="Media"
          sx={{
            fontWeight: 600,
            color: activeTab === 3 ? Colors.LOGOColor : "text.secondary",
          }}
        />
      </Tabs>

      <DialogContent dividers sx={{ p: 0 }}>
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} mb={-3}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Business Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Business Name"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
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
                      label="Category"
                      margin="normal"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Business Experience"
                  name="businessExperience"
                  value={formData.businessExperience}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Add Service"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddService();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={handleAddService}
                          disabled={!serviceInput.trim()}
                          size="small"
                        >
                          Add
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  margin="normal"
                  size="small"
                />

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {formData?.service.map((service, index) => (
                    <Chip
                      key={index}
                      label={service}
                      onDelete={() => handleDeleteService(service)}
                      sx={{
                        backgroundColor: Colors.LOGOlight,
                        color: "white",
                      }}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box display="flex" gap={2}>
                    <TimePicker
                      label="Open Time"
                      value={
                        formData?.openTime ? dayjs(formData.openTime) : null
                      }
                      onChange={(newValue) =>
                        setFormData((prev) => ({
                          ...prev,
                          openTime: newValue,
                        }))
                      }
                      sx={{ flex: 1 }}
                    />
                    <TimePicker
                      label="Close Time"
                      value={
                        formData?.closeTime ? dayjs(formData.closeTime) : null
                      }
                      onChange={(newValue) =>
                        setFormData((prev) => ({
                          ...prev,
                          closeTime: newValue,
                        }))
                      }
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
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
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Contact & Location
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  sx={{ mt: 4 }}
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={formData.state || ""}
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

                <FormControl
                  fullWidth
                  margin="normal"
                  size="small"
                  sx={{ mt: 4 }}
                >
                  <InputLabel>City</InputLabel>
                  <Select
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    label="City"
                    disabled={!formData.state}
                  >
                    {cities.length > 0 ? (
                      cities.map((city) => (
                        <MenuItem key={city.name} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        {formData.state
                          ? "No cities available"
                          : "Select state first"}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} mt={-1}>
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
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Social Media Links
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Linkedin"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedIn color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Youtube"
                  name="socialLinks.youtube"
                  value={formData.socialLinks.youtube}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <YouTube color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Whatsapp"
                  name="socialLinks.whatsapp"
                  value={formData.socialLinks.whatsapp}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WhatsApp color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Twitter"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Twitter color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
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
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 3 && (
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
              Upload up to 5
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
  );
};

export default EditBusinessUser;
