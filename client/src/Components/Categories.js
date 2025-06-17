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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { Colors, FontWeight,FontFamily } from "../Comman";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      setSearchTerm("");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1500, margin: "0 auto" }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: FontWeight.heading1,
          mb: 3,
          fontSize: { xs: "1.3rem", sm: "1.6rem" },
          color: Colors.LOGOColor,
          display: "inline-block",
          px: 3,
          py: 1,
          fontFamily:FontFamily.Georgia,
          borderLeft: "4px solid",
          borderColor: Colors.LOGOlight,
          bgcolor: "rgba(0, 0, 0, 0.02)",
          borderRadius: "0 8px 8px 0",
        }}
      >
        Popular Categories
      </Typography>

      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {categories?.slice(0, 19).map((category) => (
          <Grid item xs={4} sm={2.4} md={1.7} lg={1.2} key={category._id}>
            <Box
              sx={{
  
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              onClick={() =>
                navigate(`/category/${category.name}`, { state: { category } })
              }
            >
              <Box
                sx={{
                  width: { xs: 45, sm: 50, md: 60 },
                  height: { xs: 45, sm: 50, md: 60 },
                  mb: 1,
                  border: "1px solid",
                  
                  borderColor: Colors.LOGOColor,
                  borderRadius: "12px",
                  p: 1,
                  cursor: "pointer",
                  backgroundColor: "background.paper",
                  boxShadow: 1,
                  "&:hover": {
                    boxShadow: 3,
                    borderColor: Colors.LOGOlight,
                  },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
                    // objectFit: "contain",
                    borderRadius: "8px",
                  }}
                  loading="lazy"
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  textAlign: "center",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  lineHeight: 1.2,
                  color: Colors.LOGOColor,
                }}
              >
                {formatCategoryName(category.name)}
              </Typography>
            </Box>
          </Grid>
        ))}

        {/* View All Drawer Button */}
        <Grid item xs={4} sm={2.4} md={1.7} lg={1.2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={toggleDrawer(true)}
          >
            <Box
              sx={{
                width: { xs: 45, sm: 50, md: 60 },
                height: { xs: 45, sm: 50, md: 60 },
                mb: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "12px",
                p: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "background.paper",
                boxShadow: 1,
                "&:hover": {
                  boxShadow: 3,
                  borderColor: Colors.LOGOlight,
                },
              }}
            >
              <MenuIcon
                sx={{
                  backgroundColor: Colors.LOGOlight,
                  color: Colors.WHITE,
                  borderRadius: "50%",
                  p: 1.2,
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: Colors.LOGOColor,
                fontWeight: 500,
                textAlign: "center",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
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
            width: { xs: "90%", sm: 700, md: 800 },
            p: 3,
            boxShadow: theme.shadows[10],
          },
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: Colors.LOGOColor}}>
            All Categories
          </Typography>
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{
              color: Colors.BLACK,
             
            }}
          >
            <CloseIcon sx={{color:Colors.LOGOlight}} />
          </IconButton>
        </Box>

        {/* Search */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search categories..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: Colors.LOGOColor}} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: "background.paper",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "divider",
                },
                "&:hover fieldset": {
                  borderColor: Colors.LOGOColor,
                },
                
              },
            }}
          />
        </Box>

        {/* Categories List */}
        <List
          sx={{
          
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 1,
            overflow: "auto",
            maxHeight: "75vh",
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: Colors.LOGOColor,
              borderRadius: "3px",
            },
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
                mt:1,
                p: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "action.hover",
                  borderLeft: `3px solid ${Colors.LOGOlight}`,
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
                  style={{
                    width: 30,
                    height: 30,
                    // objectFit: "contain",
                    borderRadius: "6px",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={category.name}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: Colors.BLACK,
                }}
              />
            </ListItem>
          ))}
          {filteredCategories.length === 0 && (
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                gridColumn: "1 / -1",
                mt: 3,
              }}
            >
              No categories found matching your search
            </Typography>
          )}
        </List>
      </Drawer>
    </Box>
  );
};

export default Categories;
