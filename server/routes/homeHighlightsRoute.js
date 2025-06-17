import express from "express";
import multer from 'multer';
import { addHomeHighlights, getHomeHighlights, deleteHomeHighlights } from "../controllers/homeHighlightsController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";

const router = express.Router();
// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get("/get", getHomeHighlights);

router.post("/upload", upload.array("images", 5), isAuthenticatedUser, isAdmin, addHomeHighlights); // Max 5 images

router.delete("/delete", isAuthenticatedUser, isAdmin, deleteHomeHighlights);

export default router;
