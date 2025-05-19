// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Container,
//   Box,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   // const navItems = ["Home", "About", "add/business", "Contact", "Login", "Register"];
//   const navItems = [
//     { label: "Home", path: "/" },
//     { label: "About", path: "/about" },
//     { label: "Category", path: "/category/all" }, // default or general category view
//     { label: "Add Business", path: "/add/business" },
//     { label: "Contact", path: "/contact" },
//     { label: "Login", path: "/login" },
//     { label: "Register", path: "/register" },
//   ];

//   return (
//     <>
//       {/* Navbar */}
//       <AppBar
//         position="fixed"
//         sx={{
//           top: 0,
//           zIndex: 1100,
//           background: "#fff",
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <Container>
//           <Toolbar
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               height: "76px",
//             }}
//           >
//             {/* Logo */}
//             <Typography
//               component={Link}
//               to="/"
//               variant="h5"
//               sx={{
//                 fontWeight: "bold",
//                 color: "#ff5733",
//                 textDecoration: "none",
//               }}
//             >
//               OneClick
//             </Typography>

//             {/* Desktop Navigation */}
//             <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
//               {navItems.map((item, index) => (
//                 <Typography
//                   key={index}
//                   component={Link}
//                   to={item.path}
//                   sx={{
//                     textDecoration: "none",
//                     color: "#000",
//                     fontSize: "15px",
//                     fontWeight: "400",
//                      fontFamily: "Arial, sans-serif",
//                      letterSpacing: "1px",
//                     "&:hover": {
//                       color: "#ff5733",
//                     },
//                     ":active": {
//                       color: "#ff5733",
//                     },
//                     mx: 2,
//                   }}
//                 >
//                   {item.label}
//                 </Typography>
//               ))}
//             </Box>

//             {/* Mobile Menu Button */}
//             <IconButton
//               edge="end"
//               aria-label="menu"
//               sx={{
//                 display: { xs: "block", md: "none" },
//                 color: "#ff5733",
//               }}
//               onClick={handleDrawerToggle}
//             >
//               <MenuIcon sx={{ fontSize: "2rem" }} />
//             </IconButton>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
//         <Box sx={{ width: 250, height: "100vh", p: 2 }}>
//           {/* Close Button */}
//           <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//             <IconButton onClick={handleDrawerToggle}>
//               <CloseIcon sx={{ color: "#ff5733" }} />
//             </IconButton>
//           </Box>

//           {/* Navigation Links */}
//           <List sx={{ mt: 2 }}>
//             {navItems.map((item, index) => (
//               <ListItem
//                 key={index}
//                 button
//                 component={Link}
//                 to={item.path}
//                 onClick={handleDrawerToggle}
//                 sx={{ textAlign: "center" }}
//               >
//                 <ListItemText
//                   primary={item.label}
//                   sx={{
//                     textAlign: "center",
//                     fontSize: "15px",
//                     fontWeight: "500",
//                     fontFamily: "Arial, sans-serif",
//                     // textTransform: "uppercase",
//                     color: "#000",
//                     "&:hover": {
//                       color: "#ff5733",
//                     },
//                     letterSpacing: "1px",
//                     ":active": {
//                       color: "#ff5733",
//                     },
//                   }}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </Drawer>

//       {/* Space for Fixed Navbar */}
//       <Box sx={{ height: "76px" }} />
//     </>
//   );
// };

// export default Navbar;


import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation(); // <-- to get the current path

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    // { label: "Category", path: "/category/all" },
    { label: "Add Business", path: "/add/business" },
    { label: "Contact", path: "/contact" },
    { label: "Login", path: "/login" },
    { label: "Register", path: "/register" },
  ];

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
        <Container>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              height: "76px",
            }}
          >
            <Typography
              component={Link}
              to="/"
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#ff5733",
                textDecoration: "none",
              }}
            >
              OneClick
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Typography
                    key={index}
                    component={Link}
                    to={item.path}
                    sx={{
                      textDecoration: "none",
                      color: isActive ? "#ff5733" : "#000",
                      fontSize: "15px",
                      fontWeight: isActive ? "600" : "400",
                      fontFamily: "Arial, sans-serif",
                      letterSpacing: "1px",
                      borderBottom: isActive ? "2px solid #ff5733" : "none",
                      mx: 2,
                      "&:hover": {
                        color: "#ff5733",
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                );
              })}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              edge="end"
              aria-label="menu"
              sx={{
                display: { xs: "block", md: "none" },
                color: "#ff5733",
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250, height: "100vh", p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon sx={{ color: "#ff5733" }} />
            </IconButton>
          </Box>

          <List sx={{ mt: 2 }}>
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem
                  key={index}
                  button
                  component={Link}
                  to={item.path}
                  onClick={handleDrawerToggle}
                  sx={{ textAlign: "center" }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      textAlign: "center",
                      fontSize: "15px",
                      fontWeight: isActive ? "600" : "500",
                      fontFamily: "Arial, sans-serif",
                      color: isActive ? "#ff5733" : "#000",
                      letterSpacing: "1px",
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Space for Fixed Navbar */}
      <Box sx={{ height: "76px" }} />
    </>
  );
};

export default Navbar;
