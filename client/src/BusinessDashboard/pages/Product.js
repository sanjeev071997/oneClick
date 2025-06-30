import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, Close, CloudUpload } from "@mui/icons-material";
import { message, Modal } from "antd";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import axios from "../../axiosInstance";

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: "bold",
  fontSize: "1rem",
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:hover": { backgroundColor: theme.palette.action.selected },
  "&:last-child td, &:last-child th": { border: 0 },
}));

const ProductTable = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;
  const [products, setProducts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    businessId: "",
    userId: user?._id,
    category: "",
    name: "",
    price: "",
    discount: "",
    stock: "",
    details: "",
    images: [],
  });

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/business/get");
      const fetched = res.data?.data || [];
      setBusinesses(fetched);

      if (fetched.length === 1 && !isEditMode) {
        setCurrentProduct((prev) => ({ ...prev, businessId: fetched[0]._id }));
      }
    } catch (err) {
      message.error("You don't have any businesses yet.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/product/get/business/${userId}`);
      setProducts(res.data?.data || []);
    } catch (err) {
      message.error("You don't have any product  yet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBusinesses();
      fetchProducts();
    }
  }, [userId]);

  const handleOpenAddDialog = () => {
    setCurrentProduct({
      id: null,
      businessId: businesses.length === 1 ? businesses[0]._id : "",
      category: "",
      name: "",
      price: "",
      discount: "",
      stock: "",
      details: "",
      images: [],
    });
    setNewImages([]);
    setDeletedImages([]);
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (product) => {
    setCurrentProduct({
      ...product,
      id: product._id,
      images: Array.isArray(product.images)
        ? product.images
        : product.images
        ? [product.images]
        : [],
    });
    setNewImages([]);
    setDeletedImages([]);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct({
      id: null,
      businessId: "",
      category: "",
      name: "",
      price: "",
      discount: "",
      stock: "",
      details: "",
      images: [],
    });
    setNewImages([]);
    setDeletedImages([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    const maxNew =
      5 -
      (currentProduct.images.length - deletedImages.length) -
      newImages.length;
    const selected = files.slice(0, maxNew);
    const previews = selected.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));
    setNewImages((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const handleRemoveImage = (url, isNew) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((img) => img.url !== url));
    } else {
      setDeletedImages((prev) => [...prev, url]);
      setCurrentProduct((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img !== url),
      }));
    }
  };

  const handleSubmit = async () => {
    const { businessId, category, name, price, stock, details, discount } =
      currentProduct;
    setDialogLoading(true);

    const formData = new FormData();
    formData.append("businessId", businessId);
    formData.append("category", category);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("discount", discount || 0);
    formData.append("stock", stock);
    formData.append("details", details);
    formData.append("userId", user._id);
    newImages.forEach((img) => formData.append("images", img.file));
    if (deletedImages.length) {
      formData.append("deletedImages", JSON.stringify(deletedImages));
    }

    try {
      if (isEditMode) {
        await axios.put(
          `/api/v1/product/update/${currentProduct.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        message.success("Product updated successfully!");
      } else {
        await axios.post("/api/v1/product/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product added successfully!");
      }
      handleCloseDialog();
      fetchProducts();
    } catch (err) {
      message.error(err.response?.data?.message || "Submit failed. Try again.");
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Delete this product?",
      content: "This action cannot be undone.",
      okType: "danger",
      onOk: async () => {
        setLoading(true);
        try {
          await axios.delete(`/api/v1/product/delete/${id}`);
          message.success("Product deleted successfully!");
          fetchProducts();
        } catch (err) {
          message.error(err.response?.data?.message || "Delete failed.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getBusinessName = (id) =>
    businesses.find((b) => b._id === id)?.businessName || "Unknown";
  const allImages = [
    ...currentProduct.images.map((url) => ({ url, isNew: false })),
    ...newImages,
  ];

  return (
    <Box p={3}>
      <Grid xs={24} sm={12} md={12} lg={8}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Product Catalog
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
          >
            Add Product
          </Button>
        </Box>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell>Images</StyledTableHeadCell>
                  <StyledTableHeadCell>Name</StyledTableHeadCell>
                  <StyledTableHeadCell>Category</StyledTableHeadCell>
                  <StyledTableHeadCell>Business</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Price</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">
                    Discount
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Stock</StyledTableHeadCell>
                  {/* <StyledTableHeadCell>Details</StyledTableHeadCell> */}
                  <StyledTableHeadCell align="center">
                    Actions
                  </StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((p) => (
                    <StyledTableRow key={p._id}>
                      <TableCell>
                        <Avatar
                          src={Array.isArray(p.images) && p.images[0]?.url}
                          variant="rounded"
                          sx={{ width: 60, height: 60 }}
                        />
                      </TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>{getBusinessName(p.businessId)}</TableCell>
                      <TableCell align="right">
                        ₹{parseFloat(p.price).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {p.discount ? `${p.discount}%` : "N/A"}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={p.stock}
                          color={
                            p.stock > 10
                              ? "success"
                              : p.stock > 0
                              ? "warning"
                              : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      {/* <TableCell>{p.details}</TableCell> */}
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEditDialog(p)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(p._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? "Edit Product" : "Add Product"}
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Business</InputLabel>
                <Select
                  name="businessId"
                  value={currentProduct.businessId}
                  onChange={handleInputChange}
                  label="Business"
                >
                  {businesses.map((b) => (
                    <MenuItem key={b._id} value={b._id}>
                      {b.businessName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Name*"
                value={currentProduct.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="category"
                label="Category"
                value={currentProduct.category}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="price"
                type="number"
                label="Price*"
                value={currentProduct.price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="stock"
                type="number"
                label="Stock*"
                value={currentProduct.stock}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="discount"
                type="number"
                label="Discount"
                value={currentProduct.discount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="details"
                label="Details"
                value={currentProduct.details}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                disabled={allImages.length >= 5}
              >
                Upload Images
                <input
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                {allImages.map((img, idx) => (
                  <Box key={img.url || idx} sx={{ position: "relative" }}>
                    <img
                      src={img.url}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover" }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(img.url, img.isNew)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        bgcolor: "rgba(255,255,255,0.7)",
                        p: 0.5,
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="error" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={dialogLoading}
          >
            {dialogLoading ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;
