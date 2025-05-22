import React, { useState, useEffect } from "react";
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
  List,
  ListItem,
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
import axios from "../axiosInstance";
import { useDispatch } from "react-redux";
import { logout } from '../redux/actions/userAction';
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const toggleMobileSearch = () => setShowMobileSearch(!showMobileSearch);

  const handleAddBusiness = () => navigate("/add/business");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/v1/categories/get");
      const cats = res.data.getCategories || [];
      setCategories(cats);
      setFilteredCategories(cats);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleCategorySelect = (category) => {
    navigate(`/category/${category.name}`, { state: { category } });
    setSearchTerm("");
    setFilteredCategories([]);
    setShowMobileSearch(false);
  };

  const handleLogout = () => {
    confirm({
      title: "Are you sure you want to Log out?",
      icon: <ExclamationCircleOutlined />,
      content: "Your current session will be terminated.",
      onOk() {
        dispatch(logout());
        localStorage.clear();
        message.success("Logout Successfully");
        navigate("/login");
        window.location.reload();
      },
    });
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
              <Box sx={{ position: "relative", display: { xs: "none", md: "block" } }}>
                <Paper
                  component="form"
                  sx={{
                    p: "2px 8px",
                    display: "flex",
                    alignItems: "center",
                    width: 300,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <IconButton type="submit" sx={{ p: "5px" }}>
                    <SearchIcon sx={{ color: "#841395" }} />
                  </IconButton>
                </Paper>

                {searchTerm && filteredCategories.length > 0 && (
                  <Paper
                    sx={{
                      position: "absolute",
                      top: "48px",
                      width: "100%",
                      maxHeight: "300px",
                      overflowY: "auto",
                      zIndex: 999,
                      border: "1px solid #ccc",
                    }}
                  >
                    <List>
                      {filteredCategories.map((cat) => (
                        <ListItem
                          key={cat._id}
                          button
                          onClick={() => handleCategorySelect(cat)}
                        >
                          <ListItemText primary={cat.name} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>

              {/* Desktop Add Business */}
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

              {/* Mobile Buttons */}
              <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
                <IconButton sx={{ color: "#841395" }} onClick={toggleMobileSearch}>
                  <SearchIcon fontSize="large" />
                </IconButton>
                <IconButton sx={{ color: "#841395" }} onClick={handleAddBusiness}>
                  <AddIcon fontSize="large" />
                </IconButton>
              </Box>

              {/* Profile Menu */}
              <IconButton sx={{ color: "#841395" }} onClick={handleProfileClick}>
                <AccountCircleIcon fontSize="large" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
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
                  <ListItemText primary="Profile" />
                </MenuItem>
                <MenuItem component={Link} to="/Added/business" onClick={handleProfileClose}>
                  <ListItemIcon>
                    <UpdateIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Added Business" />
                </MenuItem>
                <MenuItem component={Link} to="/Updated/business" onClick={handleProfileClose}>
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
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: "#841395" }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <Box
            sx={{
              position: "absolute",
              top: "76px",
              width: "100%",
              zIndex: 1200,
              backgroundColor: "#fff",
              px: 2,
              py: 1,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Paper
              sx={{
              mr:3.5,
                display: "flex",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: 2,
                px: 1,
              }}
            >
              <InputBase
                sx={{ flex: 1 }}
                placeholder="Search categories..."
                autoFocus
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <IconButton type="submit">
                <SearchIcon sx={{ color: "#841395" }} />
              </IconButton>
            </Paper>

            {searchTerm && filteredCategories.length > 0 && (
              <Paper
                sx={{
                  mr:3.5,
                  mt: 1,
                  maxHeight: 300,
                  overflowY: "auto",
                  border: "1px solid #ccc",
                }}
              >
                <List>
                  {filteredCategories.map((cat) => (
                    <ListItem
                      key={cat._id}
                      button
                      onClick={() => handleCategorySelect(cat)}
                    >
                      <ListItemText primary={cat.name} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        )}
      </AppBar>

      {/* Spacer */}
      <Box sx={{ height: "76px" }} />
    </>
  );
};

export default Navbar;
