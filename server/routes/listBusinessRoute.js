
import express from "express";
import multer from 'multer';
import {
    addBusiness,
    getBusinessByCategory,
    getAllBusiness,
    getUserBusiness
} from "../controllers/listBusinessController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";

// Configure Multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

router.post("/add", upload.array('images', 5), addBusiness);
router.post("/get",  getBusinessByCategory);

router.get("/all", isAuthenticatedUser, isAdmin, getAllBusiness);

router.get("/get", isAuthenticatedUser, getUserBusiness);


export default router;