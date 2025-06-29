
// import React from 'react';
// import { Box, Grid, Typography, Card, CardMedia, CardContent, Paper, Container } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import WeddingImage from '../Images/wedding.avif';
// import Image from '../Images/weddingguide1_cover.jpg';
// import Image1 from '../Images/wedding1.jpg';
// import Beauty from '../Images/beauty.jpg'
// import Spa  from  '../Images/spa.avif';
// import Hair  from '../Images/hair.jpg'
// import Car from '../Images/car.jpg';
// import Bike from '../Images/bike1.jpg';
// import Ac from '../Images/ac.jpg';
// import  Movie from '../Images/movie.jpeg';
// import Grocery from '../Images/grocery.jpg';
// import  EImage from '../Images/Electercity.jpeg'
// import { Colors, FontSize, FontWeight, FontFamily } from "../Comman"

// const categories = [
//   {
//     title: 'Wedding Requisites',
//     services: [
//       {
//         label: 'Banquet Halls',
//         image: WeddingImage ,
//         name: 'Wedding Planning',
//       },
//       {
//         label: 'Bridal Requisite',
//         image: Image,
//         name: 'Wedding Planning',
//       },
//       {
//         label: 'Caterers',
//         image: Image1,
//         name: 'Wedding Planning',
//       },
//     ],
//   },
//   {
//     title: 'Beauty & Spa',
//     services: [
//       {
//         label: 'Beauty Parlours',
//         image:  Beauty,
//         name:  'Beauty & Spa'
//       },
//       {
//         label: 'Spa & Massages',
//         image:  Spa,
//          name:  'Beauty & Spa'
//       },
//       {
//         label: 'Salons',
//         image:  Hair,
//          name:  'Beauty & Spa'
//       },
//     ],
//   },
//   {
//     title: 'Repairs & Services',
//     services: [
//       {
//         label: 'AC Service',
//         image:  Ac ,
//         name: 'Car Repair & Services',
//       },
//       {
//         label: 'Car Service',
//         image: Car,
//         name: 'Car Repair & Services',
//       },
//       {
//         label: 'Bike Service',
//         image: Bike,
//         name: 'Car Repair & Services',
//       },
//     ],
//   },
//   {
//     title: 'Daily Needs',
//     services: [
//       {
//         label: 'Movies',
//         image:  Movie,
//         name: 'Other',
//       },
//       {
//         label: 'Grocery',
//         image:  Grocery,
//         name: 'Other',
//       },
//       {
//         label: 'Electricians',
//         image:   EImage ,
//         name: 'Other',
//       },
//     ],
//   },
// ];
// const CategorySection = () => {
//   const navigate = useNavigate();
//   return (
//     <Container maxWidth="auto" sx={{mt:3}}>
//       <Grid container spacing={2} >
//         {categories.map((category, index) => (
//           <Grid item xs={12} md={6} key={index} >
//            <Paper elevation={3} sx={{ p: 2, mr:2, ml:2, mt:2, borderRadius: 2, border: '1px solid', borderColor:  '#D3D3D3' }}>
//               <Typography variant="h6" gutterBottom  sx={{color:Colors.LOGOColor,fontWeight:FontWeight.bold,fontFamily:FontFamily.Georgia}}>
//                 {category.title}
//               </Typography>
//               <Grid container spacing={2}>
//                 {category.services.map((category, idx) => (
//                   <Grid item xs={4} key={idx}>
//                     <Card sx={{ borderRadius: 2, boxShadow: 'none' }}
//                     onClick={() => navigate(`/category/${category.name}`, { state: { category } })}>
//                       <CardMedia
//                         component="img"
//                         height="150"
//                         image={category.image}
//                         alt={category.label}
//                         sx={{ borderRadius: 2, cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
//                       />
//                       <CardContent sx={{ p: 1 }}>
//                         <Typography variant="body2" align="center" fontFamily={FontFamily.inriaSerif} fontSize={FontSize.seventeen} sx={{color:Colors.LOGOColor }}>
//                           {category.label}
//                         </Typography>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };
// export default CategorySection;


import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardMedia, CardContent, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';

