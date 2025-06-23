import express from "express";
import {
    createProductCategory,
    getAllProductCategories,
    updateProductCategoryById,
    deleteProductCategoryById,
    getAllProductCategoriesByAdmin,
} from "../controllers/ProductCategoryController.js";
import { isAuthenticatedUser, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticatedUser, createProductCategory); // Add a new product category

router.get("/get", isAuthenticatedUser, getAllProductCategories); // Get a product category by ID

router.put("/update/:categoryId", isAuthenticatedUser, updateProductCategoryById); // Update a product category

router.delete("/delete/:categoryId", isAuthenticatedUser, deleteProductCategoryById); // Delete a product category

router.get("/admin/all", isAuthenticatedUser, isAdmin, getAllProductCategoriesByAdmin); // Get all product category by Admin

export default router;