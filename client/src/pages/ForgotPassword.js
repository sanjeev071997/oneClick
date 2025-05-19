import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Breadcrumbs,
  Link as MUILink,
} from "@mui/material";
import Mail from "@mui/icons-material/Mail";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import PageTitle from "../Components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../redux/actions/userAction";
import { message as antdMessage } from 'antd';


const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { error, loading, isAuthenticated, message } = useSelector(
    (state) => state.forgotPassword
  );
  const [email, setEmail] = useState("");

  // password forgot api call
  const handleSubmit = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
  };

  useEffect(() => {
    if (error) {
      // toast.error(error);
      antdMessage.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      // toast.success(message);
      antdMessage.success(message);
      setEmail("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, message, isAuthenticated]);
  const currentYear = new Date().getFullYear();

  return (
    <div>
    <PageTitle
      title="Forgot Password -  One Click"
      description="Reset your password to regain access to your account."
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
        <Typography sx={{ color: "primary.main",}}>
          Forgot Password
        </Typography>
      </Breadcrumbs>
      <Box
        sx={{
          // height: "100vh",
          mt:5,
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
              <Mail />
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
              Forgot your password?
            </Typography>
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
              Don't fret! Just type in your email and we will send you a code to
              reset your password!
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
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "loading..." : "Send Email"}
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
    </div>
  );
};

export default ForgotPassword;
