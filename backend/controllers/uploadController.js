// controllers/uploadController.js

import cloudinaryModule from "cloudinary";
import fs from "fs";
import asyncHandler from "express-async-handler";

const cloudinary = cloudinaryModule.v2;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==============================================
// UPLOAD FILE TO CLOUDINARY
// POST /api/upload
// ==============================================
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  try {
    // Upload to Cloudinary (supports images, videos, zip, raw, etc.)
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "projecthub",
    });

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    });

  } catch (error) {
    console.error(error);

    // Attempt cleanup of temp file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500);
    throw new Error("Cloudinary Upload Failed");
  }
});
