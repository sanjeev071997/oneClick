import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Breadcrumbs,
  Link as MUILink,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, userRegister } from "../redux/actions/userAction";
import { message } from "antd";
import PageTitle from "../Components/PageTitle";
import axios from "../axiosInstance";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading, isAuthenticated,  } = useSelector(
    (state) => state.user
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [instituteId, setInstituteId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // // Check Server Status
  const checkServerStatus = async () => {
    try {
      const response = await axios.get("/api/status");
      if (response?.data?.data === true) {
        // message.success("Server is running");
      } else {
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

  // Handle Register Api Call
  const handleSubmit = async (e) => {
    e.preventDefault();
    checkServerStatus();
    const userData = {
      name,
      email,
      phone,
      password,
    };
    // checkServerStatus();
    dispatch(userRegister(userData));
  };

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, isAuthenticated]);

  return (
    <>
      <PageTitle title="Register" />
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
        <Typography sx={{ color: "primary.main",  }}>
        Register
        </Typography>
      </Breadcrumbs>
      <Box
        sx={{
          // height: "100vh",
          mt:5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgColor: "primary.white",
          // marginTop: "50px",
        }}
      >
        <Box
          onSubmit={handleSubmit}
          component="form"
          className="form_style border-style needs-validation"
          sx={{
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)", 
            maxWidth: "400px",
            width: "100%",
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
                // fontSize: "16px",
              }}
            >
              Create a new account
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
              id="name"
              label="Full Name"
              placeholder="Full name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              id="phone"
              name="phone"
              label="Phone"
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

            <Button
              fullWidth
              disabled={loading}
              variant="contained"
              type="submit"
              color="primary"
              className="courses_desc"
              sx={{
                borderRadius: "5px",
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                letterSpacing: ".1rem",
                color: "white",
              }}
            >
              {loading ? "loading..." : "Register"}
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
              {" "}
              Already a member ?{""} <Link to="/login"> Sign In </Link>{" "}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Register;
