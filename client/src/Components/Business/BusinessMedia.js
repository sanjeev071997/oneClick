// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Box,
//   Skeleton,
// } from "@mui/material";
// import { Colors } from "../../Comman";
// import { useParams } from "react-router-dom";
// import axios from "../../axiosInstance";

// const BusinessMedia = ({ business }) => {
//   const { id } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const businessId = id;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`/api/v1/product/get/${businessId}`);
//         setProducts(res.data?.data || []);
//       } catch (err) {
//         console.warn("Error loading product images");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (businessId) {
//       fetchProducts();
//     }
//   }, [businessId]);

//   // Collect all images
//   const businessImages = business?.images || [];
//   const productImages = products.flatMap((product) => product.images || []);
//   const allImages = [...businessImages, ...productImages];

//   return (
//     <Card
//       sx={{
//         borderRadius: 3,
//         boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//         overflow: "hidden",
//         background: Colors.WHITE,
//         p: 3,
//       }}
//     >
//       <CardContent>
//         <Typography
//           variant="h5"
//           fontWeight="bold"
//           gutterBottom
//           sx={{ color: Colors.LOGOColor }}
//         >
//           Media Gallery
//         </Typography>

//         {loading ? (
//           <Grid container spacing={2} mt={2}>
//             {Array.from({ length: 6 }).map((_, idx) => (
//               <Grid item xs={12} sm={6} md={4} key={idx}>
//                 <Skeleton variant="rectangular" height={200} />
//               </Grid>
//             ))}
//           </Grid>
//         ) : allImages.length > 0 ? (
//           <Grid container spacing={2} mt={2}>
//             {allImages.map((img, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <Box
//                   component="img"
//                   src={img.url}
//                   alt={`Media ${index + 1}`}
//                   sx={{
//                     width: "100%",
//                     height: 220,
//                     objectFit: "cover",
//                     borderRadius: 2,
//                     transition: "transform 0.3s ease",
//                     "&:hover": {
//                       transform: "scale(1.02)",
//                       boxShadow: `0 4px 20px ${Colors.LOGOColor}33`,
//                     },
//                   }}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         ) : (
//           <Typography
//             variant="body1"
//             sx={{ color: Colors.textDark, textAlign: "center", py: 4 }}
//           >
//             No media uploaded yet.
//           </Typography>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default BusinessMedia;

// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Skeleton,
// } from "@mui/material";
// import { useParams } from "react-router-dom";
// import axios from "../../axiosInstance";
// import Masonry from "@mui/lab/Masonry";
// import { Colors } from "../../Comman";

// const BusinessMedia = ({ business }) => {
//   const { id } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const businessId = id;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`/api/v1/product/get/${businessId}`);
//         setProducts(res.data?.data || []);
//       } catch (err) {
//         console.error("Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (businessId) {
//       fetchProducts();
//     }
//   }, [businessId]);

//   const businessImages = business?.images || [];
//   const productImages = products.flatMap((product) => product.images || []);
//   const allImages = [...businessImages, ...productImages];

//   return (
//     <Card sx={{ borderRadius: 3, background: Colors.WHITE, p: 3 }}>
//       <CardContent>
//         <Typography
//           variant="h5"
//           fontWeight="bold"
//           sx={{ color: Colors.LOGOColor, mb: 3 }}
//         >
//           Media Gallery
//         </Typography>

//         {loading ? (
//           <Box display="flex" flexWrap="wrap" gap={2}>
//             {Array.from({ length: 6 }).map((_, i) => (
//               <Skeleton key={i} variant="rectangular" width={250} height={200} />
//             ))}
//           </Box>
//         ) : allImages.length > 0 ? (
//           <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
//             {allImages.map((img, idx) => (
//               <Box
//                 key={idx}
//                 component="img"
//                 src={img.url}
//                 alt={`media-${idx}`}
//                 sx={{
//                   width: "100%",
//                   borderRadius: 2,
//                   boxShadow: 2,
//                   transition: "0.3s",
//                   "&:hover": {
//                     transform: "scale(1.02)",
//                   },
//                 }}
//               />
//             ))}
//           </Masonry>
//         ) : (
//           <Typography textAlign="center" color={Colors.textDark}>
//             No media uploaded yet.
//           </Typography>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default BusinessMedia;

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../axiosInstance";
import { Colors } from "../../Comman";
import CloseIcon from "@mui/icons-material/Close";

const BusinessMedia = ({ business }) => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const businessId = id;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/v1/product/get/${businessId}`);
        setProducts(res.data?.data || []);
      } catch (err) {
        console.error("Error loading product media");
      }
    };
    fetchProducts();
  }, [businessId]);

  const businessImages = business?.images || [];
  const productImages = products.flatMap((p) => p.images || []);
  const allImages = [...businessImages, ...productImages];

  const handleOpen = (imgUrl) => {
    setSelectedImage(imgUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box
    // sx={{ borderRadius: 3, background: Colors.WHITE, p: 3 }}s
    >
      <CardContent>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: Colors.LOGOColor, mb: 3 }}
        >
          Media Showcase
        </Typography>

        <Grid container spacing={2}>
          {allImages.map((img, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover img": {
                    transform: "scale(1.1)",
                  },
                  "&:hover .overlay": {
                    opacity: 1,
                  },
                }}
                onClick={() => handleOpen(img.url)}
              >
                <Box
                  component="img"
                  src={img.url}
                  alt={`media-${i}`}
                  sx={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    transition: "0.5s",
                  }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "0.3s ease-in-out",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  View
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Lightbox Dialog */}
        {/* <Dialog open={open} onClose={handleClose} maxWidth="lg">
          <DialogContent sx={{ position: "relative", p: 0 }}>
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
                background: "#fff",
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={selectedImage}
              alt="Full View"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          </DialogContent>
        </Dialog> */}
        <Dialog open={open} onClose={handleClose} fullScreen>
          <DialogContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000",
              p: 0,
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 2,
                backgroundColor: "#fff",
                color: "#000",
                "&:hover": {
                  backgroundColor: "#f1f1f1",
                  boxShadow: 2,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={selectedImage}
              alt="Full View"
              sx={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
                boxShadow: 4,
                borderRadius: 2,
              }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Box>
  );
};

export default BusinessMedia;
