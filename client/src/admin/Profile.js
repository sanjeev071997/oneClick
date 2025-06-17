import React, { useState, useEffect } from "react";
import {
  Avatar,
  Container,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Breadcrumbs,
  Link as MUILink,
  Grid,
  Card,
  CardContent,
  Divider,
  Tab,
  Tabs,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  clearErrors,
  updateProfile,
  updatePassword,
  reloadUser,
} from "../redux/actions/userAction";
import { UPDATE_PROFILE_RESET, UPDATE_PASSWORD_RESET } from "../redux/constants/userConstants";
import { message } from "antd";
import EditIcon from "@mui/icons-material/Edit";
import Password from "@mui/icons-material/Password";
import moment from "moment";
import PageTitle from "../Components/PageTitle";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);
  const [value, setValue] = useState(0);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowNewConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () => setShowNewConfirmPassword(!showConfirmNewPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { name, email, phone };
    dispatch(updateProfile(userData));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const formData = { oldPassword, newPassword, confirmPassword };
    dispatch(updatePassword(formData));
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
    
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }
    
    if (isUpdated) {
      message.success(value === 1 ? "Profile Updated Successfully" : "Password Updated Successfully");
      dispatch(reloadUser());
      dispatch({ type: value === 1 ? UPDATE_PROFILE_RESET : UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, error, isUpdated, user, value]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
               Profile
                  </Typography>
       
      <PageTitle title={`${user?.name}'s Profile | LAMPS`} />

      <Box sx={{ mb: 4 }}>
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
        <Typography sx={{ color: "primary.main" }}>Profile</Typography>
      </Breadcrumbs>
      <Divider />

       
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Profile tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Profile Overview" {...a11yProps(0)} />
            <Tab label="Edit Profile" {...a11yProps(1)} />
            <Tab label="Change Password" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '3rem'
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1">
                        {user?.name || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1">
                        {user?.email || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography variant="body1">
                        {user?.phone || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1">
                        {moment(user?.createdAt).format("MMMM Do, YYYY")}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={<EditIcon />}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Box component="form" onSubmit={handleSubmitPassword} sx={{ maxWidth: 600, mx: 'auto' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowOldPassword} edge="end">
                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowNewPassword} edge="end">
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                          {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={<Password />}
                >
                  {loading ? "Updating..." : "Change Password"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Card>
    </Container>
  );
}