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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TruckIamge from '../Images/truck.jpg';
import BikeImage from '../Images/bike.jpg';
import CarImage from '../Images/car.webp';
import LocalImage from '../Images/local.jpg';
import NationalImage from '../Images/National.webp';
import InterImage from '../Images/interr.webp'
import banner from '../Images/bannerr.webp'
import { Colors, FontFamily, FontWeight } from '../Comman';


const categories = [
  {
    title: 'Transporters',
    services: [
      {
        label: 'Truck Transport',
        image: TruckIamge ,
        name: 'Transport Services',
      },
      {
        label: 'Bike Transport',
        image:  BikeImage ,
        name: 'Transport Services',
      },
      {
        label: 'Car Transport',
        image:  CarImage ,
        name: 'Transport Services',
      },
    ],
  },
  {
    title: 'Courier Service',
    services: [
      {
        label: 'Local Courier',
        image:  LocalImage,
        name: 'Courier Delivery',
      },
      {
        label: 'National Courier',
        image: NationalImage,
        name: 'Courier Delivery',
      },
      {
        label: 'International Courier',
        image:InterImage,
        name: 'Courier Delivery',
      },
    ],
  },
];


const CategorySection = () => {
  const navigate = useNavigate();
  return (
   <Container maxWidth={false} sx={{ 
        mt: 5,
        px: { xs: 2, sm: 3, md: 4 } 
      }}>
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
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{color:Colors.LOGOColor,fontFamily:FontFamily.Georgia}}>
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
                              fontWeight={FontWeight.heading2}
                              sx={{color:Colors.LOGOColor,fontFamily:FontFamily.inriaSerif}}
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
            src={ banner }
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
