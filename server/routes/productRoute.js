import express from "express";
import multer from 'multer';
import {
    createProduct,
    getAllProductsByUserId,
    updateProductById,
    deleteProductById,
    getProductById,
    getAllProductsByAdmin,
} from "../controllers/productController.js";
import { isAuthenticatedUser, isAdmin } from "../middlewares/authMiddleware.js";

// Configure Multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

router.post("/create", upload.array('images', 5), isAuthenticatedUser, createProduct); // Add a new product

router.get("/get/:userId", getAllProductsByUserId); // Get all products by userId and User

router.put("/update/:id", upload.array('images', 5), isAuthenticatedUser, updateProductById); // Update a product

router.delete("/delete/:id", isAuthenticatedUser, deleteProductById); // Delete a product

router.get("/get/product/:id", getProductById); // Get a product by ID User 

router.get("/admin/all", isAuthenticatedUser, isAdmin, getAllProductsByAdmin); // Get all products by Admin

export default router;

