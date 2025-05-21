import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  ListItemText,
  ListItemIcon,
  InputBase,
  Paper,
  Button,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  AccountCircle as AccountCircleIcon,
  Business as BusinessIcon,
  Update as UpdateIcon,
  RateReview as ReviewsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const toggleMobileSearch = () => setShowMobileSearch(!showMobileSearch);

  const handleAddBusiness = () => {
    navigate("/add/business");
  };

 

 
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          zIndex: 1100,
          background: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", height: "76px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                component={Link}
                to="/"
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "rgb(132, 19, 149)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BusinessIcon fontSize="large" />
                OneClick
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Desktop Search */}
              <Paper
                component="form"
                sx={{
                  p: "2px 8px",
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  width: 300,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search businesses..."
                />
                <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
                  <SearchIcon sx={{ color: "#841395" }} />
                </IconButton>
              </Paper>

              {/* Desktop Add Business Button */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddBusiness}
                sx={{
                  display: { xs: "none", md: "flex" },
                  backgroundColor: "#841395",
                  color: "white",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontSize: "15px",
                  "&:hover": {
                    backgroundColor: "#6a0d7a",
                  },
                }}
              >
                Add Business
              </Button>

              {/* Mobile Search (hidden by default) */}
              {showMobileSearch && (
                <Paper
                  component="form"
                  sx={{
                    p: "2px 8px",
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                    width: "100vw%",
                    height:40,
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "76px",
                    zIndex: 1,
                    borderRadius: 0,
                    border: "1px solid #ddd",
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search businesses..."
                    autoFocus
                  />
                  <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
                    <SearchIcon sx={{ color: "#841395" }} />
                  </IconButton>
                </Paper>
              )}

              {/* Mobile Search and Add Buttons */}
              <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
                <IconButton
                  sx={{ color: "#841395" }}
                  onClick={toggleMobileSearch}
                  size="large"
               
                >
                  <SearchIcon fontSize="large" />
                </IconButton>
                <IconButton
                  sx={{ color: "#841395" }}
                  onClick={handleAddBusiness}
                  size="large"
                >
                  <AddIcon fontSize="large" />
                </IconButton>
              </Box>

              {/* Profile Menu */}
              <IconButton
                sx={{ color: "#841395" }}
                onClick={handleProfileClick}
                size="large"
              >
                <AccountCircleIcon fontSize="large" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    width: 220,
                    borderRadius: 2,
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                 <MenuItem component={Link} to="/profile" onClick={handleProfileClose}>
                  <ListItemIcon>
                    <UpdateIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Profile"/>
                </MenuItem>
                <MenuItem component={Link} to="/dashboard"  onClick={handleProfileClose}>
                  <ListItemIcon>
                    <UpdateIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard"/>
                </MenuItem>
                <MenuItem component={Link} to="/Added/business" onClick={handleProfileClose}>
                  <ListItemIcon>
                    <UpdateIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Added business" />
                </MenuItem>
                <MenuItem component={Link} to="/Updated/business"  onClick={handleProfileClose}>
                  <ListItemIcon>
                    <UpdateIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Update Business" />
                </MenuItem>
                <MenuItem component={Link} to="/quries" onClick={handleProfileClose}>
                  <ListItemIcon>
                    <UpdateIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Quries" />
                </MenuItem>
                <MenuItem component={Link} to="/reviews"onClick={handleProfileClose}>
                  <ListItemIcon>
                    <ReviewsIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Reviews" />
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem component={Link} to="/settings" onClick={handleProfileClose}>
                  <ListItemIcon>
                    <SettingsIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </MenuItem>
                <MenuItem component={Link} to="/logout" onClick={handleProfileClose}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      

      <Box sx={{ height: "76px" }} />
    </>
  );
};

export default Navbar;