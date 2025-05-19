import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  IconButton,
  Pagination,
  Box,
  Button,
  Container,
  Breadcrumbs,
  Link as MUILink,
} from "@mui/material";
import { Link } from "react-router-dom";
import moment from "moment";
import { Delete } from "@mui/icons-material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SearchIcon from "@mui/icons-material/Search";
import { message, Modal } from "antd";
import { styled } from "@mui/material/styles";
import imageCompression from "browser-image-compression";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PageTitle from "../../Components/PageTitle";
import axios from "../../axiosInstance";
import EditCategories from "./EditCategories";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function TabPanel(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Categories = () => {
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  const itemsPerPage = 5;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Upload button functionality
  const VisuallyHiddenInput = styled("input")({
    display: "none",
  });

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/categories/get");
      if (data.success === true) {
        console.log("Fetched Categories: ", data?.getCategories);
        setCategories(data?.getCategories);
        setFilteredCategories(data?.getCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to refresh the Events & News data
  const refreshData = () => {
    fetchCategories(); // Refresh data after update
  };

  // Handle Search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredData = categories?.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredCategories(filteredData);
  };

  // delete User
  const { confirm } = Modal;
  const deleteCategories = async (id) => {
    confirm({
      title: "Are you sure you want to delete this Categories?",
      content: "This action cannot be undone. Please confirm.",
      okText: "Yes, Delete",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          const { data } = await axios.delete("/api/v1/categories/delete", {
            data: { id },
          });
          if (data?.success === true) {
            message.success(data?.message);
            fetchCategories();
          }
        } catch (error) {
          message.error(error?.response?.data?.message);
        }
      },
      onCancel() {
        console.log("Delete operation canceled");
      },
    });
  };

  // Handle Pagination
  const handlePageChange = (_, value) => setPage(value);
  const paginatedItems = filteredCategories?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Compress the image
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const maxSizeInMB = 25;

    if (file) {
      if (file.size / (1024 * 1024) > maxSizeInMB) {
        message.error(`Image size should not exceed ${maxSizeInMB} MB.`);
        return;
      }
      // Compress the image before conversion to base64
      const options = {
        maxSizeMB: 25,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageBase64 = reader.result;
          setImage(imageBase64);
          setImageBase64(imageBase64);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  // Handle add category API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      message.error("Please enter a category name");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryImage", image); // Assuming imageBase64 is a File object

    try {
      const { data } = await axios.post("/api/v1/categories/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data?.success) {
        message.success(data?.message || "Category added successfully!");
        setName("");
        setImageBase64("");
        setImage(null);
        fetchCategories();
        setValue(0);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Error adding category");
    }
  };

  return (
    <>
      <PageTitle title="Admin Categories List | One Click" />
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
        Categories
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
        <Typography sx={{ color: "primary.main" }}>Categories</Typography>
      </Breadcrumbs>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Categories List" {...TabPanel(0)} />
          <Tab label="Add Categories" {...TabPanel(1)} />
        </Tabs>
      </Box>
      {/* Categories List */}

      <CustomTabPanel value={value} index={0}>
        <Typography
          variant="h6"
          sx={{
            pb: 2,
            pt: 3,
            fontFamily: "Poppins, sans-serif",
            color: "#555",
            letterSpacing: "2.5px",
            lineHeight: 1.8,
          }}
        >
          Categories List
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Categories Name"
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <IconButton>
                <SearchIcon sx={{ color: "#1976d2" }} />
              </IconButton>
            ),
          }}
          sx={{
            mb: 3,
            mt: 2,
            bgcolor: "white",
            borderRadius: "20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
          }}
        />
        <Card sx={{ width: "100%", borderRadius: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              {paginatedItems?.map((item, index) => (
                <Grid
                  container
                  item
                  key={index}
                  alignItems="center"
                  justifyContent="space-between"
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Grid item xs={2} md={1}>
                    <IconButton
                      aria-label="number"
                      sx={{ fontSize: "16px", color: "#000" }}
                    >
                      {index + 1}
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteCategories(item._id)}
                    >
                      <Delete sx={{ color: "red" }} />
                    </IconButton>
                    <EditCategories
                      id={item._id}
                      name={item.name}
                      url={item.url}
                      refreshData={refreshData}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    md={11}
                    p={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center" gap={4}>
                      <img
                        src={item.url}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Create Date{" "}
                          {moment(item?.createdAt).format("MM/DD/YYYY")}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Pagination
              count={Math.ceil(filteredCategories.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />
          </CardContent>
        </Card>
      </CustomTabPanel>

      {/* Create a New Add Events & News */}
      <CustomTabPanel value={value} index={1} maxWidth>
        <Typography
          variant="h6"
          sx={{
            pb: 2,
            pt: 3,
            fontFamily: "Poppins, sans-serif",
            color: "#555",
            letterSpacing: "2.5px",
            lineHeight: 1.8,
          }}
        >
          Create a new Categories
        </Typography>
        <Container
          onSubmit={handleSubmit}
          component="form"
          className="form_style border-style"
          maxWidth
        >
          <h4>Add Categories</h4>

          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 3 }}>
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
                Category Image
              </Button>
            </label>
            {image && (
              <Box mt={3} display="flex" alignItems="center">
                <img
                  src={image}
                  alt="avatar"
                  style={{
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="courses_desc"
            sx={{
              mt: 3,
              borderRadius: "5px",
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              letterSpacing: ".1rem",
            }}
          >
            Add Category
          </Button>
        </Container>
      </CustomTabPanel>
    </>
  );
};

export default Categories;
