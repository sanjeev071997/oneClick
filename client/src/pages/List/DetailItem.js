import React from "react";
import { Box, Typography, Link } from "@mui/material";

const DetailItem = ({ label, value, icon, multiline = false, colors }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 0.5,
          color: colors.LOGOlight,
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 16, mr: 1 } })}
        {label}
      </Typography>
      {multiline ? (
        <Typography
          variant="body1"
          sx={{
            color: colors.LOGOColor,
            whiteSpace: "pre-line",
            ml: 3,
            lineHeight: 1.6,
          }}
        >
          {value}
        </Typography>
      ) : (
        <Typography
          variant="body1"
          sx={{
            color: colors.LOGOColor,
            fontWeight: "medium",
            ml: 3,
          }}
        >
          {value || "Not provided"}
        </Typography>
      )}
    </Box>
  );
};

export default DetailItem;