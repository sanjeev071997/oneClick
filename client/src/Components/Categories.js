import React, { useEffect, useState } from "react";
import {
  Container,
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
  useMediaQuery,
  useTheme,
  Badge,
  Avatar,
  Chip
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import axios from "../axiosInstance";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Get all categories list
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/v1/categories/get");
      const sortedCategories = (res.data.getCategories || [])
        .sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedCategories);
      setFilteredCategories(sortedCategories);
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
      setSelectedCategory(null);
    }
  };

  const handleCategoryClick = (category) => {
    if (isMobile) {
      setSelectedCategory(category);
    } else {
      navigate(`/category/${category.name}`, { state: { category } });
      setDrawerOpen(false);
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} thickness={4} color="primary" />
      </Container>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: '1800px', margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3, 
        gap: 1.5,
        mt: { xs: 1, sm: 2 },
        px: { xs: 1, sm: 0 }
      }}>
        <Badge 
          badgeContent={categories.length} 
          color="primary" 
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              right: 8,
              top: 8,
              border: `2px solid ${theme.palette.background.paper}`,
              padding: '0 4px',
              fontWeight: 'bold'
            }
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              boxShadow: theme.shadows[2]
            }}
          >
            <LocalOfferIcon 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.8rem' },
                transition: 'transform 0.3s',
                ':hover': { transform: 'rotate(15deg)' } 
              }} 
            />
          </Avatar>
        </Badge>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: '0.5px',
            color: 'primary.main',
            fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.7rem' },
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '4px',
              bottom: -6,
              left: 0,
              background: theme.palette.mode === 'light' 
                ? 'linear-gradient(90deg, #3f51b5, #ff4081)'
                : 'linear-gradient(90deg, #7986cb, #ff80ab)',
              opacity: 0.8,
              borderRadius: '3px'
            }
          }}
        >
          Popular Categories
        </Typography>
      </Box>

      {/* Main Categories Grid */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {categories.slice(0, 19).map((category) => (
          <Grid 
            item 
            xs={4} 
            sm={2.4} 
            md={1.5} 
            lg={1.2} 
            key={category._id}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: '100%',
                maxWidth: '120px'
              }}
              onClick={() => handleCategoryClick(category)}
            >
              <Box
                sx={{
                  width: { xs: 48, sm: 56, md: 64 },
                  height: { xs: 48, sm: 56, md: 64 },
                  mb: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "12px",
                  p: 1,
                  cursor: "pointer",
                  transition: 'all 0.3s ease',
                  backgroundColor: theme.palette.background.paper,
                  "&:hover": {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                    borderColor: theme.palette.primary.main
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
                    borderRadius: "8px",
                  }}
                  loading="lazy"
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ 
                  fontWeight: 600, 
                  textAlign: "center",
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  lineHeight: 1.3,
                  color: theme.palette.text.primary
                }}
              >
                {formatCategoryName(category.name)}
              </Typography>
            </Box>
          </Grid>
        ))}

        {/* View All Button */}
        <Grid 
          item 
          xs={4} 
          sm={2.4} 
          md={1.5} 
          lg={1.2}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: '100%',
              maxWidth: '120px'
            }}
            onClick={toggleDrawer(true)}
          >
            <Box
              sx={{
                width: { xs: 48, sm: 56, md: 64 },
                height: { xs: 48, sm: 56, md: 64 },
                mb: 1,
                border: `1px dashed ${theme.palette.primary.main}`,
                borderRadius: "12px",
                p: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: 'all 0.3s ease',
                backgroundColor: theme.palette.primary.light,
                "&:hover": {
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[4],
                  backgroundColor: theme.palette.primary.lighter
                },
              }}
            >
              <MenuIcon sx={{
                color: theme.palette.primary.main,
                fontSize: { xs: '1.5rem', sm: '1.8rem' },
              }} />
            </Box>
            <Typography
              variant="body2"
              sx={{ 
                fontWeight: 600, 
                textAlign: "center",
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: theme.palette.primary.main
              }}
            >
              View All
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Categories Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
            maxWidth: '950px',
            p: { xs: 2, sm: 3 },
            borderTopLeftRadius: { xs: 0, sm: 12 },
            borderBottomLeftRadius: { xs: 0, sm: 12 },
            boxShadow: theme.shadows[16],
            overflow: 'hidden'
          },
        }}
      >
        {/* Header with title and close button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          sx={{
            position: 'sticky',
            top: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1,
            pt: 1,
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box display="flex" alignItems="center">
            {selectedCategory && (
              <IconButton 
                onClick={() => setSelectedCategory(null)}
                sx={{ mr: 1 }}
              >
                <ChevronRightIcon />
              </IconButton>
            )}
            <Typography variant="h5" fontWeight="bold">
              {selectedCategory ? selectedCategory.name : "All Categories"}
            </Typography>
          </Box>
          <IconButton 
            onClick={toggleDrawer(false)}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search bar */}
        {!selectedCategory && (
          <Box mb={3} sx={{ position: 'sticky', top: 64, zIndex: 1, backgroundColor: theme.palette.background.paper }}>
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
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 8,
                  backgroundColor: theme.palette.background.default,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 1
                  }
                }
              }}
            />
          </Box>
        )}

        {/* Category Details View */}
        {selectedCategory ? (
          <Box sx={{ p: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              alignItems: 'center', 
              mb: 3,
              gap: 2
            }}>
              <Avatar
                src={selectedCategory.url}
                alt={selectedCategory.name}
                sx={{ 
                  width: 80, 
                  height: 80,
                  borderRadius: '12px',
                  boxShadow: theme.shadows[2]
                }}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {selectedCategory.name}
                </Typography>
                {selectedCategory.description && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedCategory.description}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Popular in this category
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                mt: 2
              }}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Chip
                    key={index}
                    label={`Item ${index + 1}`}
                    clickable
                    sx={{
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                About this category
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedCategory.description || 
                  `Explore a wide range of ${selectedCategory.name.toLowerCase()} options. Find the best deals and quality products in this category.`}
              </Typography>
            </Box>
            
            <Box sx={{ 
              mt: 4,
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Chip
                label={`Browse ${selectedCategory.name}`}
                color="primary"
                onClick={() => {
                  navigate(`/category/${selectedCategory.name}`, { state: { category: selectedCategory } });
                  setDrawerOpen(false);
                }}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </Box>
        ) : (
          /* Categories List */
          <List
            sx={{
              display: "grid",
              gridTemplateColumns: { 
                xs: "1fr", 
                sm: "repeat(2, 1fr)", 
                md: "repeat(3, 1fr)" 
              },
              gap: 1,
              overflow: "auto",
              maxHeight: "calc(100vh - 180px)",
              pr: 1,
              mt: 1
            }}
          >
            {filteredCategories.map((category) => (
              <ListItem
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                sx={{
                  p: 1.2,
                  borderRadius: '8px',
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    transform: 'translateX(4px)'
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar
                    src={
                      category.url ||
                      "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/hotkey_wedding_icon.gif?w=96&q=75"
                    }
                    alt={category.name}
                    sx={{ 
                      width: 36, 
                      height: 36,
                      borderRadius: '8px',
                      backgroundColor: theme.palette.grey[200]
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={category.name}
                  primaryTypographyProps={{ 
                    fontSize: 14,
                    fontWeight: 500 
                  }}
                />
                <ChevronRightIcon 
                  sx={{ 
                    color: theme.palette.action.active,
                    fontSize: '1.25rem'
                  }} 
                />
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>
    </Box>
  );
};

export default Categories;