import React, { useState } from "react";
import {
  Container,
  TextField,
  IconButton,
  Button,
  Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { message, Modal } from "antd";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import imageCompression from "browser-image-compression";
import axios from "../../axiosInstance";

const EditCategories = ({ id, name, refreshData, url }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(name);
  const [image, setImage] = useState(url || "");
  const [imageBase64, setImageBase64] = useState("");

  const handleClickOpen = () => {
    setCategoryName(name); // Reset to original name on open
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

   // Upload button functionality
    const VisuallyHiddenInput = styled("input")({
      display: "none",
    });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const maxSizeInMB = 25;

    if (file) {
      if (file.size / (1024 * 1024) > maxSizeInMB) {
        message.error(`Image size should not exceed ${maxSizeInMB} MB.`);
        return;
      }

      const options = {
        maxSizeMB: 25,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const imageUrl = URL.createObjectURL(compressedFile);
        setImage(imageUrl);
        setImageBase64(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  console.log(image, "url")

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    if (imageBase64) {
      formData.append("categoryImage", imageBase64); // Attach file directly
    }
  
    try {
      const { data } = await axios.put("/api/v1/categories/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (data?.success) {
        message.success(data?.message || "Category updated successfully");
        refreshData(); // Refresh category list
        handleClose();
      }
    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to update category");
    }
  };
  

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <EditIcon sx={{ color: "#1976d2" }} />
      </IconButton>

      <Modal
        title="Edit Category"
        open={isModalOpen}
        onCancel={handleClose}
        footer={null} // disable default footer
      >
        <Container
          component="form"
          onSubmit={handleSubmit}
          className="form_style border-style"
        >
          <TextField
            label="Category Name"
            fullWidth
            sx={{ mb: 3 }}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

<Box  sx={{mb:3}}>
            <VisuallyHiddenInput
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
              </Button>
            </label>
            {image && (
              <Box mt={3} mb={5} display="flex" alignItems="center">
                <img
                  src={image}
                  alt="avatar"
                  style={{
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
          </Box>

          <Button type="submit"  variant="contained" fullWidth>
            Update Category
          </Button>
        </Container>
      </Modal>
    </>
  );
};

export default EditCategories;
