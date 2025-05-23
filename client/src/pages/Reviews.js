import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Avatar, Card, CardHeader, CardContent,
  CardActions, Button, Grid, Paper, Divider, Pagination, Rating, Chip,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from '@mui/material';
import {
  Edit, Delete, Star, StarBorder, Business
} from '@mui/icons-material';
import { message, Modal } from "antd";
import axios from '../axiosInstance';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    recommendationRate: 0
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);

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
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const openEditModal = (review) => {
    setSelectedReview(review);
    setEditComment(review.comment);
    setEditRating(Number(review.rating));
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    const updateData = {
      id: selectedReview._id,
      comment: editComment,
      rating: editRating
    }
    
  try {
    const response = await axios.put('/api/v1/review/update', updateData);
    if (response?.data?.success) {
      message.success('Review updated successfully!');
      setEditModalOpen(false);
      fetchReviews();
    } else {
      message.error('Failed to update review.');
    }
  } catch (err) {
    console.error('Failed to update review:', err);
    message.error('Something went wrong. Please try again.');
  }
};
  // delete Review
  const { confirm } = Modal;
  const handleDelete = async (id) => {
    confirm({
      title: "Are you sure you want to delete this Review?",
      content: "This action cannot be undone. Please confirm.",
      okText: "Yes, Delete",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          const data = await axios.delete(`/api/v1/review/delete`, {
            data: { id },
          });
          console.log(data, "data")
          if (data?.data?.success === true) {
            message.success(data?.data?.message);
            fetchReviews();
          }
        } catch (err) {
          message.error(err || "Failed to delete review")
          console.error('Failed to delete review:', err);
        }
      },
      onCancel() {
        console.log("Delete operation canceled");
      }
    });
  };

  const paginatedReviews = reviews.slice((currentPage - 1) * 6, currentPage * 6);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight={700} color="primary.main">
          Customer Reviews
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          See what our customers are saying about businesses
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 6, borderRadius: 2 }}>
        <Grid container spacing={2} justifyContent="space-around">
          <Grid item xs={12} sm={4} md={3}>
            <Box textAlign="center">
              <Typography variant="h2" fontWeight={700} color="primary.main">{stats.averageRating}</Typography>
              <Typography variant="body2" color="text.secondary">Average Rating</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box textAlign="center">
              <Typography variant="h2" fontWeight={700} color="primary.main">{stats.totalReviews}</Typography>
              <Typography variant="body2" color="text.secondary">Total Reviews</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box textAlign="center">
              <Typography variant="h2" fontWeight={700} color="primary.main">{stats.recommendationRate}%</Typography>
              <Typography variant="body2" color="text.secondary">Would Recommend</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">Loading reviews...</Typography>
        </Box>
      ) : reviews.length > 0 ? (
        <>
          <Grid container spacing={4}>
            {paginatedReviews.map((review) => (
              <Grid item key={review._id} xs={12} sm={6} md={4}>
                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                  <CardHeader
                    avatar={
                      <Box sx={{ position: 'relative' }}>
                        <Tooltip title={review.businessId?.businessName || "Business"}>
                          <Avatar
                            src={review.businessId?.images?.[0]?.url || ''}
                            alt={review.businessId?.businessName}
                            sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
                          >
                            {review.businessId?.businessName?.[0] || <Business />}
                          </Avatar>
                        </Tooltip>
                        <Tooltip title={review.reviewer?.name || "User"}>
                          <Avatar
                            src={review.reviewer?.avatar || ''}
                            alt={review.reviewer?.name}
                            sx={{
                              width: 32,
                              height: 32,
                              position: 'absolute',
                              bottom: -8,
                              right: -8,
                              border: '2px solid white',
                              bgcolor: 'secondary.main'
                            }}
                          >
                            {review.reviewer?.name?.[0] || 'U'}
                          </Avatar>
                        </Tooltip>
                      </Box>
                    }
                    title={
                      <Box>
                        <Typography fontWeight="bold">{review.businessId?.businessName || "Business"}</Typography>
                        <Typography variant="body2">Reviewed by: {review.reviewer?.name || "Anonymous"}</Typography>
                      </Box>
                    }
                    subheader={new Date(review.createdAt).toLocaleDateString()}
                    subheaderTypographyProps={{ color: 'text.secondary' }}
                    action={
                      <Rating
                        value={Number(review.rating)}
                        readOnly
                        precision={0.5}
                        icon={<Star color="primary" />}
                        emptyIcon={<StarBorder color="primary" />}
                      />
                    }
                    sx={{ pb: 0, alignItems: 'flex-start' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" color="text.secondary" fontStyle="italic">
                      "{review.comment}"
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                    <Chip
                      label={`${review.rating} stars`}
                      size="small"
                      icon={<Star fontSize="small" />}
                      sx={{ backgroundColor: 'rgba(255,215,0,0.2)', color: 'text.primary' }}
                    />
                    <Box>
                      <IconButton onClick={() => openEditModal(review)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(review._id)} color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={6}>
            <Pagination
              count={Math.ceil(reviews.length / 6)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      ) : (
        <Box textAlign="center" py={6}>
          <Star sx={{ fontSize: 60, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" gutterBottom>No Reviews Yet</Typography>
          <Typography variant="body1" color="text.secondary">Be the first to share your experience</Typography>
        </Box>
      )}

      {/* Edit Review Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Your Review</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Rating
              value={editRating}
              precision={0.5}
              onChange={(e, newValue) => setEditRating(newValue)}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Comment"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewsPage;
