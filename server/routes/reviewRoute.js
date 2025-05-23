
import express from "express";
import {
    addReview,
    getReview,
    userGetReview,
    updateReview,
    deleteReview,
} from "../controllers/reviewController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/add", isAuthenticatedUser, addReview);
router.post("/get", getReview);

// User Get all reviews
router.get("/get", isAuthenticatedUser, userGetReview);

router.put("/update", isAuthenticatedUser, updateReview);

router.delete("/delete", isAuthenticatedUser, deleteReview);

export default router;