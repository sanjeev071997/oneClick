import express from "express";
import {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlanById,
    deletePlanById,
} from "../controllers/plansController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticatedUser, isAdmin, createPlan); // Create a new plan

router.get("/all", getAllPlans); // Get all plans

router.get("/get", isAuthenticatedUser, getPlanById); // Get a single plan by UserID

router.put("/update", isAuthenticatedUser, isAdmin, updatePlanById); // Update a plan by ID

router.delete("/delete", isAuthenticatedUser, isAdmin, deletePlanById); // Delete a plan by ID


export default router;