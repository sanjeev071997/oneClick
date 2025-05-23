
import express from "express";
import {
    addEnquiry,
    getEnquiry,
    updateEnquiry,
    deleteEnquiry,
    adminGetEnquiry,
} from "../controllers/enquiryController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/add", isAuthenticatedUser, addEnquiry);
router.get("/get", isAuthenticatedUser, getEnquiry);
router.put("/update", isAuthenticatedUser, updateEnquiry);
router.delete("/delete", isAuthenticatedUser, deleteEnquiry);

// admin get all Enquiry
router.get("/get", isAuthenticatedUser, isAdmin, adminGetEnquiry);
export default router;