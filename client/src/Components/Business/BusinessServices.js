// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Chip,
// } from "@mui/material";
// import { Colors } from "../../Comman";
// import DesignServicesIcon from "@mui/icons-material/DesignServices";

// const BusinessServices = ({ business }) => {
//   console.log(business, "business");

//   return (
//     <Box
//       // sx={{
//       //   borderRadius: 3,
//       //   boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
//       //   overflow: "hidden",
//       //   background: Colors.WHITE,
//       //   p: 3,
//       // }}
//     >
//       <CardContent>
//         <Box display="flex" alignItems="center" gap={1} mb={2}>
//           <DesignServicesIcon sx={{ color: Colors.LOGOColor }} />
//           <Typography
//             variant="h5"
//             fontWeight="bold"
//             sx={{ color: Colors.LOGOColor }}
//           >
//             Our Services
//           </Typography>
//         </Box>

//         {Array.isArray(business?.service) && business.service.length > 0 ? (
//           <Box
//             display="flex"
//             flexWrap="wrap"
//             gap={1.5}
//             mt={2}
//             justifyContent="flex-start"
//           >
//             {business.service.map((item, index) => (
//               <Chip
//                 key={index}
//                 label={item}
//                 sx={{
//                   backgroundColor: Colors.LOGOColor,
//                   color: "#fff",
//                   fontWeight: 500,
//                   px: 2,
//                   py: 1,
//                   fontSize: "0.9rem",
//                   borderRadius: "8px",
//                   "&:hover": {
//                     backgroundColor: Colors.LOGOColor,
//                     opacity: 0.85,
//                   },
//                 }}
//               />
//             ))}
//           </Box>
//         ) : (
//           <Typography
//             variant="body1"
//             sx={{ color: Colors.textDark, textAlign: "center", py: 4 }}
//           >
//             No services added yet.
//           </Typography>
//         )}
//       </CardContent>
//     </Box>
//   );
// };

// export default BusinessServices;



import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Colors } from "../../Comman";

const BusinessServices = ({ business }) => {
  const services = business?.service || [];

  return (
    <Box
      // sx={{
      //   borderRadius: 4,
      //   backdropFilter: "blur(8px)",
      //   background: "rgba(255, 255, 255, 0.8)",
      //   boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      //   p: 3,
      // }}
    >
      <CardContent>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={2}
          sx={{ color: Colors.LOGOColor }}
        >
          What We Offer
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap" mt={3}>
          {services.length > 0 ? (
            services.map((item, index) => (
              <Chip
                key={index}
                label={item}
                variant="outlined"
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: "0.95rem",
                  borderRadius: "16px",
                  borderColor: Colors.LOGOColor,
                  color: Colors.LOGOColor,
                  backgroundColor: "#fff",
                  "&:hover": {
                    backgroundColor: Colors.LOGOColor,
                    color: "#fff",
                  },
                }}
              />
            ))
          ) : (
            <Typography color={Colors.textDark}>
              Services will appear here.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Box>
  );
};

export default BusinessServices;


