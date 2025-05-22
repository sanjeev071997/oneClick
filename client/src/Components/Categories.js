import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../axiosInstance";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Get all categories list
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/v1/categories/get");
      setCategories(res.data.getCategories || []);
      setFilteredCategories(res.data.getCategories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const formatCategoryName = (name) => {
    if (name.length > 10) {
      const words = name.split(" ");
      if (words.length > 1) {
        const middle = Math.floor(words.length / 2);
        const firstLine = words.slice(0, middle).join(" ");
        const secondLine = words.slice(middle).join(" ");
        return (
          <>
            {firstLine}
            <br />
            {secondLine}
          </>
        );
      }
      return (
        <>
          {name.substring(0, 13)}
          <br />
          {name.substring(13)}
        </>
      );
    }
    return name;
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
    if (!open) {
      setSearchTerm(""); // Reset search when closing drawer
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mb: 3, fontSize: "1.25rem" }}
      >
        Popular Categories
      </Typography>
      <Grid container spacing={3}>
        {categories.slice(0, 19).map((category) => (
          <Grid item xs={4} sm={2.4} md={1.5} lg={1.2} key={category._id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={() =>
                navigate(`/category/${category.name}`, { state: { category } })
              }
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  mb: 1,
                  border: "0.6px solid #555",
                  borderRadius: "10px",
                  p: 1,
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                <img
                  src={
                    category.url ||
                    "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/hotkey_wedding_icon.gif?w=96&q=75"
                  }
                  alt={category.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, textAlign: "center" }}
              >
                {formatCategoryName(category.name)}
              </Typography>
            </Box>
          </Grid>
        ))}

        {/* 20th item - Menu button */}
        <Grid item xs={4} sm={2.4} md={1.5} lg={1.2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={toggleDrawer(true)}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                mb: 1,
                border: "0.6px solid #555",
                borderRadius: "10px",
                p: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              <MenuIcon sx={{
                backgroundColor: 'purple',
                color: 'white',
                borderRadius:'50%',
                p: 1.2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }} />
            </Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, textAlign: "center" }}
            >
              View All
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "90%", sm: 700,md:700 ,lg:950},
            p: 3,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          },
        }}
      >
        {/* Header with title and close button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            Popular Categories
          </Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search bar */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              style: {
                borderRadius: 8,
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </Box>

        {/* Categories list in 3-column grid */}
        <List
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
            gap: 1,
            overflow: "auto",
            maxHeight: "75vh",
            pr: 1,
          }}
        >
          {filteredCategories.map((category) => (
            <ListItem
              key={category._id}
              onClick={() => {
                navigate(`/category/${category.name}`, { state: { category } });
                setDrawerOpen(false);
              }}
              sx={{
                p: 1.2,
                borderRadius: 2,
                cursor: "pointer",
                transition: "background 0.3s",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <img
                  src={
                    category.url ||
                    "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/hotkey_wedding_icon.gif?w=96&q=75"
                  }
                  alt={category.name}
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              </ListItemIcon>
              <ListItemText
                primary={category.name}
                primaryTypographyProps={{ fontSize: 14 }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Categories;
