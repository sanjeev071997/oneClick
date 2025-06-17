

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
import axios from '../axiosInstance'; 

const ADS = () => {
  const [images, setImages] = useState([]);
  const [imageBase64List, setImageBase64List] = useState([]);
  const [loading, setLoading] = useState("")

  const VisuallyHiddenInput = styled("input")({
    display: "none",
  });

  const fetchAds = async () => {
    try {
      const response = await axios.get('/api/v1/ads/get');
      if (response.status === 200) {
        setImages(response.data.ADs); 
      } else {
        message.error("Failed to fetch ads.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("An error occurred while fetching ads.");
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
            let imageBase64 = reader.result;
            if (imageBase64.includes("base64,")) {
              base64Images.push(imageBase64.split("base64,")[1]);
            }
            resolve(imageBase64);
          };
          reader.readAsDataURL(compressedFile);
        });
      });
      const compressedImages = await Promise.all(promises);
      setImages(compressedImages.filter(Boolean));
      setImageBase64List(base64Images);
    } catch (error) {
      console.error("Error compressing images:", error);
    }
  };

// Upload Images 
const handleSubmit = async (event) => {
  event.preventDefault();

  if (imageBase64List.length === 0) {
    message.error("Please upload at least one image.");
    return;
  }

  try {
    const response = await axios.post('/api/v1/ads/upload', {
      images: imageBase64List,
    });

    if (response.status === 200) {
      message.success("Images uploaded successfully.");
      setImages([]);
      setImageBase64List([]);
    } else {
      message.error("Failed to upload images.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    message.error("An error occurred while uploading images.");
  }
};

// Delete ADs 
const handleDelete = async (publicId) => {
  if (!publicId) return;

  try {
    const response = await axios.delete('/api/v1/ads/delete', {
      data: { publicId } 
    });

    if (response.status === true) {
      message.success("Image deleted successfully.");
    } else {
      message.error("Failed to delete the image.");
    }
  } catch (error) {
    message.error("An error occurred while deleting the image.");
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
        About Highlights Images
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
        <Typography sx={{ color: "primary.main" }}>About Highlights</Typography>
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
            Upload About Images
          </Button>
        </label>
        {images?.length > 0 && (
          <Grid container spacing={2}>
            {images?.map((image, index) => (
              <Grid item key={index}>
                <img
                  src={image}
                  alt={`banner-preview-${index}`}
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
            // pb: 2,
            // pt: 3,
            fontFamily: "Poppins, sans-serif",
            color: "#555",
            letterSpacing: "2.5px",
          }}
        >
          All About Highlights
        </Typography>
        <Grid container spacing={2} mt={3} mb={5}>
          {images &&
            images?.map((image, index) => (
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
                    className="courses_desc"
                    color="error"
                    sx={{
                      mt: 1,
                      mb: 3,
                      // ml: 2,
                      borderRadius: "50px",
                      textTransform: "none",
                      fontFamily: "Poppins, sans-serif",
                      letterSpacing: ".1rem",
                    }}
                    onClick={() => handleDelete(image.publicId)}
                  >
                    {loading ? <CircularProgress size={24} /> : "Delete "}
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
                    alt={`uploaded-banner-${index}`}
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
export default ADS;
