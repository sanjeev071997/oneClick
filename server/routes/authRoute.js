import express from "express";
import {
  register,
  login,
  logout,
  profileDetails,
  profileUpdate,
  profileUpdatePassword,
  forgotPassword,
  resetPassword,
  getAllUsers
} from "../controllers/authController.js";
import { isAuthenticatedUser, isAdmin} from "../middlewares/authMiddleware.js";
import { registerValidation, loginValidation, profileUpdateValidation, profileUpdatePasswordValidation, resetPasswordValidation } from '../helpers/authHelper.js';

const router = express.Router();

router.post("/register",registerValidation, register);
router.post("/login",loginValidation, login);
router.get("/logout", logout);
router.get("/profile", isAuthenticatedUser, profileDetails);
router.put("/profile/update", isAuthenticatedUser, profileUpdateValidation, profileUpdate);
router.put("/profile/password/update", isAuthenticatedUser, profileUpdatePasswordValidation, profileUpdatePassword ); // Change password
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPasswordValidation, resetPassword);

// Admin get all users
router.get("/admin/get", isAuthenticatedUser, isAdmin, getAllUsers)

export default router;
