// import {
//     Box,
//     Typography,
//     Grid,
//     Card,
//     CardContent,
//     Stack,
//     Chip,
//   } from "@mui/material";
//   import {
//     Person,
//     Email,
//     Phone,
//     LocationOn,
//     CalendarToday,
//     Language,
//     Facebook,
//     Instagram,
//     Twitter,
//     LinkedIn,
//     YouTube,
//     WhatsApp,
//   } from "@mui/icons-material";
// import { Colors, FontWeight } from "../../Comman";
  
//   const BusinessOverview = ({ business }) => {
//     return (
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//           overflow: "hidden",
//           background: Colors.WHITE,
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h5"
//             fontWeight="bold"
//             gutterBottom
//             sx={{ color: Colors.LOGOColor }}
//           >
//             About {business?.businessName}
//           </Typography>
  
//           <Typography
//             variant="body1"
//             paragraph
//             sx={{ color: Colors.textDark, mb: 3 }}
//           >
//             {business?.description}
//           </Typography>
  
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <Card
//                 variant="outlined"
//                 sx={{
//                   borderRadius: 2,
//                   borderColor: Colors.LOGOColor,
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     fontWeight="bold"
//                     gutterBottom
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       color: Colors.LOGOColor,
//                     }}
//                   >
//                     <Person sx={{ mr: 1, color: Colors.LOGOColor }} /> Contact
//                     Information
//                   </Typography>
//                   <Stack spacing={2}>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Person sx={{ mr: 2, color: Colors.LOGOColor }} />
//                       <Typography sx={{ color: Colors.textDark }}>
//                         <strong>Owner:</strong> {business?.ownerName}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Email sx={{ mr: 2, color: Colors.LOGOColor }} />
//                       <Typography sx={{ color: Colors.textDark }}>
//                         <strong>Email:</strong> {business?.email}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Phone sx={{ mr: 2, color: Colors.LOGOColor }} />
//                       <Typography sx={{ color: Colors.textDark }}>
//                         <strong>Phone:</strong> {business?.phone}
//                       </Typography>
//                     </Box>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
  
//             <Grid item xs={12} md={6}>
//               <Card
//                 variant="outlined"
//                 sx={{
//                   borderRadius: 2,
//                   borderColor: Colors.LOGOColor,
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     fontWeight="bold"
//                     gutterBottom
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       color: Colors.LOGOColor,
//                     }}
//                   >
//                     <LocationOn sx={{ mr: 1, color: Colors.LOGOColor }} /> Business
//                     Details
//                   </Typography>
//                   <Stack spacing={2}>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Chip
//                         label={business?.category?.name}
//                         size="small"
//                         sx={{
//                           mr: 2,
//                           backgroundColor: Colors.LOGOColor,
//                           color: Colors.WHITE,
//                           fontWeight: FontWeight.bold,
//                         }}
//                       />
//                     </Box>
  
//                     <Box sx={{ display: "flex", alignItems: "flex-start" }}>
//                       <LocationOn
//                         sx={{ mr: 2, color: Colors.LOGOColor, mt: 0.5 }}
//                       />
//                       <Typography sx={{ color: Colors.textDark }}>
//                         <strong>Address:</strong> {business?.address}
//                         {business?.city && `, ${business.city}`}
//                         {business?.state && `, ${business.state}`}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <CalendarToday sx={{ mr: 2, color: Colors.LOGOColor }} />
//                       <Typography sx={{ color: Colors.textDark }}>
//                         <strong>Member Since:</strong>{" "}
//                         {new Date(business?.createdAt).toLocaleDateString()}
//                       </Typography>
//                     </Box>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
  
//             <Grid item xs={12}>
//               <Card
//                 variant="outlined"
//                 sx={{
//                   borderRadius: 2,
//                   borderColor: Colors.LOGOColor,
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     fontWeight="bold"
//                     gutterBottom
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       color: Colors.LOGOColor,
//                     }}
//                   >
//                     <Language sx={{ mr: 1, color: Colors.LOGOColor }} /> Social Media
//                     Links
//                   </Typography>
  
//                   <Box
//                     sx={{
//                       mt: 1,
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: 2,
//                     }}
//                   >
//                     {business?.socialLinks?.facebook && (
//                       <a
//                         href={business.socialLinks.facebook}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Facebook sx={{ fontSize: 30, color: "#1877F2" }} />
//                       </a>
//                     )}
//                     {business?.socialLinks?.instagram && (
//                       <a
//                         href={business.socialLinks.instagram}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Instagram sx={{ fontSize: 30, color: "#E4405F" }} />
//                       </a>
//                     )}
//                     {business?.socialLinks?.twitter && (
//                       <a
//                         href={business.socialLinks.twitter}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Twitter sx={{ fontSize: 30, color: "#1DA1F2" }} />
//                       </a>
//                     )}
//                     {business?.socialLinks?.linkedin && (
//                       <a
//                         href={business.socialLinks.linkedin}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <LinkedIn sx={{ fontSize: 30, color: "#0A66C2" }} />
//                       </a>
//                     )}
//                     {business?.socialLinks?.website && (
//                       <a
//                         href={business.socialLinks.website}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <Language
//                           sx={{ fontSize: 30, color: Colors.LOGOColor }}
//                         />
//                       </a>
//                     )}
//                     {business?.socialLinks?.youtube && (
//                       <a
//                         href={business.socialLinks.youtube}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <YouTube sx={{ fontSize: 30, color: "#FF0000" }} />
//                       </a>
//                     )}
//                     {business?.socialLinks?.whatsapp && (
//                       <a
//                         href={business.socialLinks.whatsapp}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <WhatsApp sx={{ fontSize: 30, color: "#25D366" }} />
//                       </a>
//                     )}
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//     );
//   };
  
