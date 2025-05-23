
import express from "express";
import multer from 'multer';
import {
    addBusiness,
    getBusinessByCategory,
    getAllBusiness,
    getUserBusiness,
    updateBusiness,
    deleteBusiness
} from "../controllers/listBusinessController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";

// Configure Multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();
// All Users
router.post("/add", upload.array('images', 5), isAuthenticatedUser, addBusiness);
router.post("/get",  getBusinessByCategory);

// Business User
router.put("/update", upload.array('images', 5), isAuthenticatedUser, updateBusiness);
router.get("/get", isAuthenticatedUser, getUserBusiness);

// Admin
router.get("/all", isAuthenticatedUser, isAdmin, getAllBusiness);
router.delete("/delete", isAuthenticatedUser, isAdmin, deleteBusiness);

export default router;