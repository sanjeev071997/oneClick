// import React from 'react'

// const BusinessQRCode = ({businessId, businessName}) => {
//     const QrCodeLink = `https://oneclick-te0x.onrender.com/category/${businessName}/${businessId}`

//   return (
//     <div>

//     </div>
//   )
// }

// export default BusinessQRCode

// import React, { useState, useRef } from "react";
// import { IconButton, Modal, Box, Typography, Button } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { QRCodeCanvas } from "qrcode.react";
// import logo from '../../Images/LOGO1.png';

// const BusinessQRCode = ({ businessId, businessName }) => {
//   const [open, setOpen] = useState(false);
//   const qrRef = useRef();

//   const QrCodeLink = `https://oneclick-te0x.onrender.com/category/${businessName}/${businessId}`;

//   const handleDownload = () => {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     const width = 400;
//     const height = 500;

//     canvas.width = width;
//     canvas.height = height;

//     // White background
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(0, 0, width, height);

//     // Heading text
//     ctx.fillStyle = "#000000";
//     ctx.font = "bold 20px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText("Quickdials - Business QR Code", width / 2, 40);

//     // User text
//     ctx.font = "16px Arial";
//     ctx.fillText(`This is the QR Code for user: ${businessName}`, width / 2, 80);

//     // Draw QR code from existing canvas
//     const qrCanvas = qrRef.current.querySelector("canvas");
//     if (qrCanvas) {
//       ctx.drawImage(qrCanvas, (width - qrCanvas.width) / 2, 100);
//     }

//     // Download image
//     const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//     const downloadLink = document.createElement("a");
//     downloadLink.href = pngUrl;
//     downloadLink.download = `${businessName}_QRCode.png`;
//     document.body.appendChild(downloadLink);
//     downloadLink.click();
//     document.body.removeChild(downloadLink);
//   };

//   return (
//     <div>
//       <IconButton onClick={() => setOpen(true)}>
//         <VisibilityIcon />
//       </IconButton>

//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             bgcolor: "background.paper",
//             borderRadius: 2,
//             boxShadow: 24,
//             p: 4,
//             textAlign: "center",
//           }}
//         >
//           <Typography variant="h6" gutterBottom>
//             Quickdials - Business QR Code
//           </Typography>
//           <Typography variant="body2" gutterBottom>
//             This is the QR Code for user: <b>{businessName}</b>
//           </Typography>

//           <div ref={qrRef} style={{ margin: "20px 0" }}>
//             <QRCodeCanvas value={QrCodeLink} size={200} />
//           </div>

//           <Button variant="contained" onClick={handleDownload}>
//             Download QR Code
//           </Button>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default BusinessQRCode;

import React, { useState, useRef } from "react";
import { IconButton, Modal, Box, Typography, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import logo from "../../Images/favicon.png"; // ensure correct path

const BusinessQRCode = ({ businessId, businessName }) => {
  const [open, setOpen] = useState(false);
  const qrSectionRef = useRef();

  const QrCodeLink = `https://oneclick-te0x.onrender.com/category/${businessName}/${businessId}`;

  const handleDownload = async () => {
    if (qrSectionRef.current) {
      const canvas = await html2canvas(qrSectionRef.current);
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${businessName}_QRCode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <VisibilityIcon />
      </IconButton>

      {/* <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          ref={qrSectionRef}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Quickdials - Business QR Code
          </Typography>
          <Typography variant="body2" gutterBottom>
            This is the QR Code for user: <b>{businessName}</b>
          </Typography>

          <div style={{ margin: "20px 0" }}>
            <QRCodeCanvas
              value={QrCodeLink}
              size={200}
              imageSettings={{
                src: logo,
                x: undefined,
                y: undefined,
                height: 40, // adjust size as needed
                width: 40,
                excavate: true, // makes a clear background behind the logo
              }}
            />
          </div>

          <Button variant="contained" onClick={handleDownload}>
            Download QR Code
          </Button>
        </Box>
      </Modal> */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          {/* Visible UI section */}
          <Typography variant="h6" gutterBottom>
            Quickdials - Business QR Code
          </Typography>
          <Typography variant="body2" gutterBottom>
            This is the QR Code for user: <b>{businessName}</b>
          </Typography>

          <div style={{ margin: "20px 0" }}>
            <QRCodeCanvas
              value={QrCodeLink}
              size={200}
              imageSettings={{
                src: logo,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>

          <Button variant="contained" onClick={handleDownload}>
            Download QR Code
          </Button>

          {/* Hidden Download Section */}
          <div
            ref={qrSectionRef}
            style={{
              padding: "40px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              display: "inline-block",
              textAlign: "center",
              position: "absolute",
              left: "-9999px", // Move off-screen so it's not visible
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quickdials - Business QR Code
            </Typography>
            <Typography variant="body2" gutterBottom>
              This is the QR Code for user: <b>{businessName}</b>
            </Typography>

            <div style={{ margin: "20px 0" }}>
              <QRCodeCanvas
                value={QrCodeLink}
                size={200}
                imageSettings={{
                  src: logo,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
            <Typography variant="body2" gutterBottom>
              <b>www.quickdials.com</b>
            </Typography>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default BusinessQRCode;
