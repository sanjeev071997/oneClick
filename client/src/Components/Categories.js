import React, { useEffect, useState } from 'react';
import { Grid, Typography, CircularProgress, Box, Container } from '@mui/material';
import axios from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get all categories list
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/v1/categories/get');
      setCategories(res.data.getCategories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const formatCategoryName = (name) => {
    if (name.length > 10) {
      const words = name.split(' ');
      if (words.length > 1) {
        // Split into two lines if there are multiple words
        const middle = Math.floor(words.length / 2);
        const firstLine = words.slice(0, middle).join(' ');
        const secondLine = words.slice(middle).join(' ');
        return (
          <>
            {firstLine}
            <br />
            {secondLine}
          </>
        );
      }
      // For single long words, just split at 10 characters
      return (
        <>
          {name.substring(0, 13)}
          <br />
          {name.substring(13)}
        </>
      );
    }
    return name;
  };


  if (loading) return <CircularProgress />;

  return (
    <Box sx={{p:3}} >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: '1.25rem' }}>
        Popular Categories
      </Typography>
      <Grid container spacing={3} >
        {categories?.map((category) => (
          <Grid item xs={4} sm={2.4} md={1.5} lg={1.2} key={category._id}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onClick={() => navigate(`/category/${category.name}`, { state: { category } })}
            >
              <Box sx={{ 
                width: 50, 
                height: 50, 
                mb: 1,
                border: "0.6px solid #555", 
                borderRadius: "10px",  
                p: 1,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                }, 
              }}>
                <img
                  src={category.url || "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/hotkey_wedding_icon.gif?w=96&q=75"}
                  alt={category.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain',  borderRadius: "10px"}}
                />
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center' }}>
                {formatCategoryName(category.name)}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Categories;