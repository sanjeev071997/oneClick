
import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  TextField,
  Breadcrumbs,
  Link as MUILink,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PageTitle from "../../Components/PageTitle";
import axios from "../../axiosInstance";
import ViewBusiness from "./ViewBusiness";
import { Modal, message } from "antd";

const Business = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState([]);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get("/api/v1/business/all");
      setBusinesses(response.data.data);
      setTotalItems(response.data.data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredBusinesses = businesses.filter((business) =>
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Show confirmation modal before delete
  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this business?",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(id);
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/v1/business/delete", {
        data: { id }, 
      });
      setBusinesses((prev) =>
        prev.filter((business) => business._id !== id)
      );
      message.success("Business deleted successfully");
    } catch (error) {
      console.error("Error deleting business:", error.response?.data || error);
      message.error("Failed to delete business");
    }
  };
  

  const handleView = (business) => {
    setSelectedBusiness(business);
    setOpenDialog(true);
  };

  return (
    <>
      <PageTitle title="Admin Business List | One Click" />
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{
          mb: 3,
          fontFamily: "Poppins, sans-serif",
          color: "#2C3E50",
          letterSpacing: "2.5px",
          lineHeight: 1.8,
        }}
      >
        Business
      </Typography>

      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          mb: 5,
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <MUILink
          component={Link}
          to="/dashboard"
          sx={{ color: "inherit", textDecoration: "none" }}
        >
          Dashboard
        </MUILink>
        <Typography sx={{ color: "primary.main" }}>Business</Typography>
      </Breadcrumbs>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by Business Name"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <IconButton>
              <SearchIcon sx={{ color: "#1976d2" }} />
            </IconButton>
          ),
        }}
        sx={{
          mb: 3,
          mt: 2,
          bgcolor: "white",
          borderRadius: "20px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
          },
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead className="table-head">
            <TableRow>
              <TableCell className="table-head-cell">#</TableCell>
              <TableCell className="table-head-cell">Actions</TableCell>
              <TableCell className="table-head-cell">Business Image</TableCell>
              <TableCell className="table-head-cell">Owner</TableCell>
              <TableCell className="table-head-cell">Business</TableCell>
              <TableCell className="table-head-cell">Category</TableCell>
              <TableCell className="table-head-cell">Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBusinesses.map((business, index) => (
              <TableRow key={business._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(business)}>
                    <VisibilityIcon color="primary" />
                  </IconButton>

                  <IconButton onClick={() => confirmDelete(business._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Avatar
                    src={business.images[0]?.url}
                    alt="Profile"
                    sx={{ width: 100, height: 100 }}
                  />
                </TableCell>
                <TableCell>{business.ownerName}</TableCell>
                <TableCell>{business.businessName}</TableCell>
                <TableCell>{business.category.name}</TableCell>
                <TableCell>{business.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Business View Modal */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            fontFamily: "Poppins, sans-serif",
            color: "#2C3E50",
            letterSpacing: "1.5px",
            lineHeight: 1.8,
          }}
        >
          Business Details
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon sx={{ color: "#1976d2" }} />
          </IconButton>
        </DialogTitle>
        <hr />
        <DialogContent>
          {selectedBusiness && <ViewBusiness businessData={selectedBusiness} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Business;
