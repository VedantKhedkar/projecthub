// server.js (ES Modules Version)

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Load env vars FIRST
dotenv.config();
console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);

// Import routes (all must be ESM)
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import customRequestRoutes from "./routes/customRequestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";



// Connect to MongoDB
connectDB();

const app = express();

// --- MIDDLEWARES ---
app.use(
  cors({
    origin: ["http://localhost:5173", "http://projecthub-backend-ten.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/custom-requests", customRequestRoutes);
app.use("/api/notifications", notificationRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  )
);
