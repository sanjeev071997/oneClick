import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button,  TextField, CircularProgress, Grid, Paper,
  IconButton, Dialog, DialogActions, DialogContent, 
  DialogTitle, Tabs, Tab, MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, useTheme, useMediaQuery
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon 
} from "@mui/icons-material";
import axios from "../../axiosInstance";
import { message, Modal } from "antd";
import { Colors } from "../../Comman";
import { useSelector } from "react-redux";

const BusinessCategory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useSelector((state) => state.user.user);

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null); 
  const [formLoading, setFormLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // --- Fetch Businesses associated with the user ---
  const fetchBusinesses = async () => {
    try {
      const res = await axios.get("/api/v1/business/get", 
       );
      const data = res.data?.data || [];
      setBusinesses(data);
      if (data.length > 0 && !selectedBusinessId) {
        setSelectedBusinessId(data[0]._id);
      }
    } catch (error) {
      console.error(error);
      message.error("No businesses found. Please add a business to continue.");
    }
  };

  // --- Fetch Categories for the selected business ---
  const fetchCategories = async () => {
    if (!selectedBusinessId) {
      setCategories([]); 
      return;
    }
    setLoading(true);
    try {
  
      const res = await axios.post(`/api/v1/product/category/get/${selectedBusinessId}`);
      console.log (res ,'res ')
      setCategories(res.data?.data || []);
    } catch (error) {
      message.error("You don't have any categories yet.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (user?._id) fetchBusinesses();
  }, [user]);

  // Effect to fetch categories when selectedBusinessId changes
  useEffect(() => {
    fetchCategories();
  }, [selectedBusinessId]); 

  // --- Handle Form Submission  ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      message.warning("Category name cannot be empty.");
      return;
    }
    if (!selectedBusinessId) {
      message.warning("Please select a business.");
      return;
    }

    setFormLoading(true);
    try {
      const payload = { name: categoryName, businessId: selectedBusinessId };
      if (currentCategory) {
        // Update category
        await axios.put(`/api/v1/product/category/update/${currentCategory._id}`, payload);
        message.success("Category updated successfully!");
        setEditModalOpen(false);
      } else {
        // Add new category
        await axios.post("/api/v1/product/category/create", payload);
        message.success("Category added successfully!");
      }
      setCategoryName(""); 
      setCurrentCategory(null); 
      fetchCategories(); 
      setTabValue(1); 
    } catch (error) {
      message.error(`Failed to ${currentCategory ? "update" : "add"} category.`);
    } finally {
      setFormLoading(false);
    }
  };

  // --- Handle Delete Category ---
  const handleDeleteCategory = async (category) => {
    Modal.confirm({
      title: 'Delete Category',
      content: 'Are you sure you want to delete this category? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
         
          await axios.delete(`/api/v1/product/category/delete/${category._id}`, {
            params: { businessId: selectedBusinessId }, 
          });
          message.success("Category deleted successfully!");
          fetchCategories();
        } catch (error) {
          message.error("The category you're looking for was not found.");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // --- Handle Edit  ---
  const handleEditClick = (category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setSelectedBusinessId(category.businessId); 
    setEditModalOpen(true);
  };

  return (
    <Box maxWidth={1200} mx="auto" mt={4} px={isMobile ? 1 : 2}>
      <Typography variant="h5" fontWeight={700} color={Colors.LOGOColor} mb={3}>
        Product Categories
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{
            
            '& .MuiTabs-indicator': {
              backgroundColor: Colors.LOGOColor,
              height: 3
            },
            '& .MuiTab-root': {
              color: Colors.LOGOColor,
              fontWeight: 'bold',
              '&.Mui-selected': {
                color: Colors.LOGOColor, 
              },
            },
          }}
        >
          <Tab label="Add Category" />
          <Tab label="All Categories" />
        </Tabs>

       
        {tabValue === 0 && (
          <Box p={3}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
           
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Select Business"
                    value={selectedBusinessId}
                    onChange={(e) => setSelectedBusinessId(e.target.value)}
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    required 
                    sx={{ mb: 2,mt:3 }} 
                  >
                    {businesses.length === 0 && (
                      <MenuItem disabled>No businesses found</MenuItem>
                    )}
                    {businesses.map((b) => (
                      <MenuItem key={b._id} value={b._id}>
                        {b.businessName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Category Name Input */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Category Name"
                    variant="outlined"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      formLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon /> 
                    }
                    disabled={formLoading || !selectedBusinessId} 
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      bgcolor: Colors.LOGOColor,
                      '&:hover': { bgcolor: Colors.LOGOlight}
                    }}
                  >
                    {formLoading ? "Adding..." : "Add Category"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}

        {/* --- All Categories Tab Content (Tab 1) --- */}
        {tabValue === 1 && (
          <Box p={3}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : !selectedBusinessId ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Please select a business to view categories.
                </Typography>
              </Paper>
            ) : categories.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No categories found for the selected business.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, bgcolor: Colors.LOGOColor, '&:hover': { bgcolor: Colors.LOGOlight } }}
                  onClick={() => setTabValue(0)} 
                >
                  Add First Category
                </Button>
              </Paper>
            ) : (
              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: Colors.LOGOlight }}>
                      <TableCell sx={{ fontWeight: 'bold', color: Colors.LOGOColor }}>Category Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: Colors.LOGOColor }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow key={cat._id} hover>
                        <TableCell>{cat.name}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleEditClick(cat)}
                            color="primary"
                            sx={{ mr: 1, color: Colors.LOGOlight }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteCategory(cat)}
                            color="error"
                            sx={{ color: Colors.LOGOColor }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Paper>

      {/* Edit Category Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setCurrentCategory(null);
          setCategoryName("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: Colors.LOGOlight, color: Colors.LOGOColor }}>
          Edit Category
          <IconButton
            aria-label="close"
            onClick={() => {
              setEditModalOpen(false);
              setCurrentCategory(null);
              setCategoryName("");
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
    
            <TextField
              fullWidth
              label="Category Name"
              variant="outlined"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              size={isMobile ? "small" : "medium"}
              sx={{ mb: 2 }}
            />
           
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setEditModalOpen(false);
              setCurrentCategory(null);
              setCategoryName("");
            }}
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{ color: Colors.LOGOColor, borderColor: Colors.LOGOColor }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit} 
            variant="contained"
            startIcon={
              formLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
            }
            disabled={formLoading}
            sx={{
              bgcolor: Colors.LOGOColor,
              '&:hover': { bgcolor: Colors.LOGOlight }
            }}
          >
            {formLoading ? "Updating..." : "Update Category"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusinessCategory;