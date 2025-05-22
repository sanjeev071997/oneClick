import React from 'react';
import { Box, Grid, Typography, Card, CardMedia, CardContent, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    title: 'Wedding Requisites',
    services: [
      {
        label: 'Banquet Halls',
        image: 'https://cms-assets.bajajfinserv.in/is/image/bajajfinance/wedding-to-do-planning-checklists?scl=1',
        name: 'Wedding Planning',
      },
      {
        label: 'Bridal Requisite',
        image: 'https://iso.500px.com/wp-content/uploads/2015/04/weddingguide1_cover.jpg',
        name: 'Wedding Planning',
      },
      {
        label: 'Caterers',
        image: 'https://i.pinimg.com/474x/9d/3f/e8/9d3fe841d6ee8fb6ff36fbbb02ead617.jpg',
        name: 'Wedding Planning',
      },
    ],
  },
  {
    title: 'Repairs & Services',
    services: [
      {
        label: 'AC Service',
        image: 'https://t4.ftcdn.net/jpg/02/76/43/29/360_F_276432902_ciIBGVGeW3NkA8ja4EqxJzcG7M5jhGB9.jpg',
        name: 'Car Repair & Services',
      },
      {
        label: 'Car Service',
        image: 'https://media.istockphoto.com/id/1284285153/photo/auto-mechanic-working-on-car-engine-in-mechanics-garage-repair-service-authentic-close-up-shot.jpg?s=612x612&w=0&k=20&c=7AbRTEvT_5McOvmE1ArLvcowxlEuiPYPvMFEBjQEiAU=',
        name: 'Car Repair & Services',
      },
      {
        label: 'Bike Service',
        image: 'https://media.istockphoto.com/id/1388398423/photo/mexican-female-mechanic-in-her-shop.jpg?s=612x612&w=0&k=20&c=97p43aver040MsgLtxfG7BQkd_OHLqigG5PUdwhVV4k=',
        name: 'Car Repair & Services',
      },
    ],
  },
];

const CategoriesBanner = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, maxWidth: 1500, margin: '0 auto' }}>
      <Grid container spacing={2}>
        {/* Left side - Categories */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid item xs={12} key={index}>
                <Paper elevation={0} sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  backgroundColor: 'background.paper'
                }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
                    {category.title}
                  </Typography>
                  <Grid container spacing={2}>
                    {category.services.map((service, idx) => (
                      <Grid item xs={4} key={idx}>
                        <Card
                          sx={{ 
                            borderRadius: 2, 
                            boxShadow: 'none',
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': { 
                              transform: 'translateY(-4px)',
                              boxShadow: 3 
                            }
                          }}
                          onClick={() => navigate(`/category/${service.name}`, { state: { category: service } })}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            image={service.image}
                            alt={service.label}
                            sx={{ 
                              borderRadius: '8px 8px 0 0', 
                              cursor: 'pointer',
                              objectFit: 'cover'
                            }}
                          />
                          <CardContent sx={{ p: 1.5 }}>
                            <Typography variant="subtitle2" align="center" fontWeight="medium">
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
        </Grid>

        {/* Right side - Banner */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ 
            height: '100%', 
            borderRadius: 2, 
            overflow: 'hidden',
            position: 'relative',
            '&:hover': {
              boxShadow: 3
            }
          }}>
            <CardMedia
              component="img"
              image="https://img.freepik.com/free-photo/spa-composition-white-background_23-2147749674.jpg"
              alt="Banner"
              sx={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoriesBanner;