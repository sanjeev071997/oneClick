// import React, { useState, useEffect } from 'react';
// import {
//   Box, Container, Typography, Avatar, Card, CardHeader, CardContent,
//   CardActions, Grid, Paper, Divider, Pagination, Rating, Chip,
//   Tooltip, IconButton, useTheme, useMediaQuery, CircularProgress
// } from '@mui/material';
// import {
//    Delete, Star, StarBorder, Business, ThumbUp, Reviews
// } from '@mui/icons-material';
// import { message, Modal } from "antd";
// import axios from '../../axiosInstance';
// import { Colors } from "../../Comman";

// const UserProductReviews = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [stats, setStats] = useState({
//     averageRating: 0,
//     totalReviews: 0,
//     recommendationRate: 0
//   });

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get('/api/v1/product/review/get');
//       if (Array.isArray(res.data.data)) {
//         const reviews = res.data.data;
//         setReviews(reviews);

//         const total = reviews.length;
//         const avgRating = total > 0
//           ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total).toFixed(1)
//           : 0;

//         const recommended = reviews.filter(r => r.rating >= 4).length;

//         setStats({
//           averageRating: avgRating,
//           totalReviews: total,
//           recommendationRate: total > 0 ? Math.round((recommended / total) * 100) : 0
//         });
//       }
//     } catch (err) {

//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const { confirm } = Modal;
//   const handleDelete = async (id) => {
//     confirm({
//       title: "Delete this review?",
//       content: "This action cannot be undone.",
//       okText: "Delete",
//       cancelText: "Cancel",
//       okButtonProps: { style: { background: Colors.LOGOColor } },
//       onOk: async () => {
//         try {
//           const data = await axios.delete(`/api/v1/product/review/delete`, {
//             data: { id },
//           });
//           if (data?.data?.success === true) {
//             message.success(data?.data?.message);
//             fetchReviews();
//           }
//         } catch (err) {
//           message.error(err || "Failed to delete review")
//         }
//       },
//     });
//   };

//   const paginatedReviews = reviews.slice((currentPage - 1) * 6, currentPage * 6);

//   return (
//     <Box sx={{ background: '#f9fafb', minHeight: '100vh', py: 4 }}>
//       <Container maxWidth="lg">
//         {/* Header Section */}
//         <Box textAlign="center" mb={6}>
//           <Typography
//             variant="h3"
//             sx={{
//               fontFamily: 'Poppins, sans-serif',
//               color: Colors.LOGOColor,
//               fontWeight: 700,
//               fontSize: isMobile ? '1.8rem' : '2.5rem',
//               position: 'relative',
//               display: 'inline-block',
//               '&:after': {
//                 content: '""',
//                 position: 'absolute',
//                 bottom: -8,
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//                 width: '80%',
//                 height: 4,
//                 background: `linear-gradient(to right, ${Colors.LOGOColor}, #9EDC29)`,
//                 borderRadius: 2
//               }
//             }}
//           >
//             Customer Product Reviews
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary" mt={2}>
//             See what our community is saying about businesses
//           </Typography>
//         </Box>

//         {/* Stats Cards - Compact Design */}
//         <Grid container spacing={2} mb={4}>
//           <Grid item xs={12} sm={4}>
//             <Paper elevation={0} sx={{
//               p: 2,
//               borderRadius: 2,
//               background: 'white',
//               height: '100%',
//               display: 'flex',
//               alignItems: 'center',
//               borderTop: `4px solid ${Colors.LOGOColor}`,
//               boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
//             }}>
//               <Box sx={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: '12px',
//                 bgcolor: '#e8f5e9',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 mr: 2,
//                 flexShrink: 0
//               }}>
//                 <Star sx={{ fontSize: 24, color: Colors.LOGOColor }} />
//               </Box>
//               <Box>
//                 <Typography variant="h4" fontWeight={700} color={Colors.LOGOColor}>
//                   {stats.averageRating}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Avg. Rating
//                 </Typography>
//               </Box>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <Paper elevation={0} sx={{
//               p: 2,
//               borderRadius: 2,
//               background: 'white',
//               height: '100%',
//               display: 'flex',
//               alignItems: 'center',
//               borderTop: `4px solid #9EDC29`,
//               boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
//             }}>
//               <Box sx={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: '12px',
//                 bgcolor: '#f0f7e8',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 mr: 2,
//                 flexShrink: 0
//               }}>
//                 <Reviews sx={{ fontSize: 24, color: '#9EDC29' }} />
//               </Box>
//               <Box>
//                 <Typography variant="h4" fontWeight={700} color={Colors.LOGOColor}>
//                   {stats.totalReviews}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Total Reviews
//                 </Typography>
//               </Box>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <Paper elevation={0} sx={{
//               p: 2,
//               borderRadius: 2,
//               background: 'white',
//               height: '100%',
//               display: 'flex',
//               alignItems: 'center',
//               borderTop: `4px solid ${Colors.LOGOlight}`,
//               boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
//             }}>
//               <Box sx={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: '12px',
//                 bgcolor: '#e3f2fd',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 mr: 2,
//                 flexShrink: 0
//               }}>
//                 <ThumbUp sx={{ fontSize: 24, color: Colors.LOGOlight }} />
//               </Box>
//               <Box>
//                 <Typography variant="h4" fontWeight={700} color={Colors.LOGOColor}>
//                   {stats.recommendationRate}%
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Recommended
//                 </Typography>
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>

//         {loading ? (
//           <Box textAlign="center" py={8}>
//             <CircularProgress size={60} thickness={4} sx={{ color: Colors.LOGOColor }} />
//           </Box>
//         ) : reviews.length > 0 ? (
//           <>
//             <Grid container spacing={4}>
//               {paginatedReviews.map((review) => (
//                 <Grid item key={review._id} xs={12} sm={6} md={4}>
//                   <Card elevation={0} sx={{
//                     mt:4,
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     borderRadius: 3,
//                     border: '1px solid rgba(0,0,0,0.08)',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                       transform: 'translateY(-5px)',
//                       boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
//                     }
//                   }}>
//                     <CardHeader
//                       avatar={
//                         <Box sx={{ position: 'relative' }}>
//                           <Tooltip title={review.businessId?.businessName || "Business"}>
//                             <Avatar
//                               src={review.businessId?.images?.[0]?.url || ''}
//                               alt={review.businessId?.businessName}
//                               sx={{
//                                 width: 56,
//                                 height: 56,
//                                 bgcolor: Colors.LOGOColor,
//                                 fontSize: 24,
//                                 fontWeight: 'bold'
//                               }}
//                             >
//                               {review.businessId?.businessName?.[0] || <Business />}
//                             </Avatar>
//                           </Tooltip>
//                           <Tooltip title={review.reviewer?.name || "User"}>
//                             <Avatar
//                               src={review.reviewer?.avatar || ''}
//                               alt={review.reviewer?.name}
//                               sx={{
//                                 width: 32,
//                                 height: 32,
//                                 position: 'absolute',
//                                 bottom: -8,
//                                 right: -8,
//                                 border: '2px solid white',
//                                 bgcolor: Colors.LOGOlight,
//                               }}
//                             >
//                               {review.reviewer?.name?.[0] || 'U'}
//                             </Avatar>
//                           </Tooltip>
//                         </Box>
//                       }
//                       title={
//                         <Box>
//                           <Typography fontWeight="bold" color={Colors.LOGOColor}>
//                             {review.businessId?.businessName || "Business"}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             Reviewed by {review.reviewer?.name || "Anonymous"}
//                           </Typography>
//                         </Box>
//                       }
//                       subheader={
//                         <Typography variant="caption" color="text.secondary">
//                           {new Date(review.createdAt).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'short',
//                             day: 'numeric'
//                           })}
//                         </Typography>
//                       }
//                       action={
//                         <Rating
//                           value={Number(review.rating)}
//                           readOnly
//                           precision={0.5}
//                           icon={<Star fontSize="small" htmlColor={Colors.LOGOlight} />}
//                           emptyIcon={<StarBorder fontSize="small" htmlColor={Colors.LOGOlight} />}
//                         />
//                       }
//                       sx={{
//                         pb: 0,
//                         alignItems: 'flex-start',
//                         '& .MuiCardHeader-content': {
//                           overflow: 'hidden'
//                         }
//                       }}
//                     />
//                     <CardContent sx={{ flexGrow: 1, py: 0 }}>
//                       <Typography
//                         variant="body1"
//                         sx={{
//                           fontStyle: 'italic',
//                           color: 'text.primary',
//                           position: 'relative',
//                           pl: 2,
//                           '&:before': {
//                             content: '"“"',
//                             position: 'absolute',
//                             left: 0,
//                             top: 0,
//                             fontSize: '2rem',
//                             color: Colors.LOGOlight,
//                             lineHeight: 1
//                           }
//                         }}
//                       >
//                         {review.comment}
//                       </Typography>
//                     </CardContent>
//                     <Divider sx={{ my: 2 }} />
//                     <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
//                       <Chip
//                         icon={<Star fontSize="small" htmlColor={Colors.LOGOlight} />}
//                         label={`${review.rating}`}
//                         sx={{
//                           backgroundColor: '#f0f7e8',
//                           color: Colors.LOGOColor,
//                           fontWeight: 'bold',
//                         }}
//                       />
//                       <Box>
//                         <Tooltip title="Delete review">
//                           <IconButton
//                             onClick={() => handleDelete(review._id)}
//                             sx={{
//                               color: Colors.LOGOlight,
//                               '&:hover': {
//                                 backgroundColor: 'rgba(158, 220, 41, 0.1)'
//                               }
//                             }}
//                           >
//                             <Delete fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </Box>
//                     </CardActions>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>

//             {/* Pagination */}
//             {reviews.length > 6 && (
//               <Box display="flex" justifyContent="center" mt={6}>
//                 <Pagination
//                   count={Math.ceil(reviews.length / 6)}
//                   page={currentPage}
//                   onChange={handlePageChange}
//                   color="primary"
//                   size="large"
//                   shape="rounded"
//                   sx={{
//                     '& .MuiPaginationItem-root': {
//                       color: Colors.LOGOColor,
//                       border: '1px solid rgba(0,0,0,0.1)',
//                       '&:hover': {
//                         backgroundColor: 'rgba(39, 85, 89, 0.1)'
//                       }
//                     },
//                     '& .MuiPaginationItem-root.Mui-selected': {
//                       backgroundColor: Colors.LOGOColor,
//                       color: 'white',
//                       '&:hover': {
//                         backgroundColor: Colors.LOGOColor
//                       }
//                     },
//                   }}
//                 />
//               </Box>
//             )}
//           </>
//         ) : (
//           <Paper elevation={0} sx={{
//             p: 6,
//             textAlign: 'center',
//             borderRadius: 3,
//             background: 'white'
//           }}>
//             <Star sx={{
//               fontSize: 60,
//               color: Colors.LOGOlight,
//               mb: 2,
//               opacity: 0.7
//             }} />
//             <Typography variant="h5" color={Colors.LOGOColor} gutterBottom>
//               No Reviews Yet
//             </Typography>
//           </Paper>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default UserProductReviews;

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Pagination,
  Avatar,
} from "@mui/material";
import { Delete, Star, ThumbUp, Reviews, Business } from "@mui/icons-material";
import { Modal, message } from "antd";
import axios from "../../axiosInstance";
import { Colors } from "../../Comman";

const UserProductReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    recommendationRate: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/product/review/get");
      if (Array.isArray(res.data.data)) {
        const reviews = res.data.data;
        setReviews(reviews);

        const total = reviews.length;
        const avgRating =
          total > 0
            ? (
                reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
                total
              ).toFixed(1)
            : 0;

        const recommended = reviews.filter((r) => r.rating >= 4).length;

        setStats({
          averageRating: avgRating,
          totalReviews: total,
          recommendationRate:
            total > 0 ? Math.round((recommended / total) * 100) : 0,
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
          const data = await axios.delete(`/api/v1/product/review/delete`, {
            data: { id },
          });
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

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * 6,
    currentPage * 6
  );

  return (
    <Box sx={{ background: "#f9fafb", minHeight: "100vh" }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" color="primary" mb={3}>
          {" "}
          Customer Product Reviews
        </Typography>

        {/* Stats */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                borderTop: `4px solid ${Colors.LOGOColor}`,
              }}
            >
              <Box display="flex" alignItems="center">
                <Star sx={{ fontSize: 40, color: Colors.LOGOColor, mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color={Colors.LOGOColor}
                  >
                    {stats.averageRating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Rating
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{ p: 2, borderRadius: 2, borderTop: `4px solid #9EDC29` }}
            >
              <Box display="flex" alignItems="center">
                <Reviews sx={{ fontSize: 40, color: "#9EDC29", mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color={Colors.LOGOColor}
                  >
                    {stats.totalReviews}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reviews
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                borderTop: `4px solid ${Colors.LOGOlight}`,
              }}
            >
              <Box display="flex" alignItems="center">
                <ThumbUp
                  sx={{ fontSize: 40, color: Colors.LOGOlight, mr: 2 }}
                />
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color={Colors.LOGOColor}
                  >
                    {stats.recommendationRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recommended
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Table */}
        {loading ? (
          <Box textAlign="center" py={8}>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: Colors.LOGOColor }}
            />
          </Box>
        ) : reviews.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: Colors.LOGOColor }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Product
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Reviewer
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Rating
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Comment
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReviews.map((review) => (
                    <TableRow key={review._id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={review.productId?.images?.[0]?.url || ""}
                            alt={review.productId?.name}
                            sx={{ mr: 1, bgcolor: Colors.LOGOColor }}
                          >
                            {review.productId?.name?.[0] || <Business />}
                          </Avatar>
                          {review.productId?.name || "Product"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={review.reviewer?.avatar || ""}
                            alt={review.reviewer?.name}
                            sx={{ mr: 1, bgcolor: Colors.LOGOlight }}
                          >
                            {review.reviewer?.name?.[0] || "U"}
                          </Avatar>
                          {review.reviewer?.name || "Anonymous"}
                        </Box>
                      </TableCell>
                      <TableCell>{review.rating}</TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete review">
                          <IconButton
                           color="error"
                            onClick={() => handleDelete(review._id)}
                          >
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
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              background: "white",
            }}
          >
            <Star
              sx={{
                fontSize: 60,
                color: Colors.LOGOlight,
                mb: 2,
                opacity: 0.7,
              }}
            />
            <Typography variant="h5" color={Colors.LOGOColor} gutterBottom>
              No Reviews Yet
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default UserProductReviews;
