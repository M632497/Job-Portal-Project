import User from '../models/User.js';
import jwt from 'jsonwebtoken';

//generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

//registers new User
// register new User
export const register = async (req, res) => {
  try {
    const { name, email, password, role, companyName, companyDescription } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Handle file uploads
    let avatar = "";
    let resume = "";
    let companyLogo = "";

    if (req.files?.avatar) {
      avatar = `${req.protocol}://${req.get("host")}/uploads/${req.files.avatar[0].filename}`;
    }
    if (req.files?.resume) {
      resume = `${req.protocol}://${req.get("host")}/uploads/${req.files.resume[0].filename}`;
    }
    if (req.files?.companyLogo && role === "employer") {
      companyLogo = `${req.protocol}://${req.get("host")}/uploads/${req.files.companyLogo[0].filename}`;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
      resume,
      companyLogo,
      companyName: role === "employer" ? companyName : "",
      companyDescription: role === "employer" ? companyDescription : "",
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        companyLogo: user.companyLogo || "",
        resume: user.resume || "",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
             _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user._id),
            companyName: user.companyName || '',
            companyDescription: user.companyDescription || '',
            companyLogo: user.companyLogo || '',
            resume: user.resume || '',
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//get logged-in User
export const getMe = async (req, res) => {
    res.json(req.user);
};