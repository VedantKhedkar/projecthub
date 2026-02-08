// routes/notificationRoutes.js

import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  getAdminNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// User notifications
router.get("/user", protect, getUserNotifications);

// Admin notifications
router.get("/admin", protect, admin, getAdminNotifications);

// Mark a notification as read
router.put("/mark-read/:id", protect, markAsRead);

export default router;
