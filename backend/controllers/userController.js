import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import PrebuiltProject from "../models/PrebuiltProject.js";
import PaymentLog from "../models/PaymentLog.js";
import Notification from "../models/Notification.js";   // ✅ ADDED
import jwt from "jsonwebtoken";

// ===============================
// JWT TOKEN
// ===============================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ===============================
// LOGIN USER
// ===============================
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isApproved && !user.isAdmin) {
    res.status(403);
    throw new Error("Your account is pending admin approval.");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isApproved: user.isApproved,
    token: generateToken(user._id),
  });
});

// ===============================
// REGISTER USER + NOTIFICATIONS
// ===============================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    isApproved: false,
  });

  // 🔔 USER Notification — Welcome
  await Notification.create({
    user: user._id,
    message: "Welcome to ProjectHub! Your account has been created.",
    forAdmin: false
  });

  // 🔔 ADMIN Notification — New User Registered
  await Notification.create({
    message: `New user registered: ${user.name}`,
    forAdmin: true
  });

  res.status(201).json({
    message: "Registration successful. Awaiting admin approval.",
  });
});

// ===============================
// USER PROFILE
// ===============================
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("purchasedProjects");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

// ===============================
// ADMIN — GET ALL USERS
// ===============================
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false }).sort({ createdAt: -1 });
  res.json(users);
});

// ===============================
// ADMIN — APPROVE USER + NOTIFICATIONS
// ===============================
export const approveUser = asyncHandler(async (req, res) => {
  console.log("Approve request received for ID:", req.params.id);

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    user.isApproved = true;
    await user.save();

    // 🔔 USER Notification — Approved
    await Notification.create({
      user: user._id,
      message: "Your account has been approved by the admin!",
      forAdmin: false
    });

    // 🔔 ADMIN Notification — Approved User
    await Notification.create({
      message: `User approved: ${user.name}`,
      forAdmin: true
    });

    res.json({ message: "User approved successfully" });

  } catch (error) {
    console.error("APPROVE ERROR:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ===============================
// ADMIN — REJECT USER + NOTIFICATIONS
// ===============================
export const rejectUser = asyncHandler(async (req, res) => {
  console.log("Reject request received for ID:", req.params.id);

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // 🔔 ADMIN Notification — Rejected User
  await Notification.create({
    message: `User rejected & deleted: ${user.name}`,
    forAdmin: true
  });

  await User.findByIdAndDelete(req.params.id);

  res.json({ message: "User rejected and removed", userId: req.params.id });
});

// ===============================
// ADMIN DASHBOARD STATS
// ===============================
export const getAdminStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments({ isAdmin: false });
  const orderCount = await PaymentLog.countDocuments({ status: "Success" });

  const revenueData = await PaymentLog.aggregate([
    { $match: { status: "Success" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalRevenue = revenueData.length ? revenueData[0].total : 0;

  const recentOrders = await PaymentLog.find({ status: "Success" })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name email")
    .populate("project", "title");

  res.json({
    userCount,
    orderCount,
    totalRevenue,
    recentOrders,
  });
});
