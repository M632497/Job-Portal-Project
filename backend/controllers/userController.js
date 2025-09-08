import fs from 'fs';
import path from 'path';
import User from '../models/User.js';

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, companyName, companyDescription } = req.body;
    const user = req.user; // already a User doc from protect

    if (name) user.name = name;

    if (req.files?.avatar) {
      user.avatar = `${req.protocol}://${req.get("host")}/uploads/${req.files.avatar[0].filename}`;
    }
    if (req.files?.resume) {
      user.resume = `${req.protocol}://${req.get("host")}/uploads/${req.files.resume[0].filename}`;
    }
    if (req.files?.companyLogo && user.role === "employer") {
      user.companyLogo = `${req.protocol}://${req.get("host")}/uploads/${req.files.companyLogo[0].filename}`;
    }

    console.log("Files received:", req.files);
console.log("Body received:", req.body);


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
    console.error("Update profile error:", err.message);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const user = req.user; // already loaded
    if (user.role !== "jobseeker")
      return res.status(403).json({ message: "Only job seekers can delete resume" });

    if (user.resume) {
      const fileName = user.resume.split("/uploads/")[1];
      if (fileName) {
        const filePath = path.join(process.cwd(), "uploads", fileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      user.resume = "";
      await user.save();
    }

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
