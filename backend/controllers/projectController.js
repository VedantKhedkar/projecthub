// controllers/projectController.js

import asyncHandler from "express-async-handler";
import PrebuiltProject from "../models/PrebuiltProject.js";

// =============================================
// GET ALL PROJECTS
// GET /api/projects
// =============================================
export const getProjects = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i", // case insensitive
        },
      }
    : {};

  const projects = await PrebuiltProject.find({ ...keyword });
  res.json(projects);
});

// =============================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// =============================================
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await PrebuiltProject.findById(req.params.id);

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});

// =============================================
// CREATE PROJECT (ADMIN ONLY)
// POST /api/projects
// =============================================
export const createProject = asyncHandler(async (req, res) => {
  const { title, category, price, description, techStack, demoLink, image } = req.body;

  const project = new PrebuiltProject({
    title,
    category,
    price,
    description,
    techStack,    // Array: ["React", "Node"]
    demoLink,
    image,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});
