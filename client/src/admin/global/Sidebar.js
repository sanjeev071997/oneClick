import React from "react";
import { Sidebar, Menu, MenuItem, menuClasses } from "react-pro-sidebar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LoginIcon from "@mui/icons-material/Login";
import { Box,} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import BusinessIcon from "@mui/icons-material/Business";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleIcon from '@mui/icons-material/People';
import { logout } from "../../redux/actions/userAction";
// import logo from "../../assets/favicon.png";
import ContactsIcon from '@mui/icons-material/Contacts';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

const SidebarAdm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);


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
        // window.location.reload();
        // navigate("/login");
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <>
      <Sidebar backgroundColor="white" style={{ borderRightStyle: "none" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box>
            <Menu
              menuItemStyles={{
                button: {
                  [`&.${menuClasses.button}`]: {
                    color: "#000",
                  },
                  [`&.${menuClasses.disabled}`]: {
                    color: "green",
                  },
                  "&:hover": {
                    backgroundColor: "#fafafa",
                    color: "#1976d2",
                  },
                },

                icon: {
                  [`&.${menuClasses.icon}`]: {
                    color: "#1976d2",
                  },
                },
              }}
            >
              <MenuItem
                style={{ marginTop: "20px", color: "#000" }}
                display="flex"
                alignItems="center"
                component={<Link to="/dashboard" />}
              >
                <b> {user.name}</b>
              </MenuItem>
              <MenuItem style={{ color: "#1976d2" }}>{user.email}</MenuItem>
              <hr />
              <MenuItem
                component={<Link to="/dashboard" />}
                icon={<DashboardIcon />}
              >
                {" "}
                Dashboard{" "}
              </MenuItem>
              
              <MenuItem
                component={<Link to="/admin/categories" />}
                icon={<CategoryOutlinedIcon />}
              >
                {" "}
                Categories{" "}
              </MenuItem>

              <MenuItem
                component={<Link to="/admin/business" />}
                icon={<BusinessIcon />}
              >
                {" "}
                Business{" "}
              </MenuItem> 
            

              <MenuItem
                component={<Link to="/admin/reviews" />}
                icon={<RateReviewIcon />}
              >
                {" "}
                Reviews{" "}
              </MenuItem> 

              <MenuItem
                component={<Link to="/admin/users" />}
                icon={<PeopleIcon />}
              >
                {" "}
                Users{" "}
              </MenuItem> 
              <MenuItem
                component={<Link to="/admin/contact" />}
                icon={<ContactsIcon />}
              >
                {" "}
               Contacts{" "}
              </MenuItem>

              <MenuItem
                component={<Link to="/admin/profile" />}
                icon={<ManageAccountsIcon />}
              >
                {" "}
                Manage Accounts{" "}
              </MenuItem>
            </Menu>
          </Box>

          {/* Log Out  */}
          <Box sx={{ pb: 2 }}>
            <Menu
              menuItemStyles={{
                button: {
                  [`&.${menuClasses.button}`]: {
                    color: "#000",
                  },

                  "&:hover": {
                    backgroundColor: "#fafafa",
                    color: "#1976d2",
                  },
                },

                icon: {
                  [`&.${menuClasses.icon}`]: {
                    color: "#1976d2",
                  },
                },
              }}
            >
              <hr />
              <MenuItem onClick={handleLogout} icon={<LoginIcon />}>
                {" "}
                Log out{" "}
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Sidebar>
    </>
  );
};

export default SidebarAdm;
