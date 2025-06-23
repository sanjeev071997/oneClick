import { Box } from "@mui/material";
import React from "react";

import SidebarUser from './SiderbarUser'

const Layout = (Component) =>({ ...props }) => {
    return (
      <>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <SidebarUser />
          <Box sx={{ width: "100%", bgcolor: "#fafafa", overflow: "hidden" }}>
         
            <Box sx={{ p: 3 }}>
              <Component {...props} />
            </Box>
          </Box>
        </div>
      </>
    );
  };

export default Layout;
