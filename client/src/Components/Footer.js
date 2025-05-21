import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#f8f8f8", mt: 5, pt: 5, pb: 3 }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Column 1: Company Info */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" ,ml:2}}>
            About Us
          </Typography>
          <Typography variant="body2"  sx={{ ml:2}}>
            We connect customers with trusted local services across India. Find
            electricians, plumbers, caterers and more near you.
          </Typography>
        </Grid>

        {/* Column 2: Quick Links */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold",ml:2 }}>
            Quick Links
          </Typography >
          {["Home", "Services", "Categories", "Contact", "Help"].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              underline="hover"
              color="text.secondary"
              display="block"
              sx={{ mb: 1,ml:2 }}
            >
              {link}
            </Link>
          ))}
        </Grid>

        {/* Column 3: Contact Info */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold",ml:2 }}>
            Contact
          </Typography>
          <Typography variant="body2" sx={{ ml:2 }}>📍 India</Typography>
          <Typography variant="body2" sx={{ ml:2 }}>📞 1800-123-456</Typography>
          <Typography variant="body2" sx={{ ml:2 }}>📧 support@yourdomain.com</Typography>

          <Box sx={{ mt: 2,}}>
            <IconButton>
              <FacebookIcon sx={{ color: "#3b5998" }} />
            </IconButton>
            <IconButton>
              <TwitterIcon sx={{ color: "#1da1f2" }} />
            </IconButton>
            <IconButton>
              <InstagramIcon sx={{ color: "#e1306c" }} />
            </IconButton>
            <IconButton>
              <YouTubeIcon sx={{ color: "#ff0000" }} />
            </IconButton>
          </Box>
        </Grid>

        {/* Column 4: Newsletter */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold",mr:2,ml:2 }}>
            Stay Updated
          </Typography>
          <Typography variant="body2" sx={{ mr:2,ml:2  }}>
            Subscribe to our newsletter to get the latest updates and offers.
          </Typography>
          <Box sx={{ mt: 2, display: "flex", gap: 1,mr:2,ml:2 }}>
            <TextField
              size="small"
              placeholder="Enter your email"
              sx={{ bgcolor: "white", flex: 1 }}
            />
            <Button variant="contained" color="success">
              Subscribe
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom section */}
      <Box
        sx={{
          mt: 5,
          pt: 2,
          borderTop: "1px solid #ddd",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} YourWebsite. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
