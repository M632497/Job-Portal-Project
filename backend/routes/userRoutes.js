import express from 'express';
import { updateProfile, deleteResume, getPublicProfile } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Update profile (with files)
router.put(
    "/profile",
    protect,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'companyLogo', maxCount: 1 }
    ]),
    updateProfile
);

// Delete resume
router.delete("/resume", protect, deleteResume);

// Public profile
router.get("/:id", getPublicProfile);

export default router;
