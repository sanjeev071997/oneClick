import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Breadcrumbs,
  IconButton,
  InputAdornment,
  Typography,
  Link as MUILink,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../redux/actions/userAction";
import { message } from "antd";
import axios from "../axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // // Check Server Status
  const checkServerStatus = async () => {
    try {
      const response = await axios.get("/api/status");
      if (!response?.data?.data) {
        message.error(
          "Oops! Something went wrong. Please try again later or contact support."
        );
      }
    } catch (error) {
      message.error(
        "Error: Oops! Something went wrong. Please try again later or contact support."
      );
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Login API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    checkServerStatus();
    await dispatch(login(email, password));
  };

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      message.success("Login Successfully");
      // Redirect based on user role
      if (user && user.role === 0) {
        navigate("/");
      } else if (user && user.role >= 1) {
        navigate("/dashboard");
      }
    }
  }, [error, isAuthenticated, user, dispatch, navigate]);
  
  const currentYear = new Date().getFullYear();

  return (
    <>
      <PageTitle
        title="Login - One Click"
        description="Log in to your account to access your courses and exams."
      />
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <MUILink
          component={Link}
          to="/"
          sx={{ color: "inherit", textDecoration: "none" }}
        >
          Home
        </MUILink>
        <Typography sx={{ color: "primary.main" }}>Login</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          // height: "100vh",
          mt: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "primary.white",
        }}
      >
        <Box
          onSubmit={handleSubmit}
          component="form"
          className="form_style border-style"
          sx={{
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main", mb: 3 }}>
              <LockOpenIcon />
            </Avatar>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                fontFamily: "Poppins, sans-serif",
                color: "#333",
                letterSpacing: "2.5px",
                lineHeight: 1.8,
              }}
            >
              Login
            </Typography>

            {/* Toggle between regular login and student login */}
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              sx={{
                fontFamily: "Poppins, sans-serif",
                color: "#555",
                letterSpacing: "1.5px",
                lineHeight: 1.8,
                fontSize: "16px",
              }}
            >
              Please fill your login details to access your One Click Account.
            </Typography>

            <TextField
              sx={{
                mb: 3,
                mt: 2,
                "& .MuiInputBase-root": {
                  color: "text.secondary",
                },
                fieldset: { borderColor: "rgb(231, 235, 240)" },
              }}
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              sx={{
                mb: 3,
                "& .MuiInputBase-root": {
                  color: "text.secondary",
                },
                fieldset: { borderColor: "rgb(231, 235, 240)" },
              }}
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <p className="ForgotPassword">
              <Link to="/password/forgot"> Forgot Password? </Link>
            </p>
            <Button
              disabled={loading}
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              className="courses_desc"
              sx={{
                mt:2,
                borderRadius: "5px",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                letterSpacing: ".1rem",
                color: "white",
              }}
            >
              {loading ? "loading..." : "Log In"}
            </Button>

            <Box
              variant="h6"
              align="center"
              gutterBottom
              sx={{
                pt: 2,
                fontFamily: "Poppins, sans-serif",
                color: "#555",
                letterSpacing: "1.5px",
                lineHeight: 1.8,
                fontSize: "16px",
              }}
              className="switchMember"
            >
              Create an Account? <Link to="/register"> Sign Up </Link>
            </Box>

            {/* Toggle between student and general login */}
            <Box sx={{ pt: 2 }}>
              <hr
                style={{
                  marginTop: "20px",
                }}
              />
              <p
                style={{
                  marginTop: "20px",
                  fontSize: "12px",
                  letterSpacing: ".1rem",
                  lineHeight: "1.5rem",
                  marginBottom: "-20px",
                }}
              >
                &copy; {currentYear} Copyright by One Click . All
                rights reserved.
              </p>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
