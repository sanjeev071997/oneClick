import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Stack,
  IconButton,
  CircularProgress,

  useTheme
} from '@mui/material';
import {
  LocationOn,
  Email,
  Phone,
  Person,
  Send,
  Language,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn
} from '@mui/icons-material';
import { message } from 'antd';
import axios from '../../axiosInstance';
import { Colors } from '../../Comman';
const BusinessContact = ({ business }) => {

  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    name:  '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post('/api/v1/enquiry/add', {
        ...formData,
        businessId: business._id,
      });

      if (response.data.success) {
        message.success('Your message has been sent successfully!');
        setFormData(prev => ({ ...prev, message: '' }));
      } else {
        message.error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('An error occurred while sending your message');
    } finally {
      setSubmitting(false);
    }
  };
  const renderSocialLinks = (links = {}) => {
    const icons = {
      facebook: { icon: Facebook, color: '#1877F2' },
      instagram: { icon: Instagram, color: '#E4405F' },
      twitter: { icon: Twitter, color: '#1DA1F2' },
      linkedin: { icon: LinkedIn, color: '#0A66C2' },
      website: { icon: Language, color: Colors.LOGOColor },
    };

    return Object.entries(links).map(([key, url]) => {
      const { icon: Icon, color } = icons[key.toLowerCase()] || { icon: Language, color: Colors.LOGOColor };
      return (
        url && (
          <IconButton
            key={key}
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: color,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              '&:hover': { 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out',
              mx: 0.5
            }}
          >
            <Icon fontSize="small" />
          </IconButton>
        )
      );
    });
  };
  return (
    <Card sx={{ 
      borderRadius: 3, 
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{
          background: `linear-gradient(135deg, ${Colors.LOGOlight}, ${Colors.LOGOColor})`,
          py: 3,
          px: 4,
          color: 'white'
        }}>
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: 'bold',
              fontFamily: `'Poppins', 'Roboto', 'Helvetica', sans-serif'`,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Contact Information
          </Typography>
        </Box>

        <Grid container spacing={0}>
          {/* Business Info Column */}
          <Grid item xs={12} md={6} sx={{
            borderRight: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            [theme.breakpoints.down('md')]: { borderRight: 'none', borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }
          }}>
            <Box sx={{ p: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ 
                  fontWeight: 'bold', 
                  color: Colors.LOGOColor,
                  display: 'flex',
                  alignItems: 'center',
                  '&:after': {
                    content: '""',
                    flex: 1,
                    ml: 2,
                    height: '1px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                  }
                }}
              >
                Business Details
              </Typography>

              <Stack spacing={3} mt={3}>
                <Box display="flex" alignItems="center">
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: Colors.LOGOlight + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <Person sx={{ color: Colors.LOGOColor }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Owner</Typography>
                    <Typography fontWeight="500">{business?.ownerName}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: Colors.LOGOlight + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <Email sx={{ color: Colors.LOGOColor }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography fontWeight="500">{business?.email}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: Colors.LOGOlight + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <Phone sx={{ color: Colors.LOGOColor }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography fontWeight="500">{business?.phone}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="flex-start">
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: Colors.LOGOlight + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    flexShrink: 0
                  }}>
                    <LocationOn sx={{ color: Colors.LOGOColor }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography fontWeight="500">
                      {business?.address}
                      {business?.city && `, ${business.city}`}
                      {business?.state && `, ${business.state}`}
                    </Typography>
                  </Box>
                </Box>

                {business?.socialLinks && (
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary" mb={1}>Connect With Us</Typography>
                    <Box display="flex">
                      {renderSocialLinks(business.socialLinks)}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Box>
          </Grid>

          {/* Contact Form Column */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ 
                  fontWeight: 'bold', 
                  color: Colors.LOGOColor,
                  display: 'flex',
                  alignItems: 'center',
                  '&:after': {
                    content: '""',
                    flex: 1,
                    ml: 2,
                    height: '1px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                  }
                }}
              >
                Send a Message
              </Typography>

              <Box component="form" onSubmit={handleSubmit} mt={3}>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                  required
                  variant="outlined"
                  size="small"
                  sx={{ mb: 3 }}
                />

                <Box mt={4} display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    endIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    sx={{
                      background: `linear-gradient(135deg, ${Colors.LOGOlight}, ${Colors.LOGOColor})`,
                      px: 4,
                      py: 1,
                      borderRadius: 2,
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      '&:hover': {
                        boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease',
                      minWidth: 150
                    }}
                  >
                    {submitting ? 'Sending...' : 'Send'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BusinessContact;