// ✅ Local images
import WeddingImage from '../Images/wedding.avif';
import Image from '../Images/weddingguide1_cover.jpg';
import Image1 from '../Images/wedding1.jpg';
import Beauty from '../Images/beauty.jpg';
import Spa from '../Images/spa.avif';
import Hair from '../Images/hair.jpg';
import Car from '../Images/car.jpg';
import Bike from '../Images/bike1.jpg';
import Ac from '../Images/ac.jpg';
import Movie from '../Images/movie.jpeg';
import Grocery from '../Images/grocery.jpg';
import EImage from '../Images/Electercity.jpeg';

import { Colors, FontSize, FontWeight, FontFamily } from '../Comman';

// ✅ Map category label to actual backend category name
const labelToCategoryNameMap = {
  'Banquet Halls': 'Wedding Planning',
  'Bridal Requisite': 'Wedding Planning',
  'Wedding Planning': 'Wedding Planning',

  'Beauty Parlours': 'Beauty Parlours',
  'Spa & Massages': 'Beauty Spa',
  'Salons': 'Beauty Spa',

  'AC Service': 'Car Repair & Services',
  'Car Service': 'Car Repair & Services',
  'Bike Service': 'Car Repair & Services',

  'Movies': 'Movies',
  'Grocery': 'Grocery',
  'Electricians': 'Electricians'
};

// ✅ Local image map
const imageMap = {
  'Wedding Planning': WeddingImage,
  'Banquet Halls': Image,
  'Bridal Requisite': Image1,
  'Beauty Parlours': Beauty,
  'Spa & Massages': Spa,
  'Salons': Hair,
  'Car Service': Car,
  'Bike Service': Bike,
  'AC Service': Ac,
  'Movies': Movie,
  'Grocery': Grocery,
  'Electricians': EImage,
};

// ✅ Local category layout
const staticCategoryOrder = [
  {
    title: 'Wedding Requisites',
    items: ['Banquet Halls', 'Bridal Requisite', 'Wedding Planning'],
  },
  {
    title: 'Beauty & Spa',
    items: ['Beauty Parlours', 'Spa & Massages', 'Salons'],
  },
  {
    title: 'Repairs & Services',
    items: ['AC Service', 'Car Service', 'Bike Service'],
  },
  {
    title: 'Daily Needs',
    items: ['Movies', 'Grocery', 'Electricians'],
  },
];

const CategorySection = () => {
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/v1/categories/get')
      .then((res) => {
        if (res.data.success) {
          setFetchedCategories(res.data.getCategories);
        }
      })
      .catch((err) => console.error('API error:', err));
  }, []);

  // ✅ Get category from API data using mapped name
  const getCategoryByName = (label) => {
    const mappedName = labelToCategoryNameMap[label] || label;
    return fetchedCategories.find(
      (cat) => cat.name.trim().toLowerCase() === mappedName.trim().toLowerCase()
    );
  };

  return (
    <Container maxWidth="auto" sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {staticCategoryOrder.map((group, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mr: 2,
                ml: 2,
                mt: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: '#D3D3D3',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: Colors.LOGOColor,
                  fontWeight: FontWeight.bold,
                  fontFamily: FontFamily.Georgia,
                }}
              >
                {group.title}
              </Typography>

              <Grid container spacing={2}>
                {group.items.map((label, idx) => {
                  const categoryData = getCategoryByName(label) || {};

                  return (
                    <Grid item xs={4} key={idx}>
                      <Card
                        sx={{ borderRadius: 2, boxShadow: 'none' }}
                        onClick={() => {
                          if (categoryData._id) {
                            navigate(`/category/${categoryData._id}`, {
                              state: { category: categoryData },
                            });
                          } else {
                            alert(`No category ID found for: ${label}`);
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="150"
                          image={imageMap[label]}
                          alt={label}
                          sx={{
                            borderRadius: 2,
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 3 },
                          }}
                        />
                        <CardContent sx={{ p: 1 }}>
                          <Typography
                            variant="body2"
                            align="center"
                            fontFamily={FontFamily.inriaSerif}
                            fontSize={FontSize.seventeen}
                            sx={{ color: Colors.LOGOColor }}
                          >
                            {label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategorySection;
