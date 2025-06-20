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
  Mic as MicIcon,
} from "@mui/icons-material";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import LoginIcon from '@mui/icons-material/Login';
import axios from "../axiosInstance";
import { logout } from '../redux/actions/userAction';
import { Colors, FontSize, FontWeight, FontFamily } from "../Comman"

const { confirm } = Modal;

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isListening, setIsListening] = useState(false); // Voice search state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Voice recognition setup
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setSearchTerm(transcript);
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(transcript.toLowerCase())
    );
    setFilteredCategories(filtered);
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    setIsListening(false);
    message.error('Voice recognition failed. Please try again.');
  };

  const startVoiceSearch = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopVoiceSearch = () => {
    setIsListening(false);
    recognition.stop();
  };

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const toggleMobileSearch = () => setShowMobileSearch(!showMobileSearch);

  const handleAddBusiness = () => navigate("/plans");

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
    return () => {
      recognition.abort();
    };
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
        sessionStorage.setItem("justLoggedOut", "true");
        dispatch(logout());
        localStorage.clear();
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          top: 0,
          zIndex: 1100,
          background: Colors.LOGOColor,
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
                  fontFamily:FontFamily.arial,
                  fontWeight: FontWeight.bold,
                  color: Colors.WHITE,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
             Quickdials
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
                    width: 400,
                    border: "1px solid ",
                    borderColor:Colors.LOGOColor,
                    borderRadius: 2,
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <IconButton
                    type="button"
                    onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                    sx={{
                      p: "5px",
                      color: isListening ? Colors.LOGOlight: Colors.LOGOColor
                    }}
                  >
                    <MicIcon />
                  </IconButton>
                  <IconButton type="submit" sx={{ p: "5px" }}>
                    <SearchIcon sx={{ color: Colors.LOGOColor}} />
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
                  backgroundColor:Colors.WHITE,
                  color: Colors.LOGOColor,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontFamily:FontFamily.arial,
                  textTransform: "none",
                  fontSize: FontSize.fifteen,
                
                }}
              >
                Add Business
              </Button>

              {/* Mobile Buttons */}
              <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
                <IconButton sx={{ color: Colors.WHITE}} onClick={toggleMobileSearch}>
                  <SearchIcon fontSize="large" />
                </IconButton>
                <IconButton sx={{ color: Colors.WHITE}} onClick={handleAddBusiness}>
                  <AddIcon fontSize="large" />
                </IconButton>
              </Box>

              {/* Profile Menu */}
              {user && user._id  ? (
                <>
                  <IconButton sx={{ color: Colors.WHITE}} onClick={handleProfileClick}>
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
                        bgcolor:Colors.LOGOColor,
                        width: 220,
                        borderRadius: 2,
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <MenuItem component={Link} to="/Added/business" onClick={handleProfileClose}>
                      <ListItemIcon>
                        <UpdateIcon sx={{ color:Colors.WHITE}} />
                      </ListItemIcon>
                      <ListItemText primary="Business"  sx={{ color:Colors.WHITE}}/>
                    </MenuItem>

                    <MenuItem component={Link} to="/quries" onClick={handleProfileClose}>
                      <ListItemIcon>
                        <UpdateIcon sx={{ color: Colors.WHITE }} />
                      </ListItemIcon>
                      <ListItemText primary="Inquiries"  sx={{ color:Colors.WHITE}}/>
                    </MenuItem>

                    <MenuItem component={Link} to="/reviews" onClick={handleProfileClose}>
                      <ListItemIcon>
                        <ReviewsIcon sx={{ color:Colors.WHITE}} />
                      </ListItemIcon>
                      <ListItemText primary="Reviews"  sx={{ color:Colors.WHITE}}/>
                    </MenuItem>
                    <MenuItem component={Link} to="/plans/view" onClick={handleProfileClose}>
                      <ListItemIcon>
                      <CurrencyRupeeIcon sx={{ color:Colors.WHITE }} />
                      </ListItemIcon>
                      <ListItemText primary="Plans" sx={{ color:Colors.WHITE}} />
                    </MenuItem>

                    <Divider sx={{ my: 0.5 }} />

                    <MenuItem component={Link} to="/settings" onClick={handleProfileClose}>
                      <ListItemIcon>
                        <SettingsIcon sx={{ color:Colors.WHITE }} />
                      </ListItemIcon>
                      <ListItemText primary="Settings" sx={{ color:Colors.WHITE}} />
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon sx={{ color: Colors.WHITE }} />
                      </ListItemIcon>
                      <ListItemText primary="Logout" sx={{ color:Colors.WHITE}}/>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: Colors.WHITE,
                  color: Colors.LOGOColor,
                  textTransform: "none",
                  fontFamily: FontFamily.arial,
                  fontSize: FontSize.fifteen,
                  borderRadius: 2,
                  px: 2,
                  py: 0.8,
                 
                }}
              >
                Login
              </Button>
              )}
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
                mr: 3.5,
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
              <IconButton
                onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                sx={{ color: isListening ? "red" : Colors.LOGOColor}}
              >
                <MicIcon />
              </IconButton>
              <IconButton type="submit">
                <SearchIcon sx={{ color: Colors.LOGOColor}} />
              </IconButton>
            </Paper>

            {searchTerm && filteredCategories.length > 0 && (
              <Paper
                sx={{
                  mr: 3.5,
                  mt: 1,
                  maxHeight: 300,
                  overflowY: "auto",
                  border: "1px solid ",
                 
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