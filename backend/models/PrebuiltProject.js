// models/PrebuiltProject.js

import mongoose from "mongoose";

const prebuiltProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true }, 
    price: { type: Number, required: true },
    description: { type: String, required: true },

    techStack: { type: [String], required: true }, 
    demoLink: { type: String },
    image: { type: String, required: true },

    // Downloadable Files
    sourceCodeZip: { type: String },
    assetsZip: { type: String },
    setupVideo: { type: String },

    salesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PrebuiltProject = mongoose.model("PrebuiltProject", prebuiltProjectSchema);

export default PrebuiltProject;
