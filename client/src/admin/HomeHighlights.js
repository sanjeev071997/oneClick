// import React from 'react'

// const HomeHighlights = () => {
//   return (
//     <div>HomeHighlights</div>
//   )
// }

// export default HomeHighlights

import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Breadcrumbs,
  Link as MUILink,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { message } from "antd";
import imageCompression from "browser-image-compression";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PageTitle from "../Components/PageTitle";
import axios from "../axiosInstance";

const HomeHighlights = () => {
  const [uploadedImages, setUploadedImages] = useState([]); // from server
  const [previewImages, setPreviewImages] = useState([]);   // for new uploads
  const [imageBase64List, setImageBase64List] = useState([]);
  const [loading, setLoading] = useState(false);

  const VisuallyHiddenInput = styled("input")({
    display: "none",
  });

  const fetchAds = async () => {
    try {
      const response = await axios.get("/api/v1/homehighlights/get");
       if (response.data.success === true) {
        setUploadedImages(response.data.homeHighlights || []);
      } else {
        message.error("Failed to fetch home highlights.");
      }
    } catch (error) {
      message.error(error.response.data.message ||"An error occurred while fetching home highlights.");
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const maxSizeInMB = 5;
    const base64Images = [];
    const previews = [];

    try {
      const promises = Array.from(files).map(async (file) => {
        if (file.size / (1024 * 1024) > maxSizeInMB) {
          message.error(`Image size should not exceed ${maxSizeInMB} MB.`);
          return null;
        }

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();

        return new Promise((resolve) => {
          reader.onloadend = () => {
            const base64 = reader.result;
            previews.push(base64);
            if (base64.includes("base64,")) {
              base64Images.push(base64.split("base64,")[1]);
            }
            resolve();
          };
          reader.readAsDataURL(compressedFile);
        });
      });

      await Promise.all(promises);
      setPreviewImages(previews);
      setImageBase64List(base64Images);
    } catch (error) {
      console.error("Compression error:", error);
    }
  };

    // Handle form submission to upload images
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (imageBase64List.length === 0) {
      message.error("Please upload at least one image.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/v1/homehighlights/upload", {
        images: imageBase64List,
      });

       if (response.data.success === true) {
        message.success(response.data.message || "Images uploaded successfully.");
        setPreviewImages([]);
        setImageBase64List([]);
        fetchAds();
      } else {
        message.error("Failed to upload images.");
      }
    } catch (error) {
      message.error(error.response.data.message ||"An error occurred while uploading images.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (publicId) => {
    if (!publicId) return;

    setLoading(true);
    try {
      const response = await axios.delete("/api/v1/homehighlights/delete", {
        data: { publicId },
      });

      if (response.data.success === true) {
        message.success(response.data.message || "Image deleted successfully.");
        fetchAds();
      } else {
        message.error("Failed to delete the image.");
      }
    } catch (error) {
      message.error(error.response.data.message || "An error occurred while deleting the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle
        title="Manage About Page Highlights - Admin Panel | Shree Manglam Shikshan Sansthan"
        description="Upload and manage highlight images for the About Us page of Shree Manglam Shikshan Sansthan. Showcase the school’s achievements, activities, and environment visually."
        url="/admin/institute/about"
        keywords="about highlights images, about us section banners, Shree Manglam highlights, school activity photos, admin about images management"
      />

      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{
          mb: 3,
          fontFamily: "Poppins, sans-serif",
          color: "#2C3E50",
          letterSpacing: "2.5px",
          lineHeight: 1.8,
        }}
      >
        Home Highlights Images
      </Typography>

      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          mb: 5,
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <MUILink
          component={Link}
          to="/dashboard"
          sx={{ color: "inherit", textDecoration: "none" }}
        >
          Dashboard
        </MUILink>
        <Typography sx={{ color: "primary.main" }}>Home Highlights</Typography>
      </Breadcrumbs>

      <Box component="form" onSubmit={handleSubmit}>
        <VisuallyHiddenInput
          accept="image/*"
          id="contained-button-file"
          type="file"
          multiple
          onChange={handleImageUpload}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="outlined"
            color="primary"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{
              mb: 3,
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            Upload Home Highlights Images
          </Button>
        </label>

        {previewImages.length > 0 && (
          <Grid container spacing={2} mb={3}>
            {previewImages.map((img, index) => (
              <Grid item key={index}>
                <img
                  src={img}
                  alt={`preview-${index}`}
                  style={{
                    height: "100px",
                    width: "100px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <Box>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              mb: 5,
              mt: 2,
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Add Image"}
          </Button>
        </Box>

        <hr />

        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins, sans-serif",
            color: "#555",
            letterSpacing: "2.5px",
          }}
        >
          All Home Highlights
        </Typography>

        <Grid container spacing={2} mt={3} mb={5}>
          {uploadedImages.map((image, index) => (
            <Grid
              container
              item
              key={index}
              alignItems="center"
              sx={{ mr: { md: 2, xs: 2 }, ml: { md: 0, xs: 2 } }}
            >
              <Grid item md={1.8} sm={12} xs={12}>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    mt: 1,
                    mb: 3,
                    borderRadius: "50px",
                    textTransform: "none",
                    fontFamily: "Poppins, sans-serif",
                    letterSpacing: ".1rem",
                  }}
                  onClick={() => handleDelete(image.publicId)}
                >
                  {loading ? <CircularProgress size={24} /> : "Delete"}
                </Button>
              </Grid>

              <Grid
                item
                md={10.2}
                sm={12}
                xs={12}
                sx={{
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <img
                  src={image.imageUrl}
                  alt={`uploaded-${index}`}
                  style={{
                    height: "300px",
                    width: "100%",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default HomeHighlights;
