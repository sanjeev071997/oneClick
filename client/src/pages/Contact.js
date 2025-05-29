import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Container,
  useTheme,
  useMediaQuery,
  Divider,
  Zoom,
  Slide
} from '@mui/material';
import axios from '../axiosInstance';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { motion } from 'framer-motion';
import { message } from 'antd';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const res = await axios.post('/api/v1/contact/add', formData);
      if (res.status === 200 || res.status === 201) {
        message.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{
        py: 8,
        minHeight: 'calc(100vh - 128px)',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #f5f7fa 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
   
          backgroundSize: 'cover',
          opacity: 0.03,
          zIndex: 0
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '2.5rem'
                  }
                }}
              >
                Let's Connect
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  mx: 'auto',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '1rem'
                  }
                }}
              >
                Have questions or want to discuss a project? Reach out to us and our team will get back to you within 24 hours.
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={500}>
                <Paper elevation={10} sx={{
                  p: 4,
                  borderRadius: 4,
                  height: 'auto',
                  background: theme.palette.mode === 'dark' ? 
                    'rgba(25, 28, 36, 0.8)' : 
                    'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: `0 20px 40px -10px ${theme.palette.mode === 'dark' ? 
                    'rgba(0, 0, 0, 0.4)' : 
                    'rgba(0, 0, 0, 0.1)'}`,
                  transformStyle: 'preserve-3d',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 25px 50px -10px ${theme.palette.mode === 'dark' ? 
                      'rgba(0, 0, 0, 0.5)' : 
                      'rgba(0, 0, 0, 0.15)'}`
                  },
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}>
                  <Typography variant="h4" gutterBottom sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: theme.palette.text.primary,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <ContactSupportIcon sx={{
                      fontSize: '2rem',
                      mr: 2,
                      color: theme.palette.secondary.main
                    }} />
                    Send a Message
                  </Typography>

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                      </Alert>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                      </Alert>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          sx={{ mb: 2 }}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              background: theme.palette.background.paper
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          sx={{ mb: 2 }}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              background: theme.palette.background.paper
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{ mb: 2 }}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              background: theme.palette.background.paper
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          label="Your Message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          sx={{ mb: 2 }}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              background: theme.palette.background.paper
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        color="secondary"
                        size="large"
                        endIcon={<SendIcon />}
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          py: 1.5,
                          px: 4,
                          fontSize: '1rem',
                          fontWeight: 600,
                          background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                          boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? 
                            'rgba(0, 0, 0, 0.3)' : 
                            'rgba(25, 118, 210, 0.2)'}`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.primary.dark} 100%)`
                          }
                        }}
                        fullWidth={isMobile}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </motion.div>
                  </form>
                </Paper>
              </Zoom>
            </Grid>

            <Grid item xs={12} md={6}>
              <Slide direction="up" in timeout={800}>
                <Box sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Paper elevation={10} sx={{
                     height: 'auto',
                    p: 4,
                    borderRadius: 4,
                    background: theme.palette.mode === 'dark' ? 
                      'rgba(25, 28, 36, 0.8)' : 
                      'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: `0 20px 40px -10px ${theme.palette.mode === 'dark' ? 
                      'rgba(0, 0, 0, 0.4)' : 
                      'rgba(0, 0, 0, 0.1)'}`
                  }}>
                    <Typography variant="h4" gutterBottom sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: theme.palette.text.primary
                    }}>
                      Contact Information
                    </Typography>

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.palette.action.hover,
                        transform: 'translateX(5px)'
                      }
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        mr: 3,
                        flexShrink: 0
                      }}>
                        <LocationOnIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Our Address</Typography>
                        <Typography variant="body1" color="text.secondary">123 Business Avenue</Typography>
                        <Typography variant="body1" color="text.secondary">San Francisco, CA 94107</Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.palette.action.hover,
                        transform: 'translateX(5px)'
                      }
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
                        mr: 3,
                        flexShrink: 0
                      }}>
                        <PhoneIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Phone Number</Typography>
                        <Typography variant="body1" color="text.secondary">+1 (555) 123-4567</Typography>
                        <Typography variant="body1" color="text.secondary">Mon-Fri: 9am-6pm PST</Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.palette.action.hover,
                        transform: 'translateX(5px)'
                      }
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
                        mr: 3,
                        flexShrink: 0
                      }}>
                        <EmailIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Email Address</Typography>
                        <Typography variant="body1" color="text.secondary">info@yourcompany.com</Typography>
                        <Typography variant="body1" color="text.secondary">support@yourcompany.com</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ContactUs;