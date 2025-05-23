import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Paper,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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

const CategorySection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* Left Side - Categories */}
        <Box sx={{ flex: 1 }}>
          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: '#D3D3D3',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {category.title}
                  </Typography>
                  <Grid container spacing={2}>
                    {category.services.map((service, idx) => (
                      <Grid item xs={4} key={idx}>
                        <Card
                          sx={{ borderRadius: 2, boxShadow: 'none', cursor: 'pointer' }}
                          onClick={() =>
                            navigate(`/category/${service.name}`, {
                              state: { category: service },
                            })
                          }
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            image={service.image}
                            alt={service.label}
                            sx={{
                              borderRadius: 2,
                              transition: '0.3s',
                              '&:hover': { boxShadow: 3 },
                            }}
                          />
                          <CardContent sx={{ p: 1 }}>
                            <Typography
                              variant="body2"
                              align="center"
                              fontWeight="500"
                            >
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

        {/* Right Side - Banner */}
        <Box
  sx={{
    flex: 1,
    borderRadius: 3,
    overflow: 'hidden',
    height: { xs: 250, sm: 450, md: 545 }, 
  }}
>
          <img
            src="https://img.freepik.com/free-photo/people-posing-indian-wedding-ceremony_53876-103870.jpg"
            alt="Banner"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px',
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default CategorySection;
