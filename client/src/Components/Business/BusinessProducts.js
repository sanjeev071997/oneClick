import { Card, CardContent, Typography } from "@mui/material";
import { Colors } from "../../Comman";

const BusinessProducts = ({ business }) => {
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
          Our Products
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: Colors.textDark, textAlign: "center", py: 4 }}
        >
          Products content will be displayed here
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BusinessProducts;