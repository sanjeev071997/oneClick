
import express from "express";
import {
    addReview,
    getReview,
    userGetReview
} from "../controllers/reviewController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/add", isAuthenticatedUser, addReview);
router.post("/get", getReview);

// User Get all reviews
router.get("/get", isAuthenticatedUser, userGetReview);


export default router;