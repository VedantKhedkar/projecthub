// routes/projectRoutes.js

import express from "express";
import {
  getProjects,
  getProjectById,
  createProject
} from "../controllers/projectController.js";

const router = express.Router();

// Public routes for now (optional: add protect/admin later)
router.route("/")
  .get(getProjects)
  .post(createProject);

router.route("/:id")
  .get(getProjectById);

export default router;
