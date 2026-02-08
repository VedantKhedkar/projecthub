// routes/uploadRoutes.js

import express from "express";
import multer from "multer";
import path from "path";
import { uploadFile } from "../controllers/uploadController.js";

const router = express.Router();

// Multer temporary storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");  // Make sure this folder exists
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Allow all file types (images, zip, mp4, pdf, etc.)
const upload = multer({ storage });

// Route - Upload Single File
router.post("/", upload.single("file"), uploadFile);

export default router;
