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
  Fade,
  Divider
} from '@mui/material';
import axios from '../axiosInstance';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

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
    setSuccess('');
    setError('');
    setIsSubmitting(true);

    try {
      const res = await axios.post('/api/v1/contact/add', formData);
      if (res.status === 200 || res.status === 201) {
        setSuccess('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ 

        py: 8,
        minHeight: 'calc(100vh - 128px)'
      }}>
        <Container maxWidth="lg">
          <Fade in timeout={500}>
            <Box>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  textAlign: 'center',
                  mb: 4,
                  color: theme.palette.primary.dark,
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '2rem'
                  }
                }}
              >
                <ContactSupportIcon sx={{ 
                  fontSize: '2.5rem', 
                  verticalAlign: 'middle', 
                  mr: 2,
                  color: theme.palette.secondary.main
                }} />
                Get In Touch
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={6} sx={{ 
                    p: 4, 
                    borderRadius: 3,
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(5px)'
                  }}>
                    <Typography variant="h5" gutterBottom sx={{ 
                      fontWeight: 600,
                      mb: 3,
                      color: theme.palette.primary.main
                    }}>
                      Send us a message
                    </Typography>

                    {success && (
                      <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                      </Alert>
                    )}
                    {error && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                      </Alert>
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
                              sx: { borderRadius: 2 }
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
                              sx: { borderRadius: 2 }
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
                            required
                            variant="outlined"
                            sx={{ mb: 2 }}
                            InputProps={{
                              sx: { borderRadius: 2 }
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
                              sx: { borderRadius: 2 }
                            }}
                          />
                        </Grid>
                      </Grid>

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
                          fontSize: '1rem',
                          fontWeight: 600,
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                        fullWidth={isMobile}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h5" gutterBottom sx={{ 
                      fontWeight: 600,
                      mb: 3,
                      color: theme.palette.primary.main
                    }}>
                      Contact Information
                    </Typography>

                    <Box sx={{ 
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 3,
                      p: 4,
                      boxShadow: theme.shadows[3]
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <LocationOnIcon color="primary" sx={{ fontSize: '2rem', mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Our Address</Typography>
                          <Typography variant="body1">123 Business Ave, Suite 400</Typography>
                          <Typography variant="body1">San Francisco, CA 94107</Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <PhoneIcon color="primary" sx={{ fontSize: '2rem', mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Phone Number</Typography>
                          <Typography variant="body1">+1 (555) 123-4567</Typography>
                          <Typography variant="body1">Mon-Fri: 9am-6pm</Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <EmailIcon color="primary" sx={{ fontSize: '2rem', mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Email Address</Typography>
                          <Typography variant="body1">info@yourcompany.com</Typography>
                          <Typography variant="body1">support@yourcompany.com</Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                    </Box>

                   
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ContactUs;