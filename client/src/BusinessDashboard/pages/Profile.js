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
} from "../../redux/actions/userAction";
import {
  UPDATE_PROFILE_RESET,
  UPDATE_PASSWORD_RESET
} from "../../redux/constants/userConstants";
import { message } from "antd";
import { Colors, FontSize, FontWeight } from '../../Comman';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Profile() {
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
      <Container maxWidth="xl" sx={{ mt: 5, mb: 10 }}>
        {/* Profile Summary Row - Full Width */}
        <Card elevation={3} sx={{
          borderRadius: 3,
          mb: 4,
          background: `linear-gradient(135deg, ${Colors.LOGOColor}15, ${Colors.LOGOlight}15)`,
          border: `1px solid ${Colors.LOGOlight}30`
        }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center" flexWrap="wrap">
              <Grid item xs={12} md="auto">
                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      fontSize: FontSize.feight,
                      background: Colors.LOGOColor,
                      border: `4px solid ${Colors.LOGOlight}`,
                    }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={FontWeight.bold} sx={{
                      color: Colors.LOGOColor,
                      background: `linear-gradient(135deg, ${Colors.LOGOColor}, ${Colors.LOGOlight})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      wordBreak: 'break-word',
                    }}>
                      {name}
                    </Typography>
                    <Chip
                      label="Verified User"
                      color="success"
                      size="small"
                      icon={<CheckCircle fontSize="small" />}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={true}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{ wordBreak: 'break-word' }}
                    >
                      {email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{ wordBreak: 'break-word' }}
                    >
                      {phone || "Not set"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Member Since</Typography>
                    <Typography variant="body1" fontWeight={500}>{created}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md="auto">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    fullWidth
                    sx={{
                      borderRadius: '8px',
                      background: Colors.LOGOlight,
                      textTransform: 'none',
                      px: 1.5,
                      minWidth: 0,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flexGrow: { xs: 1, sm: 0 },
                    }}
                    onClick={() => setTab(1)}
                  >
                    Edit Profile
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: '8px',
                      background: Colors.LOGOlight,
                      textTransform: 'none',
                      px: { xs: 2, sm: 2.5 }, 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flexGrow: { xs: 1, sm: 0 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center', 
                      gap: 1 ,
                 
                    }}
                    
                    onClick={() => setTab(2)}
                    startIcon={<Lock  sx={{ml:1}}/>}
                  >
                    Change Password
                  </Button>


                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

       
        <Paper elevation={0} sx={{
          borderRadius: 3,
          background: theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : '#f9fafc'
        }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiTab-root': {
                py: 2,
                textTransform: 'none',
                fontWeight: FontWeight.heading2,
                minHeight: 60,
                color: Colors.LOGOColor,
                '&.Mui-selected': {
                  color: Colors.LOGOlight,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: Colors.LOGOlight,
                height: 3,
              },
            }}
          >
            <Tab
              label="Profile Overview"
              icon={<Person sx={{
                color: tab === 0 ? Colors.LOGOlight : Colors.LOGOColor
              }} />}
              iconPosition="start"
            />
            <Tab
              label="Edit Profile"
              icon={<Settings sx={{
                color: tab === 1 ? Colors.LOGOlight : Colors.LOGOColor
              }} />}
              iconPosition="start"
            />
            <Tab
              label="Password & Security"
              icon={<Lock sx={{
                color: tab === 2 ? Colors.LOGOlight : Colors.LOGOColor
              }} />}
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ p: 4 }}>
            {/* Profile Overview */}
            {tab === 0 && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{
                    borderRadius: 3,
                    borderColor: Colors.LOGOlight,
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: Colors.LOGOColor,
                      }}>
                        <Person sx={{ color: Colors.LOGOColor, mr: 1 }} /> Personal Information
                      </Typography>
                      <Divider sx={{
                        mb: 2,
                        borderColor: Colors.LOGOlight,
                      }} />
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="caption">Full Name</Typography>
                          <Typography sx={{ wordBreak: 'break-word' }}>{name}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption">Email Address</Typography>
                          <Typography sx={{ wordBreak: 'break-word' }}>{email}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption">Phone Number</Typography>
                          <Typography sx={{ wordBreak: 'break-word' }}>{phone || "Not provided"}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{
                    borderRadius: 3,
                    borderColor: Colors.LOGOlight,
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: Colors.LOGOColor,
                      }}>
                        <Security sx={{ color: Colors.LOGOColor, mr: 1 }} /> Account Details
                      </Typography>
                      <Divider sx={{
                        mb: 2,
                        borderColor: Colors.LOGOlight,
                      }} />
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="caption">Account Created</Typography>
                          <Typography>{created}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption">Last Updated</Typography>
                          <Typography>{moment(user?.updatedAt).fromNow()}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {tab === 1 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{
                  color: Colors.LOGOlight,
                  background: `linear-gradient(135deg, ${Colors.LOGOColor}, ${Colors.LOGOlight})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: Colors.LOGOColor,
                            },
                            '&:hover fieldset': {
                              borderColor: Colors.LOGOlight,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: Colors.LOGOlight,
                            },
                          },
                          '& label.Mui-focused': {
                            color: Colors.LOGOlight,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        size="medium"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: Colors.LOGOColor,
                            },
                            '&:hover fieldset': {
                              borderColor: Colors.LOGOlight,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: Colors.LOGOlight,
                            },
                          },
                          '& label.Mui-focused': {
                            color: Colors.LOGOlight,
                          },
                        }}
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: Colors.LOGOColor,
                            },
                            '&:hover fieldset': {
                              borderColor: Colors.LOGOlight,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: Colors.LOGOlight,
                            },
                          },
                          '& label.Mui-focused': {
                            color: Colors.LOGOlight,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          onClick={() => setTab(0)}
                          fullWidth={true}
                          sx={{
                            px: 4,
                            color: Colors.LOGOColor,
                            borderColor: Colors.LOGOColor,
                            '&:hover': {
                              backgroundColor: Colors.LOGOlight,
                              color: '#fff',
                              borderColor: Colors.LOGOlight,
                            },
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          fullWidth={true}
                          sx={{
                            px: 4,
                            background: Colors.LOGOlight,
                          }}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}

            {tab === 2 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{
                  color: Colors.LOGOlight,
                  background: `linear-gradient(135deg, ${Colors.LOGOColor}, ${Colors.LOGOlight})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: Colors.LOGOColor },
                          '&:hover fieldset': { borderColor: Colors.LOGOlight },
                          '&.Mui-focused fieldset': { borderColor: Colors.LOGOlight },
                        },
                        '& label.Mui-focused': { color: Colors.LOGOlight },
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: Colors.LOGOColor },
                          '&:hover fieldset': { borderColor: Colors.LOGOlight },
                          '&.Mui-focused fieldset': { borderColor: Colors.LOGOlight },
                        },
                        '& label.Mui-focused': { color: Colors.LOGOlight },
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: Colors.LOGOColor },
                          '&:hover fieldset': { borderColor: Colors.LOGOlight },
                          '&.Mui-focused fieldset': { borderColor: Colors.LOGOlight },
                        },
                        '& label.Mui-focused': { color: Colors.LOGOlight },
                      }}
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

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setTab(0)}
                        fullWidth={true}
                        sx={{
                          px: 4,
                          color: Colors.LOGOColor,
                          borderColor: Colors.LOGOColor,
                          '&:hover': {
                            backgroundColor: Colors.LOGOlight,
                            color: '#fff',
                            borderColor: Colors.LOGOlight,
                          },
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        fullWidth={true}
                        sx={{
                          px: 4,
                          background: Colors.LOGOlight,
                        }}
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
      </Container>
    </>
  );
}