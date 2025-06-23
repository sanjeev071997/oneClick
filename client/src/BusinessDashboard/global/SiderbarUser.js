import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, menuClasses } from "react-pro-sidebar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LoginIcon from "@mui/icons-material/Login";
import { Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import BusinessIcon from "@mui/icons-material/Business";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleIcon from '@mui/icons-material/People';
import { logout } from '../../redux/actions/userAction';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';

const SidebarUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [iconsVisible, setIconsVisible] = useState(true);

  const { confirm } = Modal;
  const handleLogout = () => {
    confirm({
      title: "Are you sure you want to Log out?",
      icon: <ExclamationCircleOutlined />,
      content: "Your current session will be terminated.",
      onOk() {
        dispatch(logout());
        localStorage.clear();
        message.success("Logout Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 500); 
      },
    });
  };

  const toggleIcons = () => {
    setIconsVisible(!iconsVisible);
  };

  return (
    <Sidebar 
      backgroundColor="#275559" 
      width={iconsVisible ? "250px" : "80px"}
      style={{ 
        height: "100vh",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        transition: "width 0.3s ease"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          color: "white"
        }}
      >
        {/* Header with toggle button */}
        <Box sx={{ 
          p: 3, 
          display: "flex", 
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.1)" 
        }}>
          {iconsVisible && <h2 style={{ margin: 0, color: "#9EDC29" }}>Quickdails</h2>}
          <IconButton 
            onClick={toggleIcons}
            sx={{ 
              color: "#9EDC29",
              marginLeft: iconsVisible ? 0 : 'auto'
            }}
          >
            {iconsVisible ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        {/* Main Menu */}
        <Box sx={{ flex: 1, pt: 2 }}>
          <Menu
            menuItemStyles={{
              button: {
                [`&.${menuClasses.button}`]: {
                  color: "white",
                },
                [`&.${menuClasses.disabled}`]: {
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#9EDC29",
                },
                [`&.${menuClasses.active}`]: {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "#9EDC29",
                },
              },
              icon: {
                [`&.${menuClasses.icon}`]: {
                  color: "#9EDC29",
                },
              },
            }}
          >
            <MenuItem
              component={<Link to='/business/dashboard' />}
              icon={iconsVisible ? <DashboardIcon /> : null}
            >
              {iconsVisible ? "Dashboard" : <DashboardIcon />}
            </MenuItem>

            <MenuItem
              component={<Link to="/user/business"/>}
              icon={iconsVisible ? <BusinessIcon /> : null}
            >
              {iconsVisible ? "Business" : <BusinessIcon />}
            </MenuItem>

            <MenuItem
              component={<Link to="/user/product" />}
              icon={iconsVisible ? <CategoryOutlinedIcon /> : null}
            >
              {iconsVisible ? "Product" : <CategoryOutlinedIcon />}
            </MenuItem>
            <MenuItem
              component={<Link to="/user/enquries" />}
              icon={iconsVisible ? <PeopleIcon /> : null}
            >
              {iconsVisible ? "Enquries" : <PeopleIcon />}
            </MenuItem>

            <MenuItem
              component={<Link to="/user/reviews"/>}
              icon={iconsVisible ? <RateReviewIcon /> : null}
            >
              {iconsVisible ? "Reviews" : <RateReviewIcon />}
            </MenuItem>

            <MenuItem
              component={<Link to="/user/plans" />}
              icon={iconsVisible ? <PeopleIcon /> : null}
            >
              {iconsVisible ? "Plans" : <PeopleIcon />}
            </MenuItem>

         
          </Menu>
        </Box>

        {/* Bottom Section (Settings & Logout) */}
        <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Menu
            menuItemStyles={{
              button: {
                [`&.${menuClasses.button}`]: {
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#9EDC29",
                },
              },
              icon: {
                [`&.${menuClasses.icon}`]: {
                  color: "#9EDC29",
                },
              },
            }}
          >
            <MenuItem
              component={<Link to="/user/profile" />}
              icon={iconsVisible ? <ManageAccountsIcon /> : null}
            >
              {iconsVisible ? "Settings" : <ManageAccountsIcon />}
            </MenuItem>

            <MenuItem 
              onClick={handleLogout}
              icon={iconsVisible ? <LoginIcon /> : null}
            >
              {iconsVisible ? "Log out" : <LoginIcon />}
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Sidebar>
  );
};

export default SidebarUser;