import express from "express";
import multer from 'multer';
import {
    addCategories,
    getCategories,
    getCategoriesById,
    updateCategories,
    deleteCategories
} from "../controllers/categoriesController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";

// Configure Multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

router.get("/get", getCategories);

router.get("/get/:id", getCategoriesById);

router.post("/add",upload.single('categoryImage'), isAuthenticatedUser, isAdmin, addCategories);

router.put("/update", upload.single('categoryImage'), isAuthenticatedUser, isAdmin, updateCategories);

router.delete("/delete", isAuthenticatedUser, isAdmin, deleteCategories);

export default router;
