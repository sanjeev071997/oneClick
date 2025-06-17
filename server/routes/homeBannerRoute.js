import express from "express";
import multer from 'multer';
import { addHomeBanner, getHomeBanner, deleteHomeBanner } from "../controllers/homeBannerController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";

const router = express.Router();
// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get("/get", getHomeBanner);

router.post("/upload", upload.array("images", 5), isAuthenticatedUser, isAdmin, addHomeBanner); // Max 5 images

router.delete("/delete", isAuthenticatedUser, isAdmin, deleteHomeBanner);

export default router;
