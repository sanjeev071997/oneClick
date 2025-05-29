import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
  Alert,
  Container,
  Divider,
  Tooltip
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
  LocationOn,
  ArrowForward,
  Favorite,
  RocketLaunch,
  Bolt,
  Verified
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

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
    { name: "Services", path: "/services", icon: <RocketLaunch fontSize="small" /> },
    { name: "About Us", path: "/about", icon: <Verified fontSize="small" /> },
    { name: "Contact", path: "/contact", icon: <Email fontSize="small" /> },
  ];

  const socialLinks = [
    { icon: <Facebook />, color: "#3b5998", url: "#", name: "Facebook" },
    { icon: <Twitter />, color: "#1da1f2", url: "#", name: "Twitter" },
    { icon: <Instagram />, color: "#e1306c", url: "#", name: "Instagram" },
    { icon: <YouTube />, color: "#ff0000", url: "#", name: "YouTube" }
  ];

  // Floating particles effect configuration
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2
  }));

  return (
    <Box sx={{ 
      mt:5,
      bgcolor: theme.palette.background.paper, 
      pt: 10, 
      pb: 4,
      position: 'relative',
      overflow: 'hidden',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      }
    }}>
      {/* Animated background particles */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.1
      }}>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              y: [particle.y, particle.y - 20],
              x: [particle.x, particle.x + (Math.random() * 10 - 5)]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            style={{
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* About Us */}
          <Grid item xs={12} sm={6} md={3}>
            <Slide direction="up" in timeout={800}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>
                  About Us
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Connecting customers with trusted local services across India.
                  Find professionals for all your home service needs.
                </Typography>
              </Box>
            </Slide>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Fade in timeout={1000}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>
                  Quick Links
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {quickLinks.map((link) => (
                    <motion.div
                      key={link.name}
                      onHoverStart={() => setHoveredLink(link.name)}
                      onHoverEnd={() => setHoveredLink(null)}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        href={link.path}
                        underline="none"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          "&:hover": { 
                            color: theme.palette.primary.main,
                            fontWeight: 600
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Box sx={{ 
                          mr: 1.5,
                          transform: hoveredLink === link.name ? 'rotate(360deg)' : 'none',
                          transition: 'transform 0.5s ease'
                        }}>
                          {link.icon}
                        </Box>
                        {link.name}
                        {hoveredLink === link.name && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            style={{ marginLeft: 'auto' }}
                          >
                            <ArrowForward fontSize="small" />
                          </motion.span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Contact & Social Icons */}
          <Grid item xs={12} sm={6} md={3}>
            <Slide direction="up" in timeout={1000}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>
                  Contact Us
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LocationOn sx={{ 
                      color: theme.palette.primary.main, 
                      mr: 1.5,
                      fontSize: '1.2rem'
                    }} />
                    <Typography variant="body2" color="text.secondary">
                      Bangalore, India
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Phone sx={{ 
                      color: theme.palette.primary.main, 
                      mr: 1.5,
                      fontSize: '1.2rem'
                    }} />
                    <Typography variant="body2" color="text.secondary">
                      +91 1800-123-456
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Email sx={{ 
                      color: theme.palette.primary.main, 
                      mr: 1.5,
                      fontSize: '1.2rem'
                    }} />
                    <Typography variant="body2" color="text.secondary">
                      hello@servizzy.com
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
                  {socialLinks.map((social, index) => (
                    <Tooltip title={social.name} key={index}>
                      <motion.div 
                        whileHover={{ 
                          y: -5,
                          scale: 1.1,
                          boxShadow: `0 5px 15px ${social.color}40`
                        }} 
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconButton
                          href={social.url}
                          target="_blank"
                          sx={{
                            color: 'white',
                            bgcolor: social.color,
                            "&:hover": { 
                              bgcolor: social.color,
                              transform: 'translateY(-3px)'
                            },
                            transition: 'all 0.3s ease',
                            borderRadius: '12px'
                          }}
                        >
                          {social.icon}
                        </IconButton>
                      </motion.div>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Slide>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Fade in timeout={1200}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>
                  Stay Updated
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Subscribe to our newsletter for the latest updates and offers.
                </Typography>
                
                <AnimatePresence>
                  {subscribed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Alert 
                        severity="success" 
                        sx={{ 
                          mb: 2,
                          borderRadius: '12px',
                          boxShadow: theme.shadows[2]
                        }}
                        icon={<Favorite color="success" />}
                      >
                        Thanks for subscribing! Check your inbox.
                      </Alert>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Box 
                        component="form" 
                        onSubmit={handleSubscribe} 
                        sx={{ 
                          display: "flex", 
                          gap: 1.5, 
                          flexDirection: isMobile ? "column" : "row",
                          alignItems: 'center'
                        }}
                      >
                        <TextField
                          size="small"
                          type="email"
                          placeholder="Your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          sx={{
                            flex: 1,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: '12px',
                              bgcolor: theme.palette.background.default,
                              "& fieldset": {
                                borderColor: theme.palette.divider,
                              },
                              "&:hover fieldset": {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                            "& .MuiInputBase-input": {
                              py: 1.5,
                            }
                          }}
                        />
                        <motion.div 
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowForward />}
                            sx={{
                              borderRadius: '12px',
                              px: 3,
                              py: 1.5,
                              textTransform: "none",
                              fontWeight: 600,
                              width: isMobile ? "100%" : "auto",
                              boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
                              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              '&:hover': {
                                boxShadow: `0 6px 24px ${theme.palette.primary.main}60`,
                              }
                            }}
                          >
                            Subscribe
                          </Button>
                        </motion.div>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Fade in timeout={1500}>
          <Box sx={{ 
            mt: 6, 
            pt: 3, 
            borderTop: `1px solid ${theme.palette.divider}`, 
            textAlign: "center",
            position: 'relative'
          }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'inline-block' }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                © {new Date().getFullYear()} <Box component="span" sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>OneClick</Box>. All rights reserved.
              </Typography>
            </motion.div>
            
           
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Footer;