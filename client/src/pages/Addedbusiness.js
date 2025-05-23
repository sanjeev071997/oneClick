

import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  Avatar,
  Divider,
  Chip,
  Box,
  Skeleton
} from '@mui/material';
import { Email, Phone, Business, LocationOn, Person, CalendarToday } from '@mui/icons-material';

const AddedBusiness = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('/api/v1/business/get');
        setBusinesses(response.data.data); // Assuming the array is in response.data.data
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="50%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Your Businesses
      </Typography>

      {businesses.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No businesses found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {businesses.map((business) => (
            <Grid item xs={12} sm={6} md={4} key={business._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {business.businessName.charAt(0)}
                    </Avatar>
                  }
                  title={business.businessName}
                  subheader={business.category?.name}
                  action={
                    <Chip 
                      label="Active" 
                      color="success" 
                      size="small" 
                      sx={{ mt: 1, mr: 1 }} 
                    />
                  }
                />
                
                {business.images?.length > 0 && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={business.images[0].url}
                    alt={business.businessName}
                  />
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ mr: 1, fontSize: 'small' }} /> {business.ownerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ mr: 1, fontSize: 'small' }} /> {business.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ mr: 1, fontSize: 'small' }} /> {business.email}
                    </Typography>
                    {business.address && (
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, fontSize: 'small' }} /> {business.address}
                      </Typography>
                    )}
                  </Box>

                  {business.description && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" paragraph>
                        {business.description}
                      </Typography>
                    </>
                  )}
                </CardContent>

                <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 0.5, fontSize: 'small' }} /> Created: {new Date(business.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated: {new Date(business.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AddedBusiness;