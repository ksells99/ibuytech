import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

// ROUTES

// Registration & get all users (need to be admin)
router.route("/").post(registerUser).get(protect, adminProtect, getUsers);

// Login
router.post("/login", authUser);

// Profile - private so use protect middleware
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Get/Delete/Update user (need to be admin)
router
  .route("/:id")
  .delete(protect, adminProtect, deleteUser)
  .get(protect, adminProtect, getUserById)
  .put(protect, adminProtect, updateUser);

export default router;
