import express from "express";
import protect from "../middlewares/authMiddleware.js";
import SavedJob from "../models/SavedJob.js";
import { getMySavedJobs, unsaveJob } from "../controllers/savedJobsController.js";

const router = express.Router();

// Save a job for the logged-in user
router.post("/:jobId", protect, async (req, res) => {
    console.log('user from middleware', req.user);
  try {
    const { jobId } = req.params;

    // check if already saved
    const alreadySaved = await SavedJob.findOne({
      jobSeeker: req.user._id,
      job: jobId,
    });

    if (alreadySaved) {
      return res.status(400).json({ message: "Job already saved" });
    }

    // create new saved job
    const savedJob = new SavedJob({
      jobSeeker: req.user._id, // comes from auth middleware
      job: jobId,
    });

    await savedJob.save();
    res.status(201).json({ message: "Job saved successfully", savedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/my", protect, getMySavedJobs);
router.delete("/:jobId", protect, unsaveJob);

export default router;
