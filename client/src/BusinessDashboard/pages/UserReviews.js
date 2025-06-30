import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Pagination, Avatar
} from '@mui/material';
import { Delete, Star, ThumbUp, Reviews, Business } from '@mui/icons-material';
import { Modal, message } from 'antd';
import axios from '../../axiosInstance';
import { Colors } from "../../Comman";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    recommendationRate: 0
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/review/get');
      if (Array.isArray(res.data.data)) {
        const reviews = res.data.data;
        setReviews(reviews);

        const total = reviews.length;
        const avgRating = total > 0
          ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total).toFixed(1)
          : 0;

        const recommended = reviews.filter(r => r.rating >= 4).length;

        setStats({
          averageRating: avgRating,
          totalReviews: total,
          recommendationRate: total > 0 ? Math.round((recommended / total) * 100) : 0
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const { confirm } = Modal;
  const handleDelete = async (id) => {
    confirm({
      title: "Delete this review?",
      content: "This action cannot be undone.",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { style: { background: Colors.LOGOColor } },
      onOk: async () => {
        try {
          const data = await axios.delete(`/api/v1/review/delete`, { data: { id } });
          if (data?.data?.success === true) {
            message.success(data?.data?.message);
            fetchReviews();
          }
        } catch (err) {
          message.error(err || "Failed to delete review");
        }
      },
    });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedReviews = reviews.slice((currentPage - 1) * 6, currentPage * 6);

  return (
    <Box sx={{ background: '#f9fafb', minHeight: '100vh', py: 4 }}>
      <Box >
         <Typography variant="h4" fontWeight="bold" color="primary" mb={3}> Customer Reviews</Typography>
        {/* Stats */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{
              p: 2, borderRadius: 2, background: 'white',
              borderTop: `4px solid ${Colors.LOGOColor}`
            }}>
              <Box display="flex" alignItems="center">
                <Star sx={{ fontSize: 40, color: Colors.LOGOColor, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700} color={Colors.LOGOColor}>
                    {stats.averageRating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Avg. Rating</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{
              p: 2, borderRadius: 2, background: 'white',
              borderTop: `4px solid #9EDC29`
            }}>
              <Box display="flex" alignItems="center">
                <Reviews sx={{ fontSize: 40, color: '#9EDC29', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700} color={Colors.LOGOColor}>
                    {stats.totalReviews}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Total Reviews</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{
              p: 2, borderRadius: 2, background: 'white',
              borderTop: `4px solid ${Colors.LOGOlight}`
            }}>
              <Box display="flex" alignItems="center">
                <ThumbUp sx={{ fontSize: 40, color: Colors.LOGOlight, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700} color={Colors.LOGOColor}>
                    {stats.recommendationRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Recommended</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Table */}
        {loading ? (
          <Box textAlign="center" py={8}>
            <CircularProgress size={60} thickness={4} sx={{ color: Colors.LOGOColor }} />
          </Box>
        ) : reviews.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: Colors.LOGOColor }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Business</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reviewer</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rating</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comment</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReviews.map((review) => (
                    <TableRow key={review._id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={review.businessId?.images?.[0]?.url || ''}
                            alt={review.businessId?.businessName}
                            sx={{ mr: 1, bgcolor: Colors.LOGOColor }}
                          >
                            {review.businessId?.businessName?.[0] || <Business />}
                          </Avatar>
                          {review.businessId?.businessName || 'Business'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={review.reviewer?.avatar || ''}
                            alt={review.reviewer?.name}
                            sx={{ mr: 1, bgcolor: Colors.LOGOlight }}
                          >
                            {review.reviewer?.name?.[0] || 'U'}
                          </Avatar>
                          {review.reviewer?.name || 'Anonymous'}
                        </Box>
                      </TableCell>
                      <TableCell>{review.rating}</TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete review">
                          <IconButton onClick={() => handleDelete(review._id)} color="error">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {reviews.length > 6 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.ceil(reviews.length / 6)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        ) : (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, background: 'white' }}>
            <Star sx={{ fontSize: 60, color: Colors.LOGOlight, mb: 2, opacity: 0.7 }} />
            <Typography variant="h5" color={Colors.LOGOColor} gutterBottom>
              No Reviews Yet
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default UserReviews;
