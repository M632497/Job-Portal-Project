import SavedJob from "../models/SavedJob.js";


export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Create a new saved job
    const savedJob = new SavedJob({
      jobSeeker: req.user._id,   // logged-in user
      job: jobId,                // job from params
    });

    await savedJob.save();

    res.status(201).json({ message: "Job saved successfully", savedJob });
  } catch (error) {
    res.status(400).json({ message: "Failed to save job", error: error.message });
  }
};


export const unsaveJob = async (req, res) => {
    try {
        await SavedJob.findOneAndDelete({ job: req.params.jobId, jobSeeker: req.user._id });
        res.json({ message: "Job removed from saved list" });

    } catch (err) {
        return res.status(500).json({ message: "Failed to remove saved job", error: err.message });
    }
};

export const getMySavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({ jobSeeker: req.user._id }).populate({ 
            path: "job",
            populate: {
                path: "company",
                select: "name companyName companyLogo",
            },
        });
        res.json(savedJobs);
        
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch saved job", error: err.message });
    }
};