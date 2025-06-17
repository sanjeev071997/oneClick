import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
  Stack,
  Avatar
} from '@mui/material';
import axios from '../axiosInstance';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import { message } from 'antd';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { Colors } from '../Comman';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

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
      <Box
        sx={{
          py: { xs: 4, md: 8 },
          minHeight: 'calc(100vh - 128px)',
          backgroundColor: Colors.primaryLight,
        }}
      >
        <Container >
          {/* Hero Section */}
          <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
            <Chip 
              label="Get in touch" 
              size="medium"
              sx={{ 
                mb: 2, 
                px: 2, 
                py: 1.5, 
                fontSize: '0.8rem',
                backgroundColor: Colors.LOGOlight,
                color: Colors.LOGOColor
              }}
            />
            <Typography
              variant={isMobile ? "h3" : "h4"}
              component="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: Colors.LOGOColor,
                mb: 2,
              }}
            >
              Contact Our Team
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              We're here to help and answer any questions you might have. 
              Reach out to us and we'll respond as soon as possible.
            </Typography>
          </Box>

          {/* Contact Card */}
          <Paper
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              backgroundColor: 'background.paper',
              boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 8,
                background: `linear-gradient(90deg, ${Colors.LOGOColor}, ${Colors.LOGOlight})`,
              }
            }}
          >
            <Grid container spacing={4}>
              {/* Contact Information */}
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: Colors.LOGOColor,
                      mb: 3,
                    }}
                  >
                    Let's talk about everything!
                  </Typography>

                  <Stack spacing={3}>
                    <Box>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar sx={{ 
                          bgcolor: Colors.LOGOlight, 
                          width: 40, 
                          height: 40,
                          '& .MuiSvgIcon-root': {
                            color: 'white'
                          }
                        }}>
                          <LocationOnIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Our Location
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            123 Tech Park, Silicon Valley<br />
                            San Francisco, CA 94107<br />
                            United States
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Divider />

                    <Box>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar sx={{ 
                          bgcolor: Colors.LOGOlight, 
                          width: 40, 
                          height: 40,
                          '& .MuiSvgIcon-root': {
                            color: 'white'
                          }
                        }}>
                          <PhoneIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Phone Numbers
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            +1 (555) 987-6543 (Main)<br />
                            +1 (555) 123-4567 (Support)
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Divider />

                    <Box>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar sx={{ 
                          bgcolor: Colors.LOGOlight, 
                          width: 40, 
                          height: 40,
                          '& .MuiSvgIcon-root': {
                            color: 'white'
                          }
                        }}>
                          <EmailIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Email Addresses
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            info@yourcompany.com<br />
                            support@yourcompany.com
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* Contact Form */}
              <Grid item xs={12} md={7}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: Colors.LOGOColor,
                      mb: 3,
                    }}
                  >
                    Send us a message
                  </Typography>

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: Colors.LOGOlight,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: Colors.LOGOlight,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: Colors.LOGOlight,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: Colors.LOGOlight,
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                    
                    <TextField
                      fullWidth
                      label="Phone Number (Optional)"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: Colors.LOGOlight,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: Colors.LOGOlight,
                        }
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: Colors.LOGOlight,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: Colors.LOGOlight,
                        }
                      }}
                    />

                    <Button
                      variant="contained"
                      type="submit"
                      size="large"
                      endIcon={<SendIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        px: 4,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        backgroundColor: Colors.LOGOColor,
                        '&:hover': {
                          backgroundColor: Colors.LOGOlight,
                        }
                      }}
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ContactUs;