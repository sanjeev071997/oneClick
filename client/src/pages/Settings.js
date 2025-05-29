

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
  Tabs,
  Tab,
  Paper,
  Divider,
  Grid,
  Stack,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  useTheme
} from "@mui/material";
import { Person, Lock, Settings, Edit, CheckCircle, Security } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  updateProfile,
  updatePassword,
  reloadUser
} from "../redux/actions/userAction";
import {
  UPDATE_PROFILE_RESET,
  UPDATE_PASSWORD_RESET
} from "../redux/constants/userConstants";
import { message } from "antd";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageTitle from "../Components/PageTitle";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserProfile() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);
  const [tab, setTab] = useState(0);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const created = moment(user?.createdAt).format("MMMM Do, YYYY");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });

  const handleTabChange = (e, newValue) => setTab(newValue);
  const togglePassword = (field) => setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email, phone }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    dispatch(updatePassword({ oldPassword, newPassword, confirmPassword }));
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  useEffect(() => {
    if (user) {
      setName(user.name); setEmail(user.email); setPhone(user.phone);
    }
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      message.success("Profile updated successfully");
      dispatch(reloadUser());
      dispatch({ type: UPDATE_PROFILE_RESET });
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, error, isUpdated, user]);

  return (
    <>
      <PageTitle title={`${user?.name}'s Profile`} />
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 5, mb: 10 }}>
        <Grid container spacing={4}>
          {/* Sidebar Profile Summary */}
          <Grid item xs={12} md={3}>
            <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
                    bgcolor: theme.palette.primary.main,
                    mb: 3,
                    border: `4px solid ${theme.palette.primary.light}`
                  }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {name}
                </Typography>
                <Chip
                  label="Verified User"
                  color="success"
                  size="small"
                  icon={<CheckCircle fontSize="small" />}
                  sx={{ mb: 2 }}
                />

                <Stack spacing={1} width="100%" sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                    <Typography variant="body2">{email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Phone:</Typography>
                    <Typography variant="body2">{phone || "Not set"}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Member since:</Typography>
                    <Typography variant="body2">{created}</Typography>
                  </Box>
                </Stack>

                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{ mt: 3, width: '100%' }}
                  onClick={() => setTab(1)}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  sx={{ mt: 3, width: '100%' }}
                  onClick={() => setTab(2)} 
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>



          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} md={9}>
            <Paper elevation={0} sx={{
              borderRadius: 3,
              p: 0,
              background: theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : '#f9fafc'
            }}>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '& .MuiTab-root': {
                    py: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: 60
                  }
                }}
              >
                <Tab label="Profile Overview" icon={<Person />} iconPosition="start" />
                <Tab label="Edit Profile" icon={<Settings />} iconPosition="start" />
                <Tab label="Password & Security" icon={<Lock />} iconPosition="start" />
              </Tabs>

              <Box sx={{ p: 4 }}>
                {/* Profile Overview */}
                {tab === 0 && (
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <Person sx={{ mr: 1 }} /> Personal Information
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Full Name</Typography>
                              <Typography>{name}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Email Address</Typography>
                              <Typography>{email}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                              <Typography>{phone || "Not provided"}</Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <Security sx={{ mr: 1 }} /> Account Details
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Account Created</Typography>
                              <Typography>{created}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                              <Typography>{moment(user?.updatedAt).fromNow()}</Typography>
                            </Box>

                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                  </Grid>
                )}

                {/* Edit Profile */}
                {tab === 1 && (
                  <Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Update Your Profile
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                      Manage your personal information and how it appears on your account.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmitProfile} sx={{ maxWidth: 800 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            size="medium"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            value={email}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            size="medium"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            variant="outlined"
                            size="medium"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                              variant="outlined"
                              onClick={() => setTab(0)}
                              sx={{ px: 4 }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={loading}
                              sx={{ px: 4 }}
                            >
                              {loading ? "Saving..." : "Save Changes"}
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                )}

                {/* Change Password */}
                {tab === 2 && (
                  <Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Change Your Password
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                      For security reasons, we recommend using a strong and unique password.
                    </Typography>

                    <Box component="form" onSubmit={handlePasswordChange} sx={{ maxWidth: 600 }}>
                      <Stack spacing={3}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          type={showPass.old ? "text" : "password"}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => togglePassword("old")}>
                                  {showPass.old ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="New Password"
                          type={showPass.new ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          variant="outlined"
                          size="medium"
                          helperText="Minimum 8 characters with at least one number and one special character"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => togglePassword("new")}>
                                  {showPass.new ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type={showPass.confirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          variant="outlined"
                          size="medium"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => togglePassword("confirm")}>
                                  {showPass.confirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={() => setTab(0)}
                            sx={{ px: 4 }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ px: 4 }}
                          >
                            {loading ? "Updating..." : "Update Password"}
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>


                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}