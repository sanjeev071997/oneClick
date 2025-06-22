import React, { useEffect, useState } from "react";
import axios from "../axiosInstance"; 
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Category as CategoryIcon,
  Store as StoreIcon,
  RateReview as ReviewIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const Dashboard = () => {
  const theme = useTheme();

  // States for each data type arrays
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Categories
        const catRes = await axios.get("/api/v1/categories/get");
        if (catRes.data.success === true) {
          setCategories(catRes.data.getCategories || []);
        } else {
          setCategories([]);
        }

        // 2. Businesses
        const bizRes = await axios.get("/api/v1/business/all");
        setBusinesses(bizRes.data.data || []);

        // 3. Reviews
        const revRes = await axios.get("/api/v1/review/admin/get");
        setReviews(Array.isArray(revRes.data.adminReview) ? revRes.data.adminReview : []);

        // 4. Users
        const userRes = await axios.get("/api/v1/auth/admin/get");
        setUsers(userRes.data.adminUsers || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Clear data on error
        setCategories([]);
        setBusinesses([]);
        setReviews([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Length counts for cards and charts
  const counts = {
    categories: categories.length,
    businesses: businesses.length,
    reviews: reviews.length,
    users: users.length,
  };

  // Colors for chart slices and cards
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
  ];

  // Pie chart data array
  const pieData = [
    { name: "Categories", value: counts.categories },
    { name: "Businesses", value: counts.businesses },
    { name: "Reviews", value: counts.reviews },
    { name: "Users", value: counts.users },
  ];

  // Bar chart data array (same as pie data)
  const barData = [...pieData];

  // Cards info
  const cardDetails = [
    {
      title: "Categories",
      count: counts.categories,
      icon: <CategoryIcon fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      title: "Businesses",
      count: counts.businesses,
      icon: <StoreIcon fontSize="large" />,
      color: theme.palette.secondary.main,
    },
    {
      title: "Reviews",
      count: counts.reviews,
      icon: <ReviewIcon fontSize="large" />,
      color: theme.palette.success.main,
    },
    {
      title: "Users",
      count: counts.users,
      icon: <PeopleIcon fontSize="large" />,
      color: theme.palette.error.main,
    },
  ];

  if (loading) {
    return (
      <Box
        height="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box p={3} sx={{mb:5}}>
      {/* Stat Cards */}
      <Grid container spacing={3} mb={4}>
        {cardDetails.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 3,
                borderLeft: `5px solid ${card.color}`,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${card.color}20`,
                  mb: 2,
                }}
              >
                {React.cloneElement(card.icon, { sx: { color: card.color } })}
              </Box>
              <Typography variant="h6" color="text.secondary">
                {card.title}
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={card.color}>
                {card.count.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom color="text.primary">
              Data Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  paddingAngle={5}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ marginTop: 20 }}
                />
              </PieChart>
            </ResponsiveContainer>


          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom color="text.primary">
              Count Comparison
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={barData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="name" tick={{ fill: theme.palette.text.secondary }} />
                <YAxis allowDecimals={false} tick={{ fill: theme.palette.text.secondary }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(value) => value.toLocaleString()}
                    fill={theme.palette.text.primary}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
