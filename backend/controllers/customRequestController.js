// controllers/customRequestController.js

import CustomRequest from "../models/CustomRequest.js";

// ==============================
// CREATE REQUEST  (POST)
// ==============================
export const createRequest = async (req, res) => {
  try {
    console.log("➡️ [API] Creating Request for User:", req.user._id);

    const { 
      title,
      description,
      budget,
      category,
      deadline,
      techStack,
      hosting,
      extraFeatures,
      attachments
    } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "Please fill in Title, Description, and Budget" });
    }

    const request = await CustomRequest.create({
      user: req.user._id,
      title,
      description,
      budget: String(budget),
      category: category || "Web Development",
      deadline: deadline || "Flexible",
      techStack: techStack || "Any",
      hosting: hosting || "No",
      extraFeatures: extraFeatures || "",
      attachments: attachments || ""
    });

    console.log("✅ [DB] Request Saved Successfully:", request._id);
    res.status(201).json(request);

  } catch (error) {
    console.error("❌ [SERVER ERROR]:", error);
    res.status(500).json({ message: "Server Error: Could not save request." });
  }
};

// ==============================
// GET USER REQUESTS  (GET)
// ==============================
export const getMyRequests = async (req, res) => {
  try {
    const requests = await CustomRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// GET ALL REQUESTS (ADMIN)
// ==============================
export const getAllRequestsAdmin = async (req, res) => {
  try {
    console.log("➡️ [API] Admin fetching all requests");

    const requests = await CustomRequest.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    console.log(`✅ [DB] Found ${requests.length} total requests`);
    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// UPDATE REQUEST (ADMIN)
// ==============================
export const updateRequest = async (req, res) => {
  try {
    const request = await CustomRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = req.body.status || request.status;
    request.adminQuote = req.body.adminQuote || request.adminQuote;

    if (req.body.adminQuote && request.status === "Pending") {
      request.status = "Quote Sent";
    }

    if (req.body.progress !== undefined) {
      request.progress = req.body.progress;
    }

    if (req.body.progress == 100) {
      request.status = "Completed";
    }

    const updatedRequest = await request.save();
    res.json(updatedRequest);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// UPLOAD FINAL PROJECT FILES (ADMIN)
// ==============================
export const uploadProjectFiles = async (req, res) => {
  try {
    const request = await CustomRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (req.files) {
      if (req.files.projectCode) {
        request.finalProjectCode = req.files.projectCode[0].path;
      }
      if (req.files.video) {
        request.finalVideo = req.files.video[0].path;
      }
      if (req.files.assets) {
        request.finalAssets = req.files.assets[0].path;
      }

      request.status = "Completed";
      request.progress = 100;

      await request.save();

      return res.json({
        message: "Files Uploaded Successfully",
        code: request.finalProjectCode,
        video: request.finalVideo,
        assets: request.finalAssets
      });
    }

    return res.status(400).json({ message: "No files uploaded" });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
};
