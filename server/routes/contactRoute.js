import express from 'express';
import { addContact, deleteContact, adminGetAllContacts } from '../controllers/contactController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Users
router.post("/add", addContact);

// admin get all Enquiry
router.get("/get", isAuthenticatedUser, isAdmin, adminGetAllContacts);
router.delete("/delete", isAuthenticatedUser, isAdmin, deleteContact)

export default router;