import express from "express";
import {
    addProductReview,
    getProductReview,
    userGetProductReview,
    updateProductReview,
    deleteProductReview,
    adminAllProductReview,
} from "../controllers/productReviewController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", isAuthenticatedUser, addProductReview);

router.post("/get", getProductReview);

// User Get all product reviews
router.get("/get", isAuthenticatedUser, userGetProductReview);

router.put("/update", isAuthenticatedUser, updateProductReview);

router.delete("/delete", isAuthenticatedUser, deleteProductReview);

// Admin Gat All product reviews
router.get("/admin/get", isAuthenticatedUser, isAdmin, adminAllProductReview)

export default router; 