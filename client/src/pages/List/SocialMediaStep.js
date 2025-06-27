import React from "react";
import { Box, Typography, Grid, TextField, InputAdornment } from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Language,
  YouTube,
  WhatsApp,
} from "@mui/icons-material";

const socialPlatforms = [
  { name: "facebook", icon: <Facebook />, color: "#1877F2" },
  { name: "instagram", icon: <Instagram />, color: "#E4405F" },
  { name: "twitter", icon: <Twitter />, color: "#1DA1F2" },
  { name: "linkedin", icon: <LinkedIn />, color: "#0A66C2" },
  { name: "website", icon: <Language />, color: "#1976d2" },
  { name: "youtube", icon: <YouTube />, color: "#FF0000" },
  { name: "whatsapp", icon: <WhatsApp />, color: "#25D366" },
];

const SocialMediaStep = ({ links, setLinks, colors }) => {
  const handleChangeLinks = (e) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: colors.LOGOColor }}>
        Social Media Links
      </Typography>

      <Grid container spacing={3}>
        {socialPlatforms.map(({ name, icon, color }, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <TextField
              fullWidth
              label={name.charAt(0).toUpperCase() + name.slice(1)}
              name={name}
              type="url"
              value={links[name]}
              onChange={handleChangeLinks}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {React.cloneElement(icon, { sx: { color } })}
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiInputBase-input": { color: colors.LOGOColor },
              }}
              placeholder={`https://${name}.com/your-profile`}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SocialMediaStep;