
import express from "express";
import multer from 'multer';
import {
    addBusiness,
    getBusinessByCategory,
    getAllBusiness,
    getBusinessById,
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
router.post("/get",  getBusinessByCategory); // Get Business by Category. This route does not require authentication

router.get("/get/:id",  getBusinessById);
// Business User
router.put("/update", upload.array('images', 5), isAuthenticatedUser, updateBusiness);
router.get("/get", isAuthenticatedUser, getUserBusiness); // Get User Business. This route requires authentication

// Admin
router.get("/all", isAuthenticatedUser, isAdmin, getAllBusiness);
router.delete("/delete", isAuthenticatedUser, isAdmin, deleteBusiness);

export default router;