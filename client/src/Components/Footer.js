import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  IconButton,
  Container,
  Tooltip,
  Alert
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Favorite,
  Bolt,
  Verified
} from "@mui/icons-material";
import logo from '../Images/LOGO1.png';

import { Colors, FontFamily, FontWeight } from "../Comman";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { name: "Home", path: "/", icon: <Bolt fontSize="small" /> },
    { name: "About Us", path: "/about", icon: <Verified fontSize="small" /> },
    { name: "Contact", path: "/contact", icon: <Email fontSize="small" /> },
    { name: "Plans", path: "/plans", icon: <AttachMoneyIcon fontSize="small" /> },
  ];

  const socialLinks = [
    { icon: <Facebook />, color: "#3b5998", url: "#", name: "Facebook" },
    { icon: <Twitter />, color: "#1da1f2", url: "#", name: "Twitter" },
    { icon: <Instagram />, color: "#e1306c", url: "#", name: "Instagram" },
    { icon: <YouTube />, color: "#ff0000", url: "#", name: "YouTube" }
  ];

  return (
    <Box sx={{
      ml:5,
      mr:5,
      mt: 5,
      bgcolor: Colors.WHITE,
      pt: 5,
      pb: 4,
      borderTop: `4px solid ${Colors.LOGOColor}`
    }}>
      <Container maxWidth="xxl">
        <Grid container spacing={4}>
          {/* Logo and About Us */}
          <Grid item xs={12} md={3}> 
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Logo Box */}
              <Box>
                <img
                  src={logo}
                  alt="Company Logo"
                  style={{ width: '180px' }}
                />
              </Box>
            </Box>
            <Box>
                <Typography
                  variant="body2"
                  color={Colors.LOGOColor}
                  sx={{ lineHeight: 1.5, fontFamily: FontFamily.arial, fontWeight:FontWeight.heading2,mt:3,letterSpacing:1 }}
                >
                  Connecting customers with trusted local services across India. Find professionals for all your home service needs.
                </Typography>
              </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3} > 
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: Colors.LOGOColor, fontFamily: FontFamily.arial }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  underline="none"
                  color={Colors.LOGOColor}
                  sx={{
                    fontFamily: FontFamily.arial,
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      color: Colors.LOGOlight,
                      fontWeight: FontWeight.heading2
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Box sx={{ mr: 1 }}>{link.icon}</Box>
                  {link.name}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact & Social Icons */}
          <Grid item xs={12} sm={6} md={3}> 
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: Colors.LOGOColor, fontFamily: FontFamily.arial, }}>
              Contact Us
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOn sx={{ color: Colors.LOGOColor, mr: 1, fontSize: '1rem' }} />
                <Typography variant="body2" color={Colors.LOGOColor}>Bangalore, India</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Phone sx={{ color: Colors.LOGOColor, mr: 1, fontSize: '1rem' }} />
                <Typography variant="body2" color={Colors.LOGOColor}>+91 1800-123-456</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Email sx={{ color: Colors.LOGOColor, mr: 1, fontSize: '1rem' }} />
                <Typography variant="body2" color={Colors.LOGOColor}>hello@servizzy.com</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {socialLinks.map((social, index) => (
                <Tooltip title={social.name} key={index}>
                  <IconButton
                    href={social.url}
                    target="_blank"
                    sx={{
                      color: 'white',
                      bgcolor: social.color,
                      "&:hover": { bgcolor: social.color },
                      borderRadius: '8px'
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: Colors.LOGOColor }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" color={Colors.LOGOColor} sx={{ mb: 2 }}>
              Subscribe to our newsletter for the latest updates and offers.
            </Typography>

            {subscribed ? (
              <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }} icon={<Favorite color="success" />}>
                Thanks for subscribing! Check your inbox.
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubscribe} sx={{ display: "block" }}>
                <TextField
                  size="small"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: '8px',
                      "& fieldset": {
                        borderColor: Colors.LOGOColor,
                      },
                      "&:hover fieldset": {
                        borderColor: Colors.LOGOlight,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: Colors.LOGOlight,
                      },
                    },
                    "& .MuiInputBase-input": {
                      py: 1,
                      color: Colors.LOGOColor,
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: '8px',
                    py: 1,
                    fontFamily: FontFamily.arial,
                    textTransform: "none",
                    fontWeight: FontWeight.heading2,
                    color: Colors.WHITE,
                    backgroundColor: Colors.LOGOlight
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ mt: 4, pt: 2, borderTop: `1px solid ${Colors.LOGOColor}`, textAlign: "center" }}>
          <Typography variant="body2" color={Colors.LOGOColor}>
            © {new Date().getFullYear()} Quickdials. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box >
  );
};

export default Footer;