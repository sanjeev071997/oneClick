import React, { useState } from 'react';
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
  Link
} from '@mui/material';
import { Send, Star, ChatBubble } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Colors } from '../../Comman';
import axios from '../../axiosInstance'

const BusinessReviews = ({
  user,
  business,
  reviews,
  getReview,
  averageRating,
  totalReviews
}) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Handle review submission
  const handleSubmit = async () => {
    if (!reviewText || rating === 0) {
      return message.error('Please enter a review and rating');
    }

    if (!user) {
      return navigate('/login');
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
        getReview();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      message.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Review Form Section */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{
            fontWeight: 'bold',
            color: Colors.LOGOColor,
            display: 'flex',
            alignItems: 'center'
          }}>
            <ChatBubble sx={{ mr: 1, color: Colors.LOGOlight }} />
            Share Your Experience
          </Typography>

          {user ? (
            <>
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
                  endIcon={<Send />}
                  onClick={handleSubmit}
                  disabled={submitting || !user}
                  sx={{
                    backgroundColor: Colors.LOGOlight,
                    '&:hover': {
                      backgroundColor: Colors.LOGOColor,
                    },
                    '&:disabled': {
                      backgroundColor: Colors.lightBg,
                    }
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Box>
            </>
          ) : (
            <Box
              textAlign="center"
              p={2}
              bgcolor={Colors.lightBg}
              borderRadius={2}
              border={`1px dashed ${Colors.LOGOColor}`}
            >
              <Typography>
                Please <Link
                  onClick={() => navigate('/login')}
                  sx={{
                    cursor: 'pointer',
                    color: Colors.LOGOlight,
                    fontWeight: 'bold'
                  }}
                >
                  sign in
                </Link> to leave a review
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Reviews List Section */}
      <Card sx={{ borderRadius: 3, boxShadow: 3,}}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{
              fontWeight: 'bold',
              color: Colors.LOGOColor,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Star sx={{ mr: 1, color: Colors.LOGOlight }} />
              Customer Reviews
            </Typography>
            <Box ml="auto" display="flex" alignItems="center">
              <Rating
                value={Number(averageRating)}
                precision={0.1}
                readOnly
                sx={{
                  mr: 1,
                  '& .MuiRating-iconFilled': {
                    color: Colors.LOGOlight,
                  }
                }}
              />
              <Typography sx={{ color: Colors.LOGOColor }}>
                {Number(averageRating || 0).toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </Typography>
            </Box>

          </Box>

          {reviews.length === 0 ? (
            <Box
              textAlign="center"
              p={4}
              bgcolor={Colors.lightBg}
              borderRadius={2}
              border={`1px dashed ${Colors.LOGOColor}`}
            >
              <Star sx={{
                fontSize: 60,
                color: Colors.LOGOlight,
                mb: 2,
                opacity: 0.7
              }} />
              <Typography variant="h6" gutterBottom sx={{ color: Colors.LOGOColor }}>
                No Reviews Yet
              </Typography>
              <Typography sx={{ color: Colors.textDark }}>
                Be the first to share your experience with this business
              </Typography>
            </Box>
          ) : (
            reviews.map((review) => (
              <Box 
                key={review._id}
                mb={3}
                pb={3}
                borderBottom={`1px solid ${Colors.LOGOlight}`}
              >
                <Box display="flex" >
                  <Avatar
                    src={review.reviewer?.avatar}
                    sx={{
                      width: 56,
                      height: 56,
                      mr: 2,
                      border: `2px solid ${Colors.LOGOColor}`,
                      bgcolor: Colors.lightBg
                    }}
                  />
                  <Box flex={1}>
                    <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                      <Typography fontWeight="bold" sx={{ color: Colors.LOGOColor }}>
                        {review.reviewer?.name || 'Anonymous'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: Colors.textDark }}>
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                    <Box my={1} display="flex" alignItems="center">
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
                          color: Colors.WHITE,
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    <Typography sx={{
                      color: Colors.textDark,
                      fontStyle: 'italic',
                      pl: 1,
                      borderLeft: `3px solid ${Colors.LOGOlight}`
                    }}>
                      "{review.comment}"
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