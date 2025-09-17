import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, companyName, companyDescription, avatarUrl, resumeUrl, companyLogoUrl } = req.body;
    const user = req.user; // loaded from protect middleware

    if (name) user.name = name;
    if (avatarUrl) user.avatar = avatarUrl;
    if (resumeUrl) user.resume = resumeUrl;
    if (companyLogoUrl && user.role === "employer") {
      user.companyLogo = companyLogoUrl;
    }

    if (user.role === "employer") {
      if (companyName) user.companyName = companyName;
      if (companyDescription) user.companyDescription = companyDescription;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      companyName: user.companyName,
      companyDescription: user.companyDescription,
      companyLogo: user.companyLogo,
      resume: user.resume || "",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

export const getResumeUrl = async (req, res) => {
  try {
    console.log("⛳ Resume route hit");
    console.log("Requested ID:", req.params.id);

    const user = await User.findById(req.params.id);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resume) {
      console.log("❌ Resume URL missing for user:", user._id);
      return res.status(404).json({ message: "Resume not found" });
    }

    console.log("✅ Resume found:", user.resume);

    const resumeUrl = user.resume;
    const parts = resumeUrl.split("/");
    const fileNameWithExtension = parts.pop();
    const publicId = `resumes/${fileNameWithExtension.replace(/\.[^/.]+$/, "")}`;

    const signedUrl = cloudinary.v2.url(publicId, {
      resource_type: "raw",
      type: "authenticated",
      sign_url: true,
      secure: true,
    });

    res.json({ resumeUrl: signedUrl });
  } catch (err) {
    console.error("🔥 Error generating resume URL:", err);
    res.status(500).json({ message: "Failed to generate resume URL" });
  }
};


// Delete resume (just clear Cloudinary URL)
export const deleteResume = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "jobseeker")
      return res.status(403).json({ message: "Only job seekers can delete resume" });

    user.resume = "";
    await user.save();

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get public profile
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
