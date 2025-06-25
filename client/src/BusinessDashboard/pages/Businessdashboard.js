import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Typography, CircularProgress, Stack
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid
} from 'recharts';
import axios from '../../axiosInstance';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import StarRateIcon from '@mui/icons-material/StarRate';


import { Colors } from '../../Comman';

// Custom colors for charts - can be adjusted
const CHART_COLORS = [
  Colors.LOGOColor,      // Primary brand color
  Colors.LOGOlight,      // Secondary brand color
  '#A3A7D6',              // Light purple
  '#C7E898',              // Light green
  '#F7B84B',              // Orange/Yellow
  '#E67C7C',              // Light Red
  '#6D6D6D'               // Grey
];

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);

  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [queries, setQueries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    recommendationRate: 0
  });

  useEffect(() => {
    if (!user?._id) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [bizRes, queryRes, reviewRes, planRes] = await Promise.all([
          axios.get('/api/v1/business/get', { params: { userId: user._id } }),
          axios.post('/api/v1/enquiry/get', { userId: user._id }),
          axios.get('/api/v1/review/get'),
          axios.get('/api/v1/plans/get')
        ]);

        const businessList = bizRes.data?.data || [];
        setBusinesses(businessList);

        const bizId = businessList[0]?._id;
        if (bizId) {
          const [catRes, prodRes] = await Promise.all([
            axios.post(`/api/v1/product/category/get/${bizId}`),
            axios.get(`/api/v1/product/get/${bizId}`)
          ]);
          setCategories(catRes.data?.data || []);
          setProducts(prodRes.data?.data || []);
        } else {
          setCategories([]);
          setProducts([]);
        }

        setPlans(planRes.data?.data || []);
        setQueries(queryRes.data?.data || []);

        const reviewData = reviewRes.data?.data || [];
        setReviews(reviewData);

        const total = reviewData.length;
        const avgRating = total > 0
          ? (reviewData.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total).toFixed(1)
          : 0;
        const recommended = reviewData.filter(r => Number(r.rating || 0) >= 4).length;
        setReviewStats({
          averageRating: avgRating,
          totalReviews: total,
          recommendationRate: total > 0 ? Math.round((recommended / total) * 100) : 0
        });
      } catch (err) {
        console.error(err);
        message.error('Failed to load dashboard data. Please check API endpoints and data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  
  const stats = [
    { title: 'Total Businesses', value: businesses.length, icon: <BusinessIcon />, color: CHART_COLORS[0] },
    { title: 'Total Categories', value: categories.length, icon: <CategoryOutlinedIcon />, color: CHART_COLORS[1] },
    { title: 'Total Products', value: products.length, icon: <StorefrontIcon />, color: CHART_COLORS[2] },
    { title: 'Total Plans', value: plans.length, icon: <ReceiptLongIcon />, color: CHART_COLORS[3] },
    { title: 'Total Enquiries', value: queries.length, icon: <QuestionAnswerIcon />, color: CHART_COLORS[4] },
    { title: 'Total Reviews', value: reviewStats.totalReviews, icon: <StarRateIcon />, color: CHART_COLORS[5] }
  ];


  const pieData = stats.map(({ title, value }) => ({
    name: title,
    value: value
  }));

  // Data for Bar Chart (all numerical stats combined)
  const barData = stats.map(stat => ({
    name: stat.title.replace('Total ', '').replace('s', ''),
    value: stat.value,
    color: stat.color
  }));


  return (
    <Box p={3} sx={{ bgcolor: '#f5f7f9', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} mb={4} sx={{ color: Colors.LOGOColor, textAlign: 'center' }}>
        Your Business Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        {stats.map((stat, idx) => (
          <Grid
            item
            xs={12}    
            sm={6}     
            md={4}    
            lg={3}     
            key={idx}
          >
            <Paper
              elevation={3}
              sx={{

                mb: { xs: 2, sm: 0 }, 
                textAlign: 'center',
                borderRadius: 3,
                borderLeft: `5px solid ${stat.color}`,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#ffffff',
              }}
            >
              <Box sx={{ color: stat.color, fontSize: '2.5rem', mb: 1 }}>
                {stat.icon}
              </Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary" noWrap sx={{ maxWidth: '100%' }}>
                {stat.title}
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: Colors.LOGOColor, mt: 0.5 }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}



        {/* Bar Chart - Total Counts */}
        <Grid item xs={12} md={6} lg={8}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, height: 400, bgcolor: '#ffffff', mt: 5 }}>
            <Typography variant="h6" fontWeight={700} mb={2} color={Colors.LOGOColor}>
              Total Counts Overview
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={barData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} style={{ fontSize: '0.8rem' }} />
                <YAxis />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Legend />
                <Bar dataKey="value" name="Count" fill={Colors.LOGOColor}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart - Distribution of main entities */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, height: 400, bgcolor: '#ffffff', mt: 5 }}>
            <Typography variant="h6" fontWeight={700} mb={2} color={Colors.LOGOColor}>
              Dashboard Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"

                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} items`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;