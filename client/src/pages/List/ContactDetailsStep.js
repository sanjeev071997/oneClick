import React from "react";
import {
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { Person, Phone, Email, Home } from "@mui/icons-material";

const ContactDetailsStep = ({
  formData,
  setFormData,
  statesList,
  citiesList,
  colors,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      {/* Owner Name */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          label="Owner Name"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: colors.LOGOColor }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldSx}
        />
      </Grid>

      {/* Phone Number */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          variant="outlined"
          helperText="Please include the country code, e.g. +91XXXXXXXXXX"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone sx={{ color: colors.LOGOColor }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldSx}
        />
      </Grid>

      {/* Email */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: colors.LOGOColor }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldSx}
        />
      </Grid>

      {/* State and City - Side by Side on larger screens */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          select
          required
          label="Select State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          variant="outlined"
          sx={textFieldSx}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 300,
                },
              },
            },
          }}
        >
          {statesList.map((state) => (
            <MenuItem
              key={state.isoCode}
              value={state.name}
              sx={{ color: colors.LOGOColor }}
            >
              {state.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          select
          required
          label="Select City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          variant="outlined"
          sx={textFieldSx}
          disabled={!formData.state || citiesList.length === 0}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 300,
                },
              },
            },
          }}
        >
          {citiesList.length > 0 ? (
            citiesList.map((city) => (
              <MenuItem
                key={city.name}
                value={city.name}
                sx={{ color: colors.LOGOColor }}
              >
                {city.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled sx={{ color: colors.LOGOlight }}>
              {formData.state ? "No cities available" : "Select state first"}
            </MenuItem>
          )}
        </TextField>
      </Grid>

      {/* Address - Last */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          label="Business Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          variant="outlined"
          multiline
          rows={2}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home sx={{ color: colors.LOGOColor }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldSx}
        />
      </Grid>
    </Grid>
  );
};

export default ContactDetailsStep;