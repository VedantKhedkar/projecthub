// controllers/paymentController.js

import Razorpay from "razorpay";
import crypto from "crypto";

import Payment from "../models/Payment.js";
import User from "../models/User.js";
import PrebuiltProject from "../models/PrebuiltProject.js";
import CustomRequest from "../models/CustomRequest.js";

// ---------------------------------------------
// GET RAZORPAY INSTANCE
// ---------------------------------------------
const getRazorpayInstance = () => {
  console.log("🔐 Razorpay Keys Loaded:", {
    key: process.env.RAZORPAY_KEY_ID,
    secret: process.env.RAZORPAY_KEY_SECRET ? "****" : "MISSING",
  });

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// ---------------------------------------------
// CREATE ORDER
// ---------------------------------------------
export const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid Amount" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("❌ Order Creation Error:", error);
    res.status(500).json({ message: "Gateway Error", error });
  }
};

// ---------------------------------------------
// VERIFY PAYMENT
// ---------------------------------------------
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      projectId,
      paymentType,
      amount,
    } = req.body;

    const razorpay = getRazorpayInstance();
    const paidNow = Number(amount) || 0;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing Payment Data" });
    }

    // ------------------- SIGNATURE VALIDATION -------------------
    const signString = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signString)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Signature Mismatch Detected");
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    let redirectUrl = "/my-projects";
    let projectName = "Unknown Project";

    // ============================================================
    // HANDLE CUSTOM REQUEST (ADVANCE)
    // ============================================================
    if (paymentType === "custom_advance") {
      const customReq = await CustomRequest.findById(projectId);

      if (customReq) {
        customReq.paidAmount = (customReq.paidAmount || 0) + paidNow;
        customReq.status = "In Progress";
        customReq.progress = 10;

        projectName = customReq.title + " (Advance)";
        redirectUrl = "/my-custom-requests";

        await customReq.save();
      }
    }

    // ============================================================
    // HANDLE CUSTOM REQUEST (FINAL)
    // ============================================================
    else if (paymentType === "custom_final") {
      const customReq = await CustomRequest.findById(projectId);

      if (customReq) {
        customReq.paidAmount = (customReq.paidAmount || 0) + paidNow;
        customReq.status = "Completed";
        customReq.progress = 100;

        projectName = customReq.title + " (Final)";
        redirectUrl = "/my-custom-requests";

        await customReq.save();
      }
    }

    // ============================================================
    // PREBUILT PROJECT PURCHASE
    // ============================================================
    else {
      const preBuiltProject = await PrebuiltProject.findById(projectId);
      if (preBuiltProject) projectName = preBuiltProject.title;

      const user = await User.findById(userId);

      if (user && !user.purchasedProjects.includes(projectId)) {
        user.purchasedProjects.push(projectId);
        await user.save();
      }
    }

    // ============================================================
    // SAVE PAYMENT LOG
    // ============================================================
    await Payment.create({
      user: userId,
      razorpay_payment_id,
      razorpay_order_id,
      amount: paidNow,
      status: "Success",
      type: paymentType || "prebuilt",
      projectName,
    });

    res.json({
      success: true,
      message: "Payment Verified Successfully",
      redirect: redirectUrl,
    });
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------------------------------------
// ADMIN — GET ALL PAYMENTS
// ---------------------------------------------
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error("❌ Fetch Payment Logs Error:", error);
    res.status(500).json({ message: error.message });
  }
};
