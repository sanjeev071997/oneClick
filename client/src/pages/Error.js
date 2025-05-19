import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h1">404</Typography>
        <Typography
          variant="h6"
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "3px",
          }}
        >
          The page you’re looking for doesn’t exist.
        </Typography>
        <Link to="/">
          {" "}
          <Button variant="contained" style={{ marginTop: "15px" }}>
            Back Home
          </Button>
        </Link>
      </Container>
    </Container>
  );
}