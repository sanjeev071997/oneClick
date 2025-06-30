import React from "react";
import {
  Grid,
  TextField,
  InputAdornment,
  Autocomplete,
  MenuItem,
  Chip,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  Business,
  Search,
  Description,
  Add,
  BusinessCenter,
} from "@mui/icons-material";

const BusinessInfoStep = ({
  formData,
  setFormData,
  categories,
  categoryInput,
  setCategoryInput,
  colors,
}) => {
  const [serviceInput, setServiceInput] = React.useState("");
  const [service, setService] = React.useState(formData.service || []);
  // const [businessTime, setBusinessTime] = React.useState(dayjs("2022-04-17T15:30"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (event, value) => {
    if (value) {
      const selectedCategory = categories.find((cat) => cat.name === value);
      setFormData((prev) => ({
        ...prev,
        category: selectedCategory ? selectedCategory._id : value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, category: "" }));
    }
    setCategoryInput(value || "");
  };

  const handleAddService = () => {
    if (serviceInput.trim() && !service.includes(serviceInput.trim())) {
      const newServices = [...service, serviceInput.trim()];
      setService(newServices);
      setFormData((prev) => ({ ...prev, service: newServices }));
      setServiceInput("");
    }
  };

  const handleDeleteService = (serviceToDelete) => {
    const newServices = service.filter(
      (service) => service !== serviceToDelete
    );
    setService(newServices);
    setFormData((prev) => ({ ...prev, service: newServices }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddService();
    }
  };

  const textFieldSx = {
    mb: 3,
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: colors.BLACK },
      "&:hover fieldset": { borderColor: colors.LOGOlight },
      "&.Mui-focused fieldset": { borderColor: colors.LOGOColor },
    },
    "& .MuiInputLabel-root": { color: colors.BLACK },
    "& .MuiInputLabel-root.Mui-focused": { color: colors.LOGOColor },
    "& .MuiInputBase-input": { color: colors.LOGOColor },
  };

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
                <Business sx={{ color: colors.LOGOColor }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldSx}
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
                    <Search sx={{ color: colors.LOGOColor }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <MenuItem {...props} key={option} sx={{ color: colors.LOGOColor }}>
              {option}
            </MenuItem>
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Services"
          value={serviceInput}
          onChange={(e) => setServiceInput(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          placeholder="Add a service and press Enter"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Add sx={{ color: colors.LOGOColor }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip
                  label="Add"
                  onClick={handleAddService}
                  sx={{
                    backgroundColor: colors.LOGOlight,
                    color: colors.WHITE,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: colors.LOGOColor,
                    },
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={textFieldSx}
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {service.map((service, index) => (
            <Chip
              key={index}
              label={service}
              onDelete={() => handleDeleteService(service)}
              sx={{
                backgroundColor: colors.LOGOlight,
                color: colors.WHITE,
                "& .MuiChip-deleteIcon": {
                  color: colors.WHITE,
                  "&:hover": {
                    color: colors.LOGOColor,
                  },
                },
              }}
            />
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} mt={-2}>
        <TextField
          fullWidth
          required
          label="Business Experience"
          name="businessExperience"
          value={formData.businessExperience}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessCenter sx={{ color: colors.LOGOColor }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldSx}
        />
      </Grid>
      
      <Grid item xs={12} mt={-2} mb={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" gap={2}>
            <TimePicker
              label="Open Time"
              value={formData.openTime}
              onChange={(newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  openTime: newValue,
                }));
              }}
              sx={{ flex: 1 }}
            />
            <TimePicker
              label="Close Time"
              value={formData.closeTime}
              onChange={(newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  closeTime: newValue,
                }));
              }}
              sx={{ flex: 1 }}
            />
          </Box>
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Business Description (optional)"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mt: -7 }}>
                <Description sx={{ color: colors.LOGOColor }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldSx}
        />
      </Grid>
    </Grid>
  );
};

export default BusinessInfoStep;
