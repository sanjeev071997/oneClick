import React from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'

const SuccessView = ({ navigate, colors }) => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${colors.LOGOlight}10, ${colors.LOGOColor}10)`,
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Avatar
              sx={{
                bgcolor: colors.LOGOColor,
                width: 80,
                height: 80,
                mx: "auto",
              }}
            >
              <CheckCircle sx={{ fontSize: 50, color: "white" }} />
            </Avatar>
          </Box>
          <Typography variant="h4" gutterBottom sx={{ color: colors.LOGOColor }}>
            Congratulations!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Your business has been successfully listed.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/plans")}
            sx={{
              backgroundColor: colors.LOGOlight,
              "&:hover": { backgroundColor: colors.LOGOColor },
            }}
          >
            List Another Business
          </Button>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default SuccessView;