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
  Chip,
  Link,
  CircularProgress
} from '@mui/material';
import {
  LocationOn,
  Email,
  Phone,
  Person,
  Send,
  Language
} from '@mui/icons-material';
import { message } from 'antd';
import axios from '../../axiosInstance';
import { Colors } from '../../Comman';

const BusinessContact = ({ business }) => {
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await axios.post('/api/v1/contact/send', {
        ...formData,
        businessId: business._id
      });

      if (response.data.success) {
        message.success('Your message has been sent!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
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

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: Colors.LOGOColor, mb: 3 }}>
          Contact Information
        </Typography>

        <Grid container spacing={4}>
          {/* Business Info Column */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: Colors.LOGOColor }}>
                  Business Details
                </Typography>

                <Stack spacing={2}>
                  <Box display="flex" alignItems="center">
                    <Person sx={{ mr: 2, color: Colors.LOGOColor }} />
                    <Typography>
                      <strong>Owner:</strong> {business?.ownerName}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 2, color: Colors.LOGOColor }} />
                    <Typography>
                      <strong>Email:</strong> {business?.email}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Phone sx={{ mr: 2, color: Colors.LOGOColor }} />
                    <Typography>
                      <strong>Phone:</strong> {business?.phone}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="flex-start">
                    <LocationOn sx={{ mr: 2, color: Colors.LOGOColor, mt: 0.5 }} />
                    <Typography>
                      <strong>Address:</strong> {business?.address}
                      {business?.city && `, ${business.city}`}
                      {business?.state && `, ${business.state}`}
                    </Typography>
                  </Box>

                  {business?.socialLinks?.website && (
                    <Box display="flex" alignItems="center">
                      <Link 
                        href={business.socialLinks.website} 
                        target="_blank" 
                        rel="noopener"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Language sx={{ mr: 2, color: Colors.LOGOColor }} />
                        <Typography>Visit Website</Typography>
                      </Link>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Form Column */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: Colors.LOGOColor }}>
                  Send a Message
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
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
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    margin="normal"
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
                  />

                  <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      endIcon={<Send />}
                      disabled={submitting}
                      sx={{
                        backgroundColor: Colors.LOGOlight,
                        px: 4,
                        '&:hover': {
                          backgroundColor: Colors.LOGOColor,
                        }
                      }}
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BusinessContact;