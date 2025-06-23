import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction, // Keep this import
  Paper,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Close,
  CloudUpload,
  Inventory,
  AttachMoney,
  Storage,
  Business,
  Info
} from '@mui/icons-material';

const Product = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Sample business data (assuming it's external or comes from an API)
  const [businesses] = useState([
    { id: 1, name: 'Tech Gadgets Inc.' },
    { id: 2, name: 'Fashion Boutique' },
    { id: 3, name: 'Home Appliances' },
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      businessId: 1,
      name: 'Smartphone',
      price: 599.99,
      stock: 50,
      details: 'Latest model with 128GB storage and advanced camera system',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      businessId: 2,
      name: 'Designer Dress',
      price: 129.99,
      stock: 20,
      details: 'Elegant summer collection with premium fabrics',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      businessId: 3,
      name: 'Smart TV',
      price: 899.99,
      stock: 15,
      details: '55" 4K Ultra HD with smart features and voice control',
      image: 'https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=400&auto=format&fit=crop&q=80'
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    businessId: '',
    name: '',
    price: '',
    discount: '',
    stock: '',
    details: '',
    image: '',
    TotalPrice: '',
    imageFile: null
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenAddDialog = () => {
    setCurrentProduct({
      id: null,
      businessId: '',
      name: '',
      price: '',
      discount: '',
      stock: '',
      details: '',
      image: '',
      TotalPrice: '',
      imageFile: null
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (product) => {
    setCurrentProduct({
      ...product,
      imageFile: null
    });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentProduct(prev => ({
          ...prev,
          image: reader.result,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCurrentProduct(prev => ({
      ...prev,
      image: '',
      imageFile: null
    }));
  };

  const handleSubmit = () => {
    if (isEditMode) {
      setProducts(products.map(p =>
        p.id === currentProduct.id ? currentProduct : p
      ));
    } else {
      const newProduct = {
        ...currentProduct,
        id: Math.max(0, ...products.map(p => p.id)) + 1 // Ensure new ID is unique
      };
      setProducts([...products, newProduct]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  const getBusinessName = (id) => {
    return businesses.find(b => b.id === id)?.name || 'Unknown Business';
  };

  return (
    <Box sx={{
      p: 3,
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 700,
          color: '#275559',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Inventory fontSize="large" />
          Product Catalog
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
          sx={{
            backgroundColor: '#9EDC29',
            '&:hover': { backgroundColor: '#7CB51F' },
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          New Product
        </Button>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Product List */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#275559' }}>
              Products List
            </Typography>
            <List>
              {products.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No products found. Add a new product!
                </Typography>
              ) : (
                products.map((product) => (
                  <React.Fragment key={product.id}>
                    <ListItem
                      button
                      selected={selectedProduct?.id === product.id}
                      onClick={() => setSelectedProduct(product)}
                      sx={{
                        borderRadius: 1,
                        '&.Mui-selected': {
                          backgroundColor: '#E6FFE6',
                          '&:hover': {
                            backgroundColor: '#D9FAD9'
                          }
                        },
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        },
                        // Ensure flex display for aligning items
                        display: 'flex',
                        alignItems: 'center',
                        py: 1, // Consistent padding
                        pr: isSmallScreen ? 1 : 0, // Reduce right padding for small screens if actions are inside
                      }}
                    >
                      <ListItemAvatar sx={{ mr: 2 }}>
                        <Avatar
                          src={product.image}
                          alt={product.name}
                          variant="rounded"
                          sx={{ width: 56, height: 56, objectFit: 'contain' }}
                        />
                      </ListItemAvatar>

                      {/* Flex container for text and price/stock, to push them apart */}
                      <Box sx={{
                        flexGrow: 1, // Allows this box to take up available space
                        display: 'flex',
                        flexDirection: isSmallScreen ? 'column' : 'row', // Stack on small, row on large
                        alignItems: isSmallScreen ? 'flex-start' : 'center', // Align to start when stacked
                        justifyContent: 'space-between', // Push name to left, price/stock to right
                        minWidth: 0, // Prevent overflow
                      }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.name}
                            </Typography>
                          }
                          secondary={
                            <Typography component="span" variant="body2" color="text.secondary">
                              {getBusinessName(product.businessId)}
                            </Typography>
                          }
                          sx={{ my: 0, pr: isSmallScreen ? 0 : 1 }} // Add padding to ListItemText on larger screens if needed
                        />

                        {/* Price and Stock chips */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: isSmallScreen ? 0.5 : 0, // Margin top when stacked
                          flexShrink: 0, // Prevent price/stock from shrinking
                        }}>
                          <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: '#275559' }}>
                            ${product.price.toFixed(2)}
                          </Typography>
                          <Chip
                            label={`${product.stock} in stock`}
                            size="small"
                            color={product.stock > 10 ? 'success' : 'error'}
                            sx={{ fontWeight: 500, height: '20px' }}
                          />
                        </Box>
                      </Box>

                      {/* Action buttons (Edit/Delete) - placed directly inside ListItem and aligned */}
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0, // Prevent buttons from shrinking
                        ml: isSmallScreen ? 0 : 2, // Add margin-left on larger screens for separation
                        mt: isSmallScreen ? 1 : 0, // Add margin-top for small screens if text/price stack above
                        borderTop: isSmallScreen ? '1px solid #e5e7eb' : 'none', // Separator for small screens
                        pt: isSmallScreen ? 1 : 0, // Padding top with separator
                        width: isSmallScreen ? '100%' : 'auto', // Full width for buttons on small screen
                        justifyContent: isSmallScreen ? 'flex-end' : 'flex-start', // Align to right on small, to start on large (relative to this box)
                      }}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent ListItem click from firing
                            handleOpenEditDialog(product);
                          }}
                          sx={{ color: '#275559' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent ListItem click from firing
                            handleDelete(product.id);
                          }}
                          sx={{ color: '#ef4444', ml: 1 }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItem>
                    <Divider component="li" sx={{ my: 1, borderColor: '#f0f0f0' }} />
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Product Details (remains unchanged) */}
        <Grid item xs={12} md={7}>
          {selectedProduct ? (
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#275559' }}>
                  {selectedProduct.name}
                </Typography>
                <Chip
                  label={getBusinessName(selectedProduct.businessId)}
                  icon={<Business fontSize="small" />}
                  sx={{
                    backgroundColor: '#E6FFE6',
                    color: '#275559',
                    fontWeight: 600
                  }}
                />
              </Box>

              <Grid container spacing={isSmallScreen ? 2 : 3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{
                    width: '100%',
                    height: isSmallScreen ? 200 : 300,
                    backgroundColor: '#f1f5f9',
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: isSmallScreen ? 2 : 0
                  }}>
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <Typography color="textSecondary">
                        No Image Available
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#275559' }}>
                      Price
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#9EDC29', fontWeight: 700 }}>
                      ${selectedProduct.price.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#275559' }}>
                      Stock
                    </Typography>
                    <Chip
                      label={`${selectedProduct.stock} available`}
                      color={selectedProduct.stock > 10 ? 'success' : 'error'}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#275559' }}>
                      Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {selectedProduct.details}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              backgroundColor: '#f1f5f9'
            }}>
              <Info sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                No Product Selected
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                Select a product from the list to view details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Add/Edit Product Dialog (remains unchanged) */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'visible'
          }
        }}
      >
        <DialogTitle sx={{
          backgroundColor: '#f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          borderBottom: '1px solid #e2e8f0'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#275559' }}>
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </Typography>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              color: '#64748b',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Grid container>
            {/* Image Upload Section */}
            <Grid item xs={12} md={5} sx={{
              p: 3,
              borderRight: { md: '1px solid #e2e8f0' },
              backgroundColor: '#f8fafc'
            }}>
              <Box sx={{
                border: '2px dashed #cbd5e1',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 300,
                position: 'relative'
              }}>
                {currentProduct.image ? (
                  <>
                    <Box sx={{
                      width: '100%',
                      height: 250,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}>
                      <img
                        src={currentProduct.image}
                        alt="Product preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: 8
                        }}
                      />
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Close />}
                      onClick={handleRemoveImage}
                      sx={{ mt: 1 }}
                    >
                      Remove Image
                    </Button>
                  </>
                ) : (
                  <>
                    <CloudUpload sx={{
                      fontSize: 48,
                      color: '#94a3b8',
                      mb: 2
                    }} />
                    <Typography variant="body1" sx={{
                      color: '#64748b',
                      mb: 2
                    }}>
                      Drag & drop product image here or click to browse
                    </Typography>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUpload />}
                      sx={{
                        backgroundColor: '#9EDC29',
                        '&:hover': { backgroundColor: '#7CB51F' }
                      }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                    <Typography variant="caption" sx={{
                      color: '#94a3b8',
                      mt: 2
                    }}>
                      Recommended size: 800x800px
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>

            {/* Form Section */}
            <Grid item xs={12} md={7} sx={{ p: 3 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Business</InputLabel>
                <Select
                  name="businessId"
                  value={currentProduct.businessId}
                  label="Business"
                  onChange={handleInputChange}
                  required
                  sx={{ backgroundColor: '#fff' }}
                >
                  {businesses.map((business) => (
                    <MenuItem key={business.id} value={business.id}>
                      {business.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={currentProduct.name}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
                required
              />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price ($)"
                    name="price"
                    type="number"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <AttachMoney sx={{
                          color: 'action.active',
                          mr: 1,
                          my: 0.5
                        }} />
                      )
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    value={currentProduct.stock}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <Storage sx={{
                          color: 'action.active',
                          mr: 1,
                          my: 0.5
                        }} />
                      )
                    }}
                    required
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Product Description"
                name="details"
                value={currentProduct.details}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{
          p: 2,
          borderTop: '1px solid #e2e8f0',
          justifyContent: 'space-between'
        }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: '#64748b',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#9EDC29',
              '&:hover': { backgroundColor: '#7CB51F' },
              px: 3,
              textTransform: 'none'
            }}
          >
            {isEditMode ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Product;