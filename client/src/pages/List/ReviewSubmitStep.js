import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Link,
  Divider,
  Chip,
} from "@mui/material";
import {
  Business,
  Search,
  Description,
  Person,
  Phone,
  Email,
  Home,
  PhotoCamera,
  Share,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Language,
  YouTube,
  WhatsApp,
  Work,
  BusinessCenter,
  AccessTime,
} from "@mui/icons-material";
import DetailItem from "./DetailItem";

const socialPlatforms = [
  { name: "facebook", icon: <Facebook />, color: "#1877F2" },
  { name: "instagram", icon: <Instagram />, color: "#E4405F" },
  { name: "twitter", icon: <Twitter />, color: "#1DA1F2" },
  { name: "linkedin", icon: <LinkedIn />, color: "#0A66C2" },
  { name: "website", icon: <Language />, color: "#1976d2" },
  { name: "youtube", icon: <YouTube />, color: "#FF0000" },
  { name: "whatsapp", icon: <WhatsApp />, color: "#25D366" },
];

const ReviewSubmitStep = ({
  formData,
  links,
  categories,
  categoryInput,
  planName,
  planPrice,
  colors,
}) => {
  return (
    <Box
      sx={{
        p: 4,
        border: `1px solid ${colors.LOGOlight}`,
        borderRadius: 3,
        backgroundColor: "#f9f9f9",
        boxShadow: `0 4px 20px 0 ${colors.LOGOlight}20`,
      }}
    >
      {/* Plan Information */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          backgroundColor: `${colors.LOGOColor}08`,
          borderRadius: 2,
          borderLeft: `4px solid ${colors.LOGOColor}`,
          boxShadow: `0 2px 10px 0 ${colors.LOGOlight}10`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: colors.LOGOColor,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Business sx={{ mr: 1, color: colors.LOGOColor }} /> Selected Plan
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DetailItem
              label="Plan Name:"
              value={planName || "Not selected"}
              icon={<Business />}
              colors={colors}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailItem
              label="Plan Price:"
              value={planPrice ? `₹${planPrice}` : "Not selected"}
              icon={<Business />}
              colors={colors}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Business Information Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: colors.LOGOColor,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Business sx={{ mr: 1, color: colors.LOGOColor }} /> Business
          Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DetailItem
              label="Business Name"
              value={formData.businessName}
              icon={<Business />}
              colors={colors}
            />
            <DetailItem
              label="Category"
              value={
                categories.find((c) => c._id === formData.category)?.name ||
                categoryInput
              }
              icon={<Search />}
              colors={colors}
            />
            <DetailItem
              label="Description"
              value={formData.description || "Not provided"}
              icon={<Description />}
              multiline
              colors={colors}
            />
            <DetailItem
              label="Open Time"
              value={
                formData?.openTime
                  ? formData.openTime.format("hh:mm A")
                  : "Not selected"
              }
              icon={<AccessTime />}
              colors={colors}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DetailItem
              label="Location"
              value={`${formData.city || ""}${
                formData.city && formData.state ? ", " : ""
              }${formData.state || ""}`}
              icon={<Home />}
              colors={colors}
            />

            {/* Services Section */}
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  color: colors.LOGOlight,
                }}
              >
                <Work
                  sx={{ mr: 1, fontSize: "1rem", color: colors.LightColor }}
                />
                Service
              </Typography>
              {formData.service && formData.service.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {formData.service.map((service, index) => (
                    <Chip
                      key={index}
                      label={service}
                      sx={{
                        backgroundColor: colors.LOGOlight,
                        color: colors.WHITE,
                        mt: -1,
                        mb: 1,
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No services added
                </Typography>
              )}
            </Box>
            <DetailItem
              label="Business Experience"
              value={formData.businessExperience}
              icon={<BusinessCenter />}
              colors={colors}
            />

            <DetailItem
              label="Close Time"
              value={
                formData?.closeTime
                  ? formData.closeTime.format("hh:mm A")
                  : "Not selected"
              }
              icon={<AccessTime />}
              colors={colors}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3, borderColor: colors.LOGOlight }} />

      {/* Contact Information Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: colors.LOGOColor,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Person sx={{ mr: 1, color: colors.LOGOColor }} /> Contact Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DetailItem
              label="Owner Name"
              value={formData.ownerName}
              icon={<Person />}
              colors={colors}
            />
            <DetailItem
              label="Phone"
              value={formData.phone}
              icon={<Phone />}
              colors={colors}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailItem
              label="Email"
              value={formData.email || "Not provided"}
              icon={<Email />}
              colors={colors}
            />
            <DetailItem
              label="Address"
              value={formData.address}
              icon={<Home />}
              multiline
              colors={colors}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3, borderColor: colors.LOGOlight }} />

      {/* Media Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: colors.LOGOColor,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <PhotoCamera sx={{ mr: 1, color: colors.LOGOColor }} /> Media
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 1, color: colors.LOGOlight }}>
          Images ({formData.images.length}/5)
        </Typography>

        {formData.images.length > 0 ? (
          <Grid container spacing={2}>
            {formData.images.map((img, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card
                  sx={{
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: `0 4px 20px 0 ${colors.LOGOlight}40`,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
                    alt={`Business ${index}`}
                    sx={{ objectFit: "cover" }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No images uploaded
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3, borderColor: colors.LOGOlight }} />

      {/* Social Media Section */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: colors.LOGOColor,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Share sx={{ mr: 1, color: colors.LOGOColor }} /> Social Media Links
        </Typography>

        {Object.entries(links).some(([_, value]) => value) ? (
          <Grid container spacing={2}>
            {socialPlatforms.map(({ name, icon, color }) => {
              const url = links[name];
              if (!url) return null;

              return (
                <Grid item xs={12} sm={6} key={name}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1.5,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 2px 10px 0 ${color}20`,
                      },
                    }}
                  >
                    <Box sx={{ color, mr: 2 }}>{icon}</Box>
                    <Link
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: colors.LOGOColor,
                        wordBreak: "break-all",
                        "&:hover": {
                          color: colors.LOGOlight,
                        },
                      }}
                    >
                      {url}
                    </Link>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No social media links provided
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ReviewSubmitStep;
