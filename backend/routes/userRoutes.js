import express from "express";
import { updateProfile, getResumeUrl, deleteResume, getPublicProfile } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

import {  } from "../controllers/userController.js";

const router = express.Router();

// Update profile (accepts Cloudinary URLs in body)
router.put("/profile", protect, updateProfile);

// Delete resume
router.delete("/resume", protect, deleteResume);

// View resume (signed link)
router.get("/:id/resume", protect, getResumeUrl);

// Public profile
router.get("/:id", getPublicProfile);

export default router;
