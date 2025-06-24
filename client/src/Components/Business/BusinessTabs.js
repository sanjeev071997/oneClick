import { Button,Box } from "@mui/material";
import {
  DesignServices,
  ShoppingBag,
  PermMedia,
  ChatBubble,
  ContactMail,
} from "@mui/icons-material";
import { Colors } from "../../Comman";

const BusinessTabs = ({ activeTab, setActiveTab, totalReviews }) => {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: null,
    },
    {
      id: "services",
      label: "Services",
      icon: <DesignServices sx={{ mr: 1 }} />,
    },
    {
      id: "products",
      label: "Products",
      icon: <ShoppingBag sx={{ mr: 1 }} />,
    },
    {
      id: "media",
      label: "Media",
      icon: <PermMedia sx={{ mr: 1 }} />,
    },
    {
      id: "reviews",
      label: `Reviews (${totalReviews})`,
      icon: <ChatBubble sx={{ mr: 1 }} />,
    },
    {
      id: "contact",
      label: "Contact",
      icon: <ContactMail sx={{ mr: 1 }} />,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        borderBottom: 1,
        borderColor: Colors.LOGOColor,
        mb: 3,
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          sx={{
            px: 3,
            py: 1.5,
            fontWeight: activeTab === tab.id ? "bold" : "normal",
            color: activeTab === tab.id ? Colors.LOGOlight : Colors.LOGOColor,
            borderBottom:
              activeTab === tab.id ? `3px solid ${Colors.LOGOlight}` : "none",
            textTransform: "none",
            fontSize: "1rem",
            whiteSpace: "nowrap",
            minWidth: "fit-content",
          }}
          startIcon={tab.icon}
        >
          {tab.label}
        </Button>
      ))}
    </Box>
  );
};

export default BusinessTabs;


// import { Button, Box } from "@mui/material";
// import {
//   DesignServices,
//   ShoppingBag,
//   PermMedia,
//   ChatBubble,
//   ContactMail,
// } from "@mui/icons-material";
// import { Colors } from "../../Comman";

// // Import tab components
// import BusinessOverview from "./BusinessOverview";
// import BusinessServices from "./BusinessServices";
// import BusinessProducts from "./BusinessProducts";
// import BusinessMedia from "./BusinessMedia";
// import BusinessReviews from "./BusinessReviews";
// import BusinessContact from "./BusinessContact";

// const BusinessTabs = ({ activeTab, setActiveTab, totalReviews }) => {
//   const tabs = [
//     { id: "overview", label: "Overview", icon: null },
//     { id: "services", label: "Services", icon: <DesignServices sx={{ mr: 1 }} /> },
//     { id: "products", label: "Products", icon: <ShoppingBag sx={{ mr: 1 }} /> },
//     { id: "media", label: "Media", icon: <PermMedia sx={{ mr: 1 }} /> },
//     { id: "reviews", label: `Reviews (${totalReviews})`, icon: <ChatBubble sx={{ mr: 1 }} /> },
//     { id: "contact", label: "Contact", icon: <ContactMail sx={{ mr: 1 }} /> },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "overview":
//         return <BusinessOverview />;
//       case "services":
//         return <BusinessServices />;
//       case "products":
//         return <BusinessProducts />;
//       case "media":
//         return <BusinessMedia />;
//       case "reviews":
//         return <BusinessReviews />;
//       case "contact":
//         return <BusinessContact />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       {/* Tabs Header */}
//       <Box
//         sx={{
//           display: "flex",
//           borderBottom: 1,
//           borderColor: Colors.LOGOColor,
//           mb: 3,
//           overflowX: "auto",
//           "&::-webkit-scrollbar": {
//             display: "none",
//           },
//         }}
//       >
//         {tabs.map((tab) => (
//           <Button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             sx={{
//               px: 3,
//               py: 1.5,
//               fontWeight: activeTab === tab.id ? "bold" : "normal",
//               color: activeTab === tab.id ? Colors.LOGOlight : Colors.LOGOColor,
//               borderBottom:
//                 activeTab === tab.id ? `3px solid ${Colors.LOGOlight}` : "none",
//               textTransform: "none",
//               fontSize: "1rem",
//               whiteSpace: "nowrap",
//               minWidth: "fit-content",
//             }}
//             startIcon={tab.icon}
//           >
//             {tab.label}
//           </Button>
//         ))}
//       </Box>

//       {/* Tab Content */}
//       <Box>
//         {renderTabContent()}
//       </Box>
//     </>
//   );
// };

// export default BusinessTabs;


// import React, { useState } from "react";// Adjust the path as needed
// import BusinessOverview from "./BusinessOverview";
// import BusinessServices from "./BusinessServices";
// import BusinessProducts from "./BusinessProducts";
// import BusinessMedia from "./BusinessMedia";
// import BusinessReviews from "./BusinessReviews";
// import BusinessContact from "./BusinessContact";

// const BusinessTabs = ({ totalReviews }) => {
//   const [activeTab, setActiveTab] = useState("overview");

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "overview":
//         return <BusinessOverview />;
//       case "services":
//         return <BusinessServices />;
//       case "products":
//         return <BusinessProducts />;
//       case "media":
//         return <BusinessMedia />;
//       case "reviews":
//         return <BusinessReviews />;
//       case "contact":
//         return <BusinessContact />;
//       default:
//         return <BusinessOverview />;
//     }
//   };

//   return (
//     <>
//       <BusinessTabs
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         totalReviews={totalReviews}
//       />
//       {renderTabContent()}
//     </>
//   );
// };

// export default BusinessTabs;
