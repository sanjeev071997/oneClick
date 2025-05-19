import React, { useEffect, useState } from "react";
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
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PageTitle from "../Components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../redux/actions/userAction";
import { Link, useNavigate, useParams } from "react-router-dom";
import Password from "@mui/icons-material/Password";
import { message } from "antd";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { token } = useParams();

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  // Handle Reset Password APi Call
  const handleSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(token, myForm));
  };

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      message.success("Password Updated Successfully");
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, success]);

  const currentYear = new Date().getFullYear();

  return (
    <div>
      <PageTitle
        title="Reset Password -  One Click"
        description="Enter your new password to reset your account access."
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
        <Typography sx={{ color: "primary.main" }}>Reset Password</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          height: "100vh",
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
              <Password />
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
              Reset Password
            </Typography>

            <TextField
              sx={{
                mb: 3,
                mt: 3,
                "& .MuiInputBase-root": {
                  color: "text.secondary",
                },
                fieldset: { borderColor: "rgb(231, 235, 240)" },
              }}
              fullWidth
              id="password"
              name="password"
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <TextField
              sx={{
                mb: 3,
                "& .MuiInputBase-root": {
                  color: "text.secondary",
                },
                fieldset: { borderColor: "rgb(231, 235, 240)" },
              }}
              fullWidth
              id="ConfirmPassword"
              name="password"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={loading}
              fullWidth
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
              {loading ? "loading..." : "Reset Password"}
            </Button>
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
    </div>
  );
};

export default ResetPassword;
