import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Stack,
    Chip,
  } from "@mui/material";
  import {
    Person,
    Email,
    Phone,
    LocationOn,
    CalendarToday,
    Language,
    Facebook,
    Instagram,
    Twitter,
    LinkedIn,
    YouTube,
    WhatsApp,
  } from "@mui/icons-material";
import { Colors, FontWeight } from "../../Comman";
  
  const BusinessOverview = ({ business }) => {
    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          overflow: "hidden",
          background: Colors.WHITE,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: Colors.LOGOColor }}
          >
            About {business?.businessName}
          </Typography>
  
          <Typography
            variant="body1"
            paragraph
            sx={{ color: Colors.textDark, mb: 3 }}
          >
            {business?.description}
          </Typography>
  
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: Colors.LOGOColor,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: Colors.LOGOColor,
                    }}
                  >
                    <Person sx={{ mr: 1, color: Colors.LOGOColor }} /> Contact
                    Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Person sx={{ mr: 2, color: Colors.LOGOColor }} />
                      <Typography sx={{ color: Colors.textDark }}>
                        <strong>Owner:</strong> {business?.ownerName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Email sx={{ mr: 2, color: Colors.LOGOColor }} />
                      <Typography sx={{ color: Colors.textDark }}>
                        <strong>Email:</strong> {business?.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Phone sx={{ mr: 2, color: Colors.LOGOColor }} />
                      <Typography sx={{ color: Colors.textDark }}>
                        <strong>Phone:</strong> {business?.phone}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
  
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: Colors.LOGOColor,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: Colors.LOGOColor,
                    }}
                  >
                    <LocationOn sx={{ mr: 1, color: Colors.LOGOColor }} /> Business
                    Details
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Chip
                        label={business?.category?.name}
                        size="small"
                        sx={{
                          mr: 2,
                          backgroundColor: Colors.LOGOColor,
                          color: Colors.WHITE,
                          fontWeight: FontWeight.bold,
                        }}
                      />
                    </Box>
  
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <LocationOn
                        sx={{ mr: 2, color: Colors.LOGOColor, mt: 0.5 }}
                      />
                      <Typography sx={{ color: Colors.textDark }}>
                        <strong>Address:</strong> {business?.address}
                        {business?.city && `, ${business.city}`}
                        {business?.state && `, ${business.state}`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CalendarToday sx={{ mr: 2, color: Colors.LOGOColor }} />
                      <Typography sx={{ color: Colors.textDark }}>
                        <strong>Member Since:</strong>{" "}
                        {new Date(business?.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
  
            <Grid item xs={12}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: Colors.LOGOColor,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: Colors.LOGOColor,
                    }}
                  >
                    <Language sx={{ mr: 1, color: Colors.LOGOColor }} /> Social Media
                    Links
                  </Typography>
  
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {business?.socialLinks?.facebook && (
                      <a
                        href={business.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook sx={{ fontSize: 30, color: "#1877F2" }} />
                      </a>
                    )}
                    {business?.socialLinks?.instagram && (
                      <a
                        href={business.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram sx={{ fontSize: 30, color: "#E4405F" }} />
                      </a>
                    )}
                    {business?.socialLinks?.twitter && (
                      <a
                        href={business.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter sx={{ fontSize: 30, color: "#1DA1F2" }} />
                      </a>
                    )}
                    {business?.socialLinks?.linkedin && (
                      <a
                        href={business.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedIn sx={{ fontSize: 30, color: "#0A66C2" }} />
                      </a>
                    )}
                    {business?.socialLinks?.website && (
                      <a
                        href={business.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Language
                          sx={{ fontSize: 30, color: Colors.LOGOColor }}
                        />
                      </a>
                    )}
                    {business?.socialLinks?.youtube && (
                      <a
                        href={business.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <YouTube sx={{ fontSize: 30, color: "#FF0000" }} />
                      </a>
                    )}
                    {business?.socialLinks?.whatsapp && (
                      <a
                        href={business.socialLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsApp sx={{ fontSize: 30, color: "#25D366" }} />
                      </a>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  export default BusinessOverview;