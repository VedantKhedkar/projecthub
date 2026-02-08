import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  getAdminStats,
  getAllUsers,
  approveUser,
  rejectUser     // ✅ IMPORT ADDED
} from "../controllers/userController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", registerUser);
router.post("/login", authUser);

// User routes
router.get("/profile", protect, getUserProfile);

// Admin routes
router.get("/admin/stats", protect, admin, getAdminStats);
router.get("/admin/users", protect, admin, getAllUsers);
router.put("/admin/approve/:id", protect, admin, approveUser);
router.delete("/admin/reject/:id", protect, admin, rejectUser); // ✅ FIXED

export default router;
