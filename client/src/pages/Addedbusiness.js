import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import { message } from 'antd';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Box,
  Skeleton,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Person,
  MoreVert,
  Edit,
  Delete,
  Close,
  AddPhotoAlternate,
  Star,
  Business,

} from '@mui/icons-material';


const AddedBusiness = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/business/get');
      setBusinesses(response.data.data);
    } catch (error) {
      message.error('Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, business) => {
    setAnchorEl(event.currentTarget);
    setSelectedBusiness(business);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBusiness(null);
  };

  const handleEditClick = () => {
    // if (selectedBusiness) {
    setFormData({
      id: selectedBusiness._id,
      businessName: selectedBusiness.businessName,
      ownerName: selectedBusiness.ownerName,
      phone: selectedBusiness.phone,
      email: selectedBusiness.email,
      address: selectedBusiness.address,
      description: selectedBusiness.description,
      category: selectedBusiness.category?._id,
      images: selectedBusiness.images || []
    });
    setOpenEditDialog(true);
    // }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setSelectedBusiness(null);
    setNewImages([]);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedBusiness(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
      isNew: true
    }));
    setNewImages(prev => [...prev, ...newImagePreviews]);
  };

  const handleRemoveImage = (index, isNew) => {
    if (isNew) {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleUpdateBusiness = async () => {
    try {
      const formDataToSend = new FormData();
      // Append regular form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // formDataToSend.append('id', selectedBusiness?.id);

      const existingImageUrls = formData.images.map(img => img.url);

      formDataToSend.append('images', JSON.stringify(existingImageUrls));

      newImages.forEach((img) => {
        formDataToSend.append('images', img.file);
      });

      await axios.put('/api/v1/business/update', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchBusinesses();
      message.success('Business updated successfully');
      setOpenEditDialog(false);
      setNewImages([]);
    } catch (error) {
      console.error('Error updating business:', error);
      message.error('Failed to update business');
    }
  };


  const handleDeleteBusiness = async () => {
    try {
      await axios.delete('/api/v1/business/delete', {
        data: { id: selectedBusiness._id },
      });
      fetchBusinesses();
      message.success('Business deleted successfully');
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting business:', error);
      message.error('Failed to delete business');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={180} animation="wave" />
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" height={24} />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="60%" height={24} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="60%" height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }
  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight="bold">
            My Businesses
          </Typography>
        </Box>

        {businesses.length === 0 ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            p: 4,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(233,30,99,0.1) 0%, rgba(233,30,99,0) 70%)',
            }
          }}>
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              mb: 3,
              position: 'relative',
              '& svg': {
                fontSize: 60,
                color: 'white'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px dashed rgba(255,255,255,0.5)',
                animation: 'spin 20s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }
            }}>
              <Business />
            </Box>

            <Typography variant="h4" component="h2" gutterBottom sx={{
              fontWeight: 700,
              color: 'text.primary',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                background: 'linear-gradient(90deg, #1976d2 0%, #e91e63 100%)',
                borderRadius: 2
              }
            }}>
              No Businesses Found
            </Typography>

            <Typography variant="body1" sx={{
              maxWidth: 500,
              mb: 4,
              fontSize: '1.1rem',
              color: 'text.secondary'
            }}>
              You haven't added any businesses yet. Start building your portfolio by adding your first business listing.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/add/business")}
              startIcon={<AddPhotoAlternate />}
              sx={{
                borderRadius: 50,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 24px rgba(25, 118, 210, 0.4)',
                  background: 'linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)'
                }
              }}
            >
              Add Your First Business
            </Button>

            
            </Box>
        
        ) : (
          <Grid container spacing={3}>
            {businesses.map((business) => (
              <Grid item xs={12} sm={6} lg={4} key={business._id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ position: 'relative' }}>
                    {business.images?.length > 0 && (
                      <CardMedia
                        component="img"
                        height="180"
                        image={business.images[0].url}
                        alt={business.businessName}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '50%'
                    }}>
                      <IconButton
                        aria-label="settings"
                        onClick={(e) => handleMenuOpen(e, business)}
                        sx={{ color: 'white' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    {business.category && (
                      <Chip
                        label={business.category.name}
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          left: 16,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {business.businessName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star color="warning" fontSize="small" />
                        <Typography variant="body2" ml={0.5}>
                          4.8
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      p: 1,
                      borderRadius: 1
                    }}>
                      <Person sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {business.ownerName}
                      </Typography>
                    </Box>

                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {business.phone}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {business.email}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {business.address && (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        p: 1,
                        backgroundColor: 'action.hover',
                        borderRadius: 1
                      }}>
                        <LocationOn sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {business.address}
                        </Typography>
                      </Box>
                    )}

                    {business.description && (
                      <>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {business.description}
                        </Typography>
                      </>
                    )}
                  </CardContent>


                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleEditClick} sx={{ color: 'primary.main' }}>
            <Edit sx={{ mr: 1 }} /> Edit Business
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} /> Delete Business
          </MenuItem>
        </Menu>

        {/* Edit Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleEditDialogClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            Edit Business
            <IconButton
              aria-label="close"
              onClick={handleEditDialogClose}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 3, pt: 1 }}>
            <Tab label="Basic Info" />
            <Tab label="Images" />
          </Tabs>

          <DialogContent dividers>
            {activeTab === 0 && (
              <Grid container spacing={3} sx={{ pt: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Owner Name"
                    name="ownerName"
                    value={formData.ownerName || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Current Images
                </Typography>
                {formData.images?.length > 0 ? (
                  <ImageList cols={3} gap={16} sx={{ mb: 4 }}>
                    {formData.images.map((image, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={image.url}
                          alt={`Business ${index}`}
                          loading="lazy"
                          style={{ borderRadius: 8 }}
                        />
                        <ImageListItemBar
                          position="top"
                          actionIcon={
                            <IconButton
                              sx={{ color: 'white' }}
                              onClick={() => handleRemoveImage(index, false)}
                            >
                              <Close />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    No images uploaded yet
                  </Typography>
                )}

                <Typography variant="h6" gutterBottom>
                  Add New Images
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AddPhotoAlternate />}
                  sx={{ mb: 3 }}
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>

                {newImages.length > 0 && (
                  <ImageList cols={3} gap={16}>
                    {newImages.map((image, index) => (
                      <ImageListItem key={`new-${index}`}>
                        <img
                          src={image.url}
                          alt={`New ${index}`}
                          style={{ borderRadius: 8 }}
                        />
                        <ImageListItemBar
                          position="top"
                          actionIcon={
                            <IconButton
                              sx={{ color: 'white' }}
                              onClick={() => handleRemoveImage(index, true)}
                            >
                              <Close />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleEditDialogClose}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBusiness}
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{
            backgroundColor: 'error.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            Confirm Delete
            <IconButton
              aria-label="close"
              onClick={handleDeleteDialogClose}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Delete color="error" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h6">
                Delete {selectedBusiness?.businessName}?
              </Typography>
            </Box>
            <Typography>
              This will permanently delete the business and all its data. This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleDeleteDialogClose}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteBusiness}
              variant="contained"
              color="error"
              sx={{ borderRadius: 2 }}
            >
              Delete Business
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </>
  );
};

export default AddedBusiness;