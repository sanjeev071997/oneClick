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
  const [collapsed, setCollapsed] = useState(false);

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

  return (
    <Sidebar
      backgroundColor="#275559"
      collapsed={collapsed}
      style={{ height: "100vh", boxShadow: "2px 0 10px rgba(0,0,0,0.1)" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          color: "white"
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {!collapsed && <h2 style={{ margin: 0, color: "#9EDC29" }}>Quickdails</h2>}
          <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#9EDC29", ml: 'auto' }}>
            {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Box>

        {/* Menu */}
        <Box sx={{ flex: 1, pt: 1 }}>
          <Menu
            menuItemStyles={{
              button: {
                [`&.${menuClasses.button}`]: {
                  color: "white",
                },
                [`&.${menuClasses.disabled}`]: {
                  color: "white",
                },
                '&:hover': {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#9EDC29",
                },
                [`&.${menuClasses.active}`]: {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "#9EDC29",
                }
              },
              icon: {
                color: "#9EDC29"
              },
            }}
          >
            <MenuItem component={<Link to='/business/dashboard' />} icon={<DashboardIcon />}>Dashboard</MenuItem>
            <MenuItem component={<Link to='/user/business' />} icon={<BusinessIcon />}>Business</MenuItem>
            {/* <MenuItem component={<Link to='/user/category' />} icon={<PeopleIcon />}>Category</MenuItem> */}
            <MenuItem component={<Link to='/user/product' />} icon={<CategoryOutlinedIcon />}>Product</MenuItem>
            <MenuItem component={<Link to='/user/enquries' />} icon={<PeopleIcon />}>Enquiries</MenuItem>
            <MenuItem component={<Link to='/user/reviews' />} icon={<RateReviewIcon />}>Reviews</MenuItem>
            <MenuItem component={<Link to='/user/plans' />} icon={<PeopleIcon />}>Plans</MenuItem>
          </Menu>
        </Box>

        {/* Bottom Menu */}
        <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Menu
            menuItemStyles={{
              button: {
                [`&.${menuClasses.button}`]: {
                  color: "white",
                },
                '&:hover': {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#9EDC29",
                }
              },
              icon: {
                color: "#9EDC29"
              },
            }}
          >
            <MenuItem component={<Link to='/upgrade/plan' />} icon={<PeopleIcon />}>Upgrade Plan</MenuItem>

            <MenuItem component={<Link to='/user/profile' />} icon={<ManageAccountsIcon />}>Settings</MenuItem>
            <MenuItem onClick={handleLogout} icon={<LoginIcon />}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Sidebar>
  );
};

export default SidebarUser;