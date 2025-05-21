import React from 'react';
import { Box, Grid, Typography, Card, CardMedia, CardContent, Paper } from '@mui/material';

const categories = [
  {
    title: 'Wedding Requisites',
    services: [
      {
        label: 'Banquet Halls',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
      {
        label: 'Bridal Requisite',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
      {
        label: 'Caterers',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
    ],
  },
  {
    title: 'Beauty & Spa',
    services: [
      {
        label: 'Beauty Parlours',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
      {
        label: 'Spa & Massages',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
      {
        label: 'Salons',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
    ],
  },
  {
    title: 'Repairs & Services',
    services: [
      {
        label: 'AC Service',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
      {
        label: 'Car Service',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
      {
        label: 'Bike Service',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
    ],
  },
  {
    title: 'Daily Needs',
    services: [
      {
        label: 'Movies',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
      {
        label: 'Grocery',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
      {
        label: 'Electricians',
        image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4',
      },
    ],
  },
];

const CategorySection = () => {
  return (
    <Box p={3} >
      <Grid container spacing={2}>
        {categories.map((category, index) => (
          <Grid item xs={12} md={6} key={index}>
           <Paper elevation={3} sx={{ p: 2, mr:2, ml:2,mt:2, borderRadius: 2, border: '1px solid', borderColor: 	'#D3D3D3' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {category.title}
              </Typography>
              <Grid container spacing={2}>
                {category.services.map((service, idx) => (
                  <Grid item xs={4} key={idx}>
                    <Card sx={{ borderRadius: 2, boxShadow: 'none' }}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={service.image}
                        alt={service.label}
                        sx={{ borderRadius: 2 }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="body2" align="center">
                          {service.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategorySection;
