import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";
import { PhotoCamera, Add, Close } from "@mui/icons-material";

const ImagesStep = ({ formData, setFormData, colors }) => {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const currentImagesCount = formData.images.length;
    const filesToAdd = files.slice(0, 5 - currentImagesCount);

    if (files.length > filesToAdd.length) {
      console.warn(`You can only upload 5 images. ${files.length - filesToAdd.length} were not added.`);
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...filesToAdd],
    }));
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box
          sx={{
            border: `2px dashed ${colors.LOGOColor}`,
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            backgroundColor: `${colors.LOGOColor}10`,
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: `${colors.LOGOColor}20`,
              transform: "translateY(-2px)",
            },
          }}
        >
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="business-images"
            type="file"
            multiple
            onChange={handleImageChange}
            disabled={formData.images.length >= 5}
          />
          <label htmlFor="business-images">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: `${colors.LOGOColor}20`,
                  width: 60,
                  height: 60,
                  mb: 2,
                }}
              >
                <PhotoCamera sx={{ fontSize: 30, color: colors.LOGOColor }} />
              </Avatar>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: colors.LOGOColor }}
              >
                Upload Business Images
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Drag & drop images here or click to browse (Max 5 images)
              </Typography>
              <Button
                variant="contained"
                component="span"
                startIcon={<Add />}
                disabled={formData.images.length >= 5}
                sx={{
                  backgroundColor: colors.LOGOlight,
                  '&:hover': {
                    backgroundColor: colors.LOGOColor,
                  },
                }}
              >
                Select Images
              </Button>
            </Box>
          </label>
        </Box>

        {formData.images.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle2" sx={{ color: colors.LOGOColor }}>
              Selected Images ({formData.images.length}/5)
            </Typography>
            <Grid container spacing={2}>
              {formData.images.map((img, idx) => (
                <Grid item xs={6} sm={4} md={3} key={idx}>
                  <Card sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={URL.createObjectURL(img)}
                      alt={img.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(idx)}
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        '&:hover': {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ImagesStep;