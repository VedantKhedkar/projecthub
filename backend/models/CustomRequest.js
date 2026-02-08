// models/CustomRequest.js

import mongoose from "mongoose";

const customRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: String, required: true },

    // Optional Fields
    category: { type: String, default: "Web Development" },
    deadline: { type: String, default: "Flexible" },
    techStack: { type: String, default: "Not Specified" },
    hosting: { type: String, default: "No" },
    extraFeatures: { type: String, default: "" },
    attachments: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Pending", "Quote Sent", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },

    adminQuote: { type: Number, default: 0 },

    // Financial & Progress
    paidAmount: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },

    // Final uploaded files
    finalProjectCode: { type: String, default: "" },
    finalVideo: { type: String, default: "" },
    finalAssets: { type: String, default: "" },
  },
  { timestamps: true }
);

const CustomRequest = mongoose.model("CustomRequest", customRequestSchema);

export default CustomRequest;
