
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Grid, Select, MenuItem, InputLabel, FormControl,
  Avatar, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Close, CloudUpload } from '@mui/icons-material';
import axios from '../../axiosInstance';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system'; 


const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, 
  color: theme.palette.common.white, 
  fontWeight: 'bold',
  fontSize: '1rem',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover, 
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected, 
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ProductTable = () => {
  const user = useSelector((state) => state.user.user);

  const [products, setProducts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [dialogLoading, setDialogLoading] = useState(false); 

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    businessId: '',
    categoryId: '',
    name: '',
    price: '',
    discount: '',
    stock: '',
    details: '',
    imageFiles: [],
    imagePreviews: [] 
  });

  useEffect(() => {
    if (user?._id) {
      fetchBusinesses();
    }
  }, [user]);

  useEffect(() => {
    if (currentProduct.businessId) {
      fetchProducts(currentProduct.businessId);
      fetchCategories(currentProduct.businessId);
    } else {
      setProducts([]);
      setCategories([]);
    }
  }, [currentProduct.businessId]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      // Assuming GET request might need params for userId, not data
      const res = await axios.get("/api/v1/business/get", {
         params: { userId: user._id }, 
      });
      setBusinesses(res.data?.data || []);
      if (res.data?.data.length === 1 && !isEditMode) {
        setCurrentProduct(prev => ({ ...prev, businessId: res.data.data[0]._id }));
      }
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
      message.error("Failed to fetch businesses.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (businessId) => {
    if (!businessId) {
      setCategories([]);
      return;
    }
    setDialogLoading(true);
    try {
      const res = await axios.post(`/api/v1/product/category/get/${businessId}`);
      setCategories(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      message.error("Failed to fetch categories.");
    } finally {
      setDialogLoading(false);
    }
  };

  const fetchProducts = async (businessId) => {
    if (!businessId) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/product/get/${businessId}`);
      setProducts(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      message.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setCurrentProduct({
      id: null,
      businessId: businesses.length === 1 ? businesses[0]._id : '',
      categoryId: '', name: '', price: '', discount: '', stock: '', details: '',
      imageFiles: [], imagePreviews: []
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (product) => {
    const existingImages = Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []);
    
    setCurrentProduct({
      ...product,
      id: product._id,
      imageFiles: [], 
      imagePreviews: existingImages 
    });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
    if (name === "businessId") {
      setCurrentProduct(prev => ({ ...prev, categoryId: '', businessId: value }));
      fetchProducts(value);
      fetchCategories(value);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const previews = imageFiles.map(file => URL.createObjectURL(file));
    
    setCurrentProduct(prev => ({ 
      ...prev, 
      imageFiles: [...prev.imageFiles, ...imageFiles],
      imagePreviews: [...prev.imagePreviews, ...previews] 
    }));
  };
  
  const handleRemoveImage = (indexToRemove) => {
    setCurrentProduct(prev => {
      const newImagePreviews = prev.imagePreviews.filter((_, idx) => idx !== indexToRemove);
      const newImageFiles = prev.imageFiles.filter((_, idx) => {
       
        return idx < prev.imageFiles.length - (prev.imagePreviews.length - newImagePreviews.length);
      });
      return { ...prev, imagePreviews: newImagePreviews, imageFiles: newImageFiles };
    });
  };

  const handleSubmit = async () => {
    if (!currentProduct.businessId || !currentProduct.categoryId || !currentProduct.name || !currentProduct.price || !currentProduct.stock || !currentProduct.details) {
      message.warning("Please fill all required fields: Business, Category, Name, Price, Stock, and Description.");
      return;
    }

    setDialogLoading(true);
    const formData = new FormData();
    formData.append("businessId", currentProduct.businessId);
    formData.append("categoryId", currentProduct.categoryId);
    formData.append("name", currentProduct.name);
    formData.append("price", currentProduct.price);
    formData.append("discount", currentProduct.discount || 0);
    formData.append("stock", currentProduct.stock);
    formData.append("details", currentProduct.details);
    
    // Append new image files
    currentProduct.imageFiles.forEach(file => formData.append("images", file));

 
    currentProduct.imagePreviews.forEach(preview => {
      if (!preview.startsWith('blob:')) { 
        formData.append("existingImages", preview); 
      }
    });

    try {
      if (isEditMode) {
        await axios.put(`/api/v1/product/update/${currentProduct.id}`, formData);
        message.success("Product updated successfully!");
      } else {
        await axios.post("/api/v1/product/create", formData);
        message.success("Product added successfully!");
      }
      handleCloseDialog();
      fetchProducts(currentProduct.businessId);
    } catch (error) {
      console.error("Submit failed:", error);
      message.error(error.response?.data?.message || "Submit failed. Please try again.");
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/v1/product/delete/${productId}`);
      message.success("Product deleted successfully!");
      fetchProducts(currentProduct.businessId);
    } catch (err) {
      console.error("Delete failed:", err);
      message.error(err.response?.data?.message || "Delete failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getBusinessName = (id) => businesses.find(b => b._id === id)?.businessName || 'Unknown';
  const getCategoryName = (id) => categories.find(c => c._id === id)?.name || 'Unknown';

  return (
    <Box p={3} sx={{  minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.dark', }}>
          Product Catalog
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
            },
          }}
        >
          Add New Product
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
          <Typography ml={2}>Loading products...</Typography>
        </Box>
      ) : (
        <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell>Image</StyledTableHeadCell>
                  <StyledTableHeadCell>Name</StyledTableHeadCell>
                  <StyledTableHeadCell>Category</StyledTableHeadCell>
                  <StyledTableHeadCell>Business</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Price</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Discount</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Stock</StyledTableHeadCell>
                  <StyledTableHeadCell>Details</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">Actions</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No products found for the selected business.
                    </TableCell>
                  </TableRow>
                ) : products.map((p) => (
                  <StyledTableRow key={p._id}>
                    <TableCell sx={{ width: 80 }}>
                        {/* Image fix: Check if p.images is an array or a string */}
                        <Avatar 
                            src={Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (typeof p.images === 'string' ? p.images : '')} 
                            variant="rounded" 
                            sx={{ width: 60, height: 60 }} 
                        />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>{p.name}</TableCell>
                    <TableCell>{getCategoryName(p.categoryId)}</TableCell>
                    <TableCell>{getBusinessName(p.businessId)}</TableCell>
                    {/* Rupees symbol fix */}
                    <TableCell align="right">₹{parseFloat(p.price).toFixed(2)}</TableCell>
                    <TableCell align="right">{p.discount > 0 ? `${p.discount}%` : 'N/A'}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={p.stock}
                        color={p.stock > 10 ? 'success' : (p.stock > 0 ? 'warning' : 'error')}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.details}
                    </TableCell>
                    <TableCell align="center" sx={{ width: 120 }}>
                      <IconButton color="primary" onClick={() => handleOpenEditDialog(p)}><Edit /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(p._id)}><Delete /></IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          {dialogLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
              <Typography ml={2}>Loading data...</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="business-select-label">Business</InputLabel>
                  <Select
                    labelId="business-select-label"
                    name="businessId"
                    value={currentProduct.businessId}
                    onChange={handleInputChange}
                    label="Business"
                  >
                    {businesses.length === 0 ? (
                      <MenuItem value="" disabled>No businesses available</MenuItem>
                    ) : (
                      businesses.map(b => (
                        <MenuItem key={b._id} value={b._id}>{b.businessName}</MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required disabled={!currentProduct.businessId || categories.length === 0}>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    name="categoryId"
                    value={currentProduct.categoryId}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    {categories.length === 0 ? (
                      <MenuItem value="" disabled>No categories for this business</MenuItem>
                    ) : (
                      categories.map(c => (
                        <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Product Name" name="name" value={currentProduct.name} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Price" name="price" type="number" value={currentProduct.price} onChange={handleInputChange} required inputProps={{ step: "0.01" }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Stock" name="stock" type="number" value={currentProduct.stock} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Discount (%)" name="discount" type="number" value={currentProduct.discount} onChange={handleInputChange} inputProps={{ min: "0", max: "100", step: "1" }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Product Description" name="details" multiline rows={4} value={currentProduct.details} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12}>
                <Button component="label" variant="outlined" startIcon={<CloudUpload />} fullWidth sx={{ mb: 1, py: 1.5 }}>
                  Upload Product Images
                  <input type="file" multiple hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {currentProduct.imagePreviews.length > 0 && (
                  <Box mt={1} display="flex" gap={1.5} flexWrap="wrap" sx={{ border: '1px dashed #ccc', p: 1, borderRadius: 2 }}>
                    {currentProduct.imagePreviews.map((src, idx) => (
                      <Box key={idx} sx={{ position: 'relative', width: 80, height: 80, overflow: 'hidden', borderRadius: 1 }}>
                        <img src={src} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                          }}
                          onClick={() => handleRemoveImage(idx)}
                        >
                          <Close fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="error">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={dialogLoading}>
            {dialogLoading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Product' : 'Add Product')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;