//   export default BusinessOverview;


import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  IconButton,
  Grid,
  Avatar,
  Stack,
  Button,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Business,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Groups,
  AccessTime,
  EmojiEvents,
  WhatsApp,
  Link as LinkIcon,
} from "@mui/icons-material";
import { useParams, useLocation } from "react-router-dom";

const Colors = {
  LOGOColor: "#017AFF",
  BG: "#F5F9FF",
};

const BusinessOverview = ({ business }) => {
  const { categoryName, businessId } = useParams();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const currentURL = window.location.origin + location.pathname;
  const whatsappNumber = business?.phone?.replace(/\D/g, "");
  const msg = `Hello! I'm interested in *${business?.businessName}*. Here's the link: ${currentURL}`;
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;

  const establishmentYear = business?.businessExperience
    ? new Date().getFullYear() - parseInt(business.businessExperience)
    : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentURL);
    setCopied(true);
  };

  return (
    <Box bgcolor={Colors.BG}  >
      <Paper
        elevation={3}
        sx={{
          // maxWidth: 1000,
          // mx: "auto",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Grid container>
          {/* Sidebar */}
          <Grid item xs={12} md={4} bgcolor="white" position="sticky">
            <Box p={3} textAlign="center">
              <Avatar sx={{ width: 100, height: 100, bgcolor: Colors.BG, mb: 2 }}>
                <Business sx={{ fontSize: 48, color: Colors.LOGOColor }} />
              </Avatar>
              <Typography variant="h5" fontWeight={600}>
                {business?.businessName || "Business Name"}
              </Typography>
              <Chip
                label={business?.category?.name || "Uncategorized"}
                sx={{
                  mt: 1,
                  bgcolor: Colors.LOGOColor,
                  color: "white",
                  fontSize: 12,
                }}
              />
              <Divider sx={{ my: 3 }} />

              <InfoItem icon={<AccessTime color="primary" />} label="Hours" value={`${business?.openTime || "–"} – ${business?.closeTime || "–"}`} />
              <InfoItem
                icon={<EmojiEvents color="primary" />}
                label="Experience"
                value={`${business?.businessExperience || 0} years`}
                caption={establishmentYear && `Since ${establishmentYear}`}
              />
              <Divider sx={{ my: 3 }} />

              <ContactItem icon={<Email />} value={business?.email} />
              <ContactItem icon={<Phone />} value={business?.phone} />
              <ContactItem icon={<LocationOn />} value={`${business?.address}, ${business?.city}, ${business?.state}`} />

              {whatsappNumber && (
                <Button
                  startIcon={<WhatsApp />}
                  variant="outlined"
                  href={whatsappURL}
                  target="_blank"
                  sx={{
                    mt: 2,
                    color: "#25D366",
                    borderColor: "#25D366",
                    "&:hover": {
                      bgcolor: "#25D366",
                      color: "white",
                    },
                  }}
                  fullWidth
                >
                  Contact via WhatsApp
                </Button>
              )}

              <Tooltip title={copied ? "Link copied!" : "Copy link"}>
                <Button
                  startIcon={<LinkIcon />}
                  variant="outlined"
                  onClick={handleCopy}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Copy Link
                </Button>
              </Tooltip>
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8} bgcolor={Colors.BG}>
            <Box p={4}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                About Us
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                {business?.description || "No description available."}
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Business Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Detail icon={<Groups color="primary" />} label="Owner" value={business?.ownerName || "–"} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Detail
                    icon={<CalendarToday color="primary" />}
                    label="Member Since"
                    value={business?.createdAt ? new Date(business.createdAt).toLocaleDateString() : "–"}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Link copied to clipboard!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

// Subcomponents
const InfoItem = ({ icon, label, value, caption }) => (
  <Box textAlign="left" mb={2}>
    <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }} color="text.secondary">
      {icon} {label}
    </Typography>
    <Typography variant="body1">{value}</Typography>
    {caption && <Typography variant="caption" color="text.secondary">{caption}</Typography>}
  </Box>
);

const ContactItem = ({ icon, value }) => (
  <Box display="flex" alignItems="center" gap={1} mb={1}>
    {icon}
    <Typography variant="body2">{value || "Not specified"}</Typography>
  </Box>
);

const Detail = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center" gap={2}>
    {icon}
    <Box>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  </Box>
);

export default BusinessOverview;
