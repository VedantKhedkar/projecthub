// routes/customRequestRoutes.js

import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryModule from "cloudinary";
const cloudinary = cloudinaryModule.v2;

import {
  createRequest,
  getMyRequests,
  getAllRequestsAdmin,
  updateRequest,
  uploadProjectFiles
} from "../controllers/customRequestController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

// --- CLOUDINARY CONFIG ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- STORAGE CONFIGURATION ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let resType = "auto";

    const fileExt = file.originalname.split(".").pop();
    const baseName = file.originalname.split(".")[0];

    if (
      file.mimetype.includes("zip") ||
      file.mimetype.includes("rar") ||
      file.mimetype.includes("sql") ||
      file.mimetype.includes("application")
    ) {
      resType = "raw";
    }

    return {
      folder: "projecthub_deliveries",
      resource_type: resType,
      public_id: `${baseName}_${Date.now()}.${fileExt}`,
    };
  },
});

const upload = multer({ storage });
const router = express.Router();

// --- ROUTES ---
router.post("/", protect, createRequest);
router.get("/my", protect, getMyRequests);
router.get("/admin/all", protect, admin, getAllRequestsAdmin);
router.put("/:id", protect, admin, updateRequest);

// Upload route for Code + Video + Assets
router.post(
  "/:id/upload",
  protect,
  admin,
  upload.fields([
    { name: "projectCode", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "assets", maxCount: 1 },
  ]),
  uploadProjectFiles
);

export default router;
