
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
    title: 'Beauty & Spa',
    services: [
      {
        label: 'Beauty Parlours',
        image: 'https://media.istockphoto.com/id/921797424/photo/woman-in-mask-on-face-in-spa-beauty-salon.jpg?s=612x612&w=0&k=20&c=gGSPZOjIS2wcwQyOcjANOKpRVU0KR_iEDbRACnAoIXA=',
        name:  'Beauty & Spa'
      },
      {
        label: 'Spa & Massages',
        image: 'https://content.jdmagicbox.com/comp/mysore/e9/0821px821.x821.200804185633.l6e9/catalogue/mirror-beauty-spa-gokulam-3rd-stage-mysore-body-massage-centres-t2z1qkgeo7.jpg',
         name:  'Beauty & Spa'
      },
      {
        label: 'Salons',
        image: 'https://media.istockphoto.com/id/851007946/photo/woman-getting-hair-shampooed-at-salon.jpg?s=612x612&w=0&k=20&c=1kRvk2iAy6rBdfrfeAz7fhqPz8pvY_dgKmq_fHmjmLU=',
         name:  'Beauty & Spa'
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
  {
    title: 'Daily Needs',
    services: [
      {
        label: 'Movies',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6_Vs7-NoM2TGbbUT-zymByTh_1S_ZZkcQww&s',
        name: 'Other',
      },
      {
        label: 'Grocery',
        image: 'https://i.pinimg.com/1200x/4b/62/44/4b6244a5e5d474827f7bc71e304ee599.jpg',
        name: 'Other',
      },
      {
        label: 'Electricians',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSwmzVDDjs3X6BeC-Azaj81jwkBv4lTTqYy_pT_eVgjuFQoY57OVjPx4LyDYhgj4jwvxQ&usqp=CAU',
        name: 'Other',
      },
    ],
  },
];
const CategorySection = () => {
  const navigate = useNavigate();
  return (
    <Box p={3} >
      <Grid container spacing={2}>
        {categories.map((category, index) => (
          <Grid item xs={12} md={6} key={index}>
           <Paper elevation={3} sx={{ p: 2, mr:2, ml:2, mt:2, borderRadius: 2, border: '1px solid', borderColor:  '#D3D3D3' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
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
                        <Typography variant="body2" align="center">
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
    </Box>
  );
};
export default CategorySection;