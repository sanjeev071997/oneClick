import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Typography, CircularProgress
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid
} from 'recharts';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import BusinessIcon from '@mui/icons-material/Business';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import StarRateIcon from '@mui/icons-material/StarRate';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from '../../axiosInstance';
import { Colors } from '../../Comman';

const CHART_COLORS = [
  Colors.LOGOColor, Colors.LOGOlight,
  '#F7B84B', '#E67C7C', '#6D6D6D', '#42A5F5'
];

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);

  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [queries, setQueries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);

  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    recommendationRate: 0
  });

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get('/api/v1/business/get');
      setBusinesses(res.data?.data || []);
    } catch {
      message.error("Failed to fetch businesses");
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await axios.post('/api/v1/enquiry/get', { userId: user._id });
      setQueries(res.data?.data || []);
    } catch {
      message.error("Failed to fetch enquiries");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/api/v1/review/get');
      const reviewData = res.data?.data || [];
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
    } catch {
      message.error("Failed to fetch reviews");
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get('/api/v1/plans/get');
      setPlans(res.data?.data || []);
    } catch {
      message.error("Failed to fetch plans");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/v1/product/get/business/${user._id}`);
      setProducts(res.data?.data || []);
    } catch {
      message.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      setLoading(true);
      await fetchBusinesses();
      await fetchEnquiries();
      await fetchReviews();
      await fetchPlans();
      await fetchProducts();
      setLoading(false);
    };

    fetchData();
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
    { title: 'Total Plans', value: plans.length, icon: <ReceiptLongIcon />, color: CHART_COLORS[1] },
    { title: 'Total Enquiries', value: queries.length, icon: <QuestionAnswerIcon />, color: CHART_COLORS[2] },
    { title: 'Total Reviews', value: reviewStats.totalReviews, icon: <StarRateIcon />, color: CHART_COLORS[3] },
    { title: 'Total Products', value: products.length, icon: <ShoppingCartIcon />, color: CHART_COLORS[4] }
  ];

  const pieData = stats.map(({ title, value }) => ({ name: title, value }));
  const barData = stats.map(stat => ({
    name: stat.title.replace('Total ', ''),
    value: stat.value,
    color: stat.color
  }));

  return (
    <Box p={3} sx={{ bgcolor: '#f5f7f9', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} mb={4} sx={{ color: Colors.LOGOColor, textAlign: 'center' }}>
        Your Business Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={idx}>
            <Paper
              elevation={3}
              sx={{
                textAlign: 'center',
                borderRadius: 3,
                borderLeft: `5px solid ${stat.color}`,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                },
                height: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#ffffff',
              }}
            >
              <Box sx={{ color: stat.color, fontSize: '2.5rem', mb: 1 }}>{stat.icon}</Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary" noWrap>
                {stat.title}
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: Colors.LOGOColor, mt: 0.5 }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 400, bgcolor: '#ffffff' }}>
            <Typography variant="h6" fontWeight={700} mb={2} color={Colors.LOGOColor}>
              Overview Chart
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count">
                  {barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 400, bgcolor: '#ffffff' }}>
            <Typography variant="h6" fontWeight={700} mb={2} color={Colors.LOGOColor}>
              Data Distribution
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
                    <Cell key={`pie-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
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
