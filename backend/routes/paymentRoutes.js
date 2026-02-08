// routes/paymentRoutes.js

import express from "express";
import { createOrder, verifyPayment, getAllPayments } from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", protect, createOrder);

// Verify payment (success/failure)
router.post("/verify", protect, verifyPayment);

// Admin – get all payments
router.get("/all", protect, admin, getAllPayments);

export default router;
