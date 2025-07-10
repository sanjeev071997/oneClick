import express from "express";
import {
  getBusinessClicks,
  getAllBusinessClicks,
  trackBusinessClick,
} from "../controllers/leadsController.js";
import { isAuthenticatedUser, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/track", trackBusinessClick);
router.get("/get-by-business", isAuthenticatedUser, getBusinessClicks); // for vendors
router.get("/admin/all", isAuthenticatedUser, isAdmin, getAllBusinessClicks); // for admin

export default router;