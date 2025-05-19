
import express from "express";
import {
    addReview,
    getReview
} from "../controllers/reviewController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/add",  addReview);
router.post("/get", getReview);


export default router;