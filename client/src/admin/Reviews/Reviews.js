import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Box,
  TextField,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Delete, Star, Home, Search } from '@mui/icons-material';
import { Divider, message } from 'antd';
import { Link as RouterLink } from 'react-router-dom';

const ReviewsDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const filtered = reviews.filter(review => {
      const businessMatch = review.businessId?.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
      const reviewerMatch = review.reviewer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return businessMatch || reviewerMatch;
    });
    setFilteredReviews(filtered);
  }, [searchTerm, reviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/review/admin/get');
      const reviewsData = Array.isArray(res.data.adminReview)
        ? res.data.adminReview
        : [];
      setReviews(reviewsData);
      setFilteredReviews(reviewsData);
    } catch (err) {
      message.error('Failed to fetch reviews. Please try again.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await axios.delete("/api/v1/review/delete", { data: { id } });
      message.success('Review deleted successfully!');
      fetchReviews();
    } catch (err) {
      message.error('Failed to delete review. Please try again.');
      console.error('Error deleting review:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{
      marginTop: '2rem',
      marginBottom: '2rem',
      padding: { xs: '0.5rem', sm: '1rem' }
    }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          mb: 2,
          p: 1.5,
          backgroundColor: 'white',
          borderRadius: 5,
        }}
      >
        <Link
          component={RouterLink}
          to="/dashboard"
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Typography color="text.primary">Reviews</Typography>
      </Breadcrumbs>
      <Divider />


      <Typography variant="h4" gutterBottom sx={{
        fontWeight: 'bold',
        mb: 3,
        fontSize: { xs: '1.5rem', sm: '2rem' }
      }}>
        Customer Reviews
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by business name or reviewer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
            },
          }}
        />
      </Box>


      <Paper elevation={3} sx={{
        p: { xs: 1, sm: 3 },
        borderRadius: 2,
        overflowX: 'auto'
      }}>
        {filteredReviews.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', p: 3 }}>
            {searchTerm ? 'No matching reviews found' : 'No reviews found'}
          </Typography>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', width: '5%' }}>S.No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', width: '15%' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', width: '20%' }}>Business</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', width: '10%' }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', width: '30%' }}>Review</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', width: '10%' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', width: '10%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews.map((review, index) => (
                <TableRow
                  key={review._id}
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                        {review.reviewer?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="body2">
                        {review.reviewer?.name || 'Anonymous'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={review.businessId?.images[0]?.url || '/default-business.png'}
                        alt={review.businessId?.businessName || 'Business'}
                        sx={{ width: 40, height: 40 }}
                        variant="rounded"
                        imgProps={{
                          onError: (e) => {
                            e.target.src = '/default-business.png';
                            e.target.onerror = null;
                          }
                        }}
                      />
                      <Typography variant="body2">
                        {review.businessId?.businessName || 'Unknown Business'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                      {review.rating}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {review.comment || 'No comment'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteReview(review._id)}
                      sx={{ textTransform: 'none' }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default ReviewsDashboard;