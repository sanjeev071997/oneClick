import { Box, Typography, Breadcrumbs, Link, IconButton } from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Rating from "@mui/material/Rating";
import { Colors } from "../../Comman";


const BusinessHeader = ({ business, averageRating, totalReviews }) => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: business?.images?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    fade: true,
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            mr: 1,
            backgroundColor: Colors.LOGOColor,
            color: Colors.WHITE,
            "&:hover": {
              backgroundColor: Colors.LOGOlight,
            },
          }}
        >
          <ArrowBack />
        </IconButton>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            <Typography fontWeight="500">Home</Typography>
          </Link>
          <Typography color={Colors.BLACK} fontWeight="500">
            {business?.businessName}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 3,
          position: "relative",
          width: "100%",
          height: { xs: 250, sm: 350, md: 450 },
          "&:before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100px",
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            zIndex: 1,
          },
        }}
      >
        <Slider {...sliderSettings}>
          {business?.images?.map((img, index) => (
            <Box key={index}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 250, sm: 350, md: 540 },
                  backgroundImage: `url(${img?.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Box>
          ))}
        </Slider>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            zIndex: 2,
            color: Colors.WHITE,
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            {business?.businessName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              backdropFilter: "blur(5px)",
              p: 1,
              borderRadius: 1,
              width: "fit-content",
            }}
          >
            <Rating
              value={Number(averageRating)}
              precision={0.1}
              readOnly
              sx={{
                mr: 1,
                "& .MuiRating-iconFilled": {
                  color: Colors.LOGOlight,
                },
                "& .MuiRating-iconEmpty": {
                  color: `${Colors.LOGOlight}80`,
                },
              }}
            />
            <Typography
              variant="subtitle1"
              fontWeight="500"
              sx={{ color: Colors.LOGOlight }}
            >
              {averageRating} ({totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"})
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessHeader;