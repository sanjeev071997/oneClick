
import React from 'react';
import { Box, Grid, Typography, Card, CardMedia, CardContent, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WeddingImage from '../Images/wedding.avif';
import Image from '../Images/weddingguide1_cover.jpg';
import Image1 from '../Images/wedding1.jpg';
import Beauty from '../Images/beauty.jpg'
import Spa  from  '../Images/spa.avif';
import Hair  from '../Images/hair.jpg'
import Car from '../Images/car.jpg';
import Bike from '../Images/bike1.jpg';
import Ac from '../Images/ac.jpg';
import  Movie from '../Images/movie.jpeg';
import Grocery from '../Images/grocery.jpg';
import  EImage from '../Images/Electercity.jpeg'
import { Colors, FontSize, FontWeight, FontFamily } from "../Comman"

const categories = [
  {
    title: 'Wedding Requisites',
    services: [
      {
        label: 'Banquet Halls',
        image: WeddingImage ,
        name: 'Wedding Planning',
      },
      {
        label: 'Bridal Requisite',
        image: Image,
        name: 'Wedding Planning',
      },
      {
        label: 'Caterers',
        image: Image1,
        name: 'Wedding Planning',
      },
    ],
  },
  {
    title: 'Beauty & Spa',
    services: [
      {
        label: 'Beauty Parlours',
        image:  Beauty,
        name:  'Beauty & Spa'
      },
      {
        label: 'Spa & Massages',
        image:  Spa,
         name:  'Beauty & Spa'
      },
      {
        label: 'Salons',
        image:  Hair,
         name:  'Beauty & Spa'
      },
    ],
  },
  {
    title: 'Repairs & Services',
    services: [
      {
        label: 'AC Service',
        image:  Ac ,
        name: 'Car Repair & Services',
      },
      {
        label: 'Car Service',
        image: Car,
        name: 'Car Repair & Services',
      },
      {
        label: 'Bike Service',
        image: Bike,
        name: 'Car Repair & Services',
      },
    ],
  },
  {
    title: 'Daily Needs',
    services: [
      {
        label: 'Movies',
        image:  Movie,
        name: 'Other',
      },
      {
        label: 'Grocery',
        image:  Grocery,
        name: 'Other',
      },
      {
        label: 'Electricians',
        image:   EImage ,
        name: 'Other',
      },
    ],
  },
];
const CategorySection = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="auto" sx={{mt:3}}>
      <Grid container spacing={2} >
        {categories.map((category, index) => (
          <Grid item xs={12} md={6} key={index} >
           <Paper elevation={3} sx={{ p: 2, mr:2, ml:2, mt:2, borderRadius: 2, border: '1px solid', borderColor:  '#D3D3D3' }}>
              <Typography variant="h6" gutterBottom  sx={{color:Colors.LOGOColor,fontWeight:FontWeight.bold,fontFamily:FontFamily.Georgia}}>
                {category.title}
              </Typography>
              <Grid container spacing={2}>
                {category.services.map((category, idx) => (
                  <Grid item xs={4} key={idx}>
                    <Card sx={{ borderRadius: 2, boxShadow: 'none' }}
                    onClick={() => navigate(`/category/${category.name}`, { state: { category } })}>
                      <CardMedia
                        component="img"
                        height="150"
                        image={category.image}
                        alt={category.label}
                        sx={{ borderRadius: 2, cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="body2" align="center" fontFamily={FontFamily.inriaSerif} fontSize={FontSize.seventeen} sx={{color:Colors.LOGOColor }}>
                          {category.label}
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
    </Container>
  );
};
export default CategorySection;