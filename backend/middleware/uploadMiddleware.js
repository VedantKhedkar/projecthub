import multer from "multer";
import cloudinaryModule from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "projecthub",
      resource_type: "auto",
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

export const upload = multer({ storage });
