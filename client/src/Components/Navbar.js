import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
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
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Add as AddIcon,
  AccountCircle as AccountCircleIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Update as UpdateIcon,
  RateReview as ReviewsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

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
                <MenuItem component={Link} to="/dashboard" onClick={handleProfileClose}>
                  <ListItemIcon>
                    <DashboardIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </MenuItem>
                <MenuItem component={Link} to="/update-business" onClick={handleProfileClose}>
                  <ListItemIcon>
                    <UpdateIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Update Business" />
                </MenuItem>
                <MenuItem component={Link} to="/reviews" onClick={handleProfileClose}>
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

              <IconButton
                edge="end"
                aria-label="menu"
                sx={{ display: { xs: "block", md: "none" }, color: "#841395" }}
                onClick={handleDrawerToggle}
                size="large"
              >
                <MenuIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "85%", sm: 300 },
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              backgroundColor: "#841395",
              color: "white",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Menu
            </Typography>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                handleAddBusiness();
                handleDrawerToggle();
              }}
              sx={{
                backgroundColor: "#841395",
                color: "white",
                borderRadius: 1,
                py: 1.5,
                mb: 2,
                textTransform: "none",
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#6a0d7a",
                },
              }}
            >
              Add Business
            </Button>
          </Box>

          <List sx={{ flexGrow: 1 }}>
            <ListItem
              button
              component={Link}
              to="/dashboard"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                backgroundColor:
                  location.pathname === "/dashboard"
                    ? "rgba(132, 19, 149, 0.1)"
                    : "transparent",
              }}
            >
              <ListItemIcon>
                <DashboardIcon sx={{ color: "#841395" }} />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                primaryTypographyProps={{
                  fontWeight: location.pathname === "/dashboard" ? "600" : "400",
                }}
              />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/update-business"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                backgroundColor:
                  location.pathname === "/update-business"
                    ? "rgba(132, 19, 149, 0.1)"
                    : "transparent",
              }}
            >
              <ListItemIcon>
                <UpdateIcon sx={{ color: "#841395" }} />
              </ListItemIcon>
              <ListItemText
                primary="Update Business"
                primaryTypographyProps={{
                  fontWeight:
                    location.pathname === "/update-business" ? "600" : "400",
                }}
              />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/reviews"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                backgroundColor:
                  location.pathname === "/reviews"
                    ? "rgba(132, 19, 149, 0.1)"
                    : "transparent",
              }}
            >
              <ListItemIcon>
                <ReviewsIcon sx={{ color: "#841395" }} />
              </ListItemIcon>
              <ListItemText
                primary="Reviews"
                primaryTypographyProps={{
                  fontWeight: location.pathname === "/reviews" ? "600" : "400",
                }}
              />
            </ListItem>
          </List>

          <Box sx={{ p: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem
                button
                component={Link}
                to="/settings"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>
                  <SettingsIcon sx={{ color: "#841395" }} />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/logout"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "#841395" }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>

      <Box sx={{ height: "76px" }} />
    </>
  );
};

export default Navbar;
