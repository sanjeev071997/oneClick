import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Rating,
  Chip,
  Box,
  CircularProgress,
  Link
} from '@mui/material';
import { Send, Star, ChatBubble } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from '../../axiosInstance';
import { Colors } from '../../Comman';

const BusinessReviews = ({ user, business }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.post('/api/v1/review/get', {
          businessId: business._id
        });
        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        message.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    if (business?._id) {
      fetchReviews();
    }
  }, [business]);

  // Calculate average rating
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
  ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / totalReviews
  : 0;


  // Handle review submission
  const handleSubmit = async () => {
    if (!reviewText || rating === 0) {
      return message.error('Please enter a review and rating');
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/v1/review/add', {
        businessId: business._id,
        rating,
        comment: reviewText,
        reviewer: user._id
      });

      if (response.data.success) {
        message.success('Review submitted successfully!');
        setRating(0);
        setReviewText('');
        // Refresh reviews
        const refreshResponse = await axios.post('/api/v1/review/get', {
          businessId: business._id
        });
        setReviews(refreshResponse.data.data);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      message.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Review Form Section */}
      {user ? (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: Colors.LOGOColor }}>
              Share Your Experience
            </Typography>
            
            <Box mb={2}>
              <Typography variant="body1" gutterBottom>Your Rating</Typography>
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                precision={0.5}
                size="large"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: Colors.LOGOlight,
                  },
                }}
              />
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                endIcon={<Send />}
                onClick={handleSubmit}
                disabled={submitting}
                sx={{
                  backgroundColor: Colors.LOGOlight,
                  '&:hover': {
                    backgroundColor: Colors.LOGOColor,
                  }
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box 
          textAlign="center" 
          p={3} 
          mb={3} 
          bgcolor={Colors.lightBg}
          borderRadius={2}
          border={`2px dashed ${Colors.LOGOColor}`}
        >
          <Typography>
            Please <Link onClick={() => navigate('/login')} sx={{ cursor: 'pointer', color: Colors.LOGOlight }}>
              sign in
            </Link> to leave a review
          </Typography>
        </Box>
      )}

      {/* Reviews List Section */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <ChatBubble sx={{ mr: 1, color: Colors.LOGOlight }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: Colors.LOGOColor }}>
              Customer Reviews
            </Typography>
            <Box ml="auto" display="flex" alignItems="center">
              <Rating
                value={Number(averageRating)}
                precision={0.1}
                readOnly
                sx={{ mr: 1 }}
              />
              <Typography>
                {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : reviews.length === 0 ? (
            <Box textAlign="center" p={4}>
              <Star sx={{ fontSize: 60, color: Colors.LOGOlight, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Reviews Yet
              </Typography>
              <Typography>
                Be the first to share your experience
              </Typography>
            </Box>
          ) : (
            reviews.map((review) => (
              <Box key={review._id} mb={3} pb={3} borderBottom={`1px solid ${Colors.LOGOColor}`}>
                <Box display="flex">
                  <Avatar 
                    src={review.reviewer?.avatar} 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      mr: 2,
                      border: `2px solid ${Colors.LOGOColor}`
                    }} 
                  />
                  <Box flex={1}>
                    <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                      <Typography fontWeight="bold">
                        {review.reviewer?.name || 'Anonymous'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box my={1}>
                      <Rating 
                        value={review.rating} 
                        readOnly 
                        precision={0.5}
                        sx={{ color: Colors.LOGOlight }}
                      />
                      <Chip 
                        label={`${review.rating}`} 
                        size="small" 
                        sx={{ 
                          ml: 1, 
                          backgroundColor: Colors.LOGOColor, 
                          color: 'white' 
                        }} 
                      />
                    </Box>
                    <Typography>
                      {review.comment}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BusinessReviews;