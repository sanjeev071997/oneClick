import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { Business } from "@mui/icons-material";

const StepperHeader = ({ steps, activeStep, colors }) => {
  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        {steps.map((label, index) => (
          <React.Fragment key={label}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: activeStep >= index ? colors.LOGOColor : "rgba(0, 0, 0, 0.12)",
                  color: activeStep >= index ? "white" : "rgba(0, 0, 0, 0.5)",
                }}
              >
                {index + 1}
              </Avatar>
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  fontWeight: activeStep === index ? "bold" : "normal",
                  color: activeStep >= index ? colors.LOGOColor : "text.secondary",
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
                  bgcolor: activeStep > index ? colors.LOGOColor : "rgba(0, 0, 0, 0.12)",
                  alignSelf: "center",
                  mx: 1,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default StepperHeader;