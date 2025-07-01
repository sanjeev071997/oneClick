import express from "express";
import {
    createProductCategory,
    getAllProductCategories,
    updateProductCategoryById,
    deleteProductCategoryById,
} from "../controllers/ProductCategoryController.js";
import { isAuthenticatedUser, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticatedUser, isAdmin, createProductCategory); // Add a new product category

router.get("/get", isAuthenticatedUser, getAllProductCategories); // Get all product category 

router.put("/update/:id", isAuthenticatedUser, isAdmin, updateProductCategoryById); // Update a product category

router.delete("/delete/:id", isAuthenticatedUser, isAdmin, deleteProductCategoryById); // Delete a product category

export default router;