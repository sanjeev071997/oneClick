import express from "express";
import {
    createProduct,
    getAllProductsByBusinessId,
    updateProductById,
    deleteProductById,
    getProductById,
    getAllProductsByAdmin,
} from "../controllers/productController.js";
import { isAuthenticatedUser, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticatedUser, createProduct); // Add a new product

router.get("/get/:businessId", getAllProductsByBusinessId); // Get all products by business ID and User

router.put("/update/:productId", isAuthenticatedUser, updateProductById); // Update a product

router.delete("/delete/:productId", isAuthenticatedUser, deleteProductById); // Delete a product

router.get("/get/product/:id", getProductById); // Get a product by ID User 

router.get("/admin/all", isAuthenticatedUser, isAdmin, getAllProductsByAdmin); // Get all products by Admin

export default router;

