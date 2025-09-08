import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post("/register",upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 },
])
, register);
router.post("/login", login);
router.get("/me", protect, getMe);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

export default router;

