import express from "express";
import multer from 'multer';
import { addADS, getADS, deleteADS } from "../controllers/adsController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";

const router = express.Router();
// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get("/get", getADS);

router.post("/upload", upload.array("images", 5), isAuthenticatedUser, isAdmin, addADS); // Max 5 images

router.delete("/delete", isAuthenticatedUser, isAdmin, deleteADS);

export default router;
