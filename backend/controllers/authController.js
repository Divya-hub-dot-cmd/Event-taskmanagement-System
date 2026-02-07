const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const Counter = require("../models/Counter");
const jwt = require("jsonwebtoken");


//  Signup (No token here)

// ---------------- SIGNUP ----------------
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Received signup body:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // 🔥 FIXED COUNTER LOGIC
    const userCounter = await Counter.findOneAndUpdate(
      { id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const userId = `USER${String(userCounter.seq).padStart(6, "0")}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId,
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user.userId,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};


// ---------------- LOGIN ----------------
// ---------------- LOGIN ----------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // log incoming body
    console.log(" Login request body:", req.body);

    if (!email || !password) {
      console.warn(" Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(` No user found with email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials - user not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(" Wrong password for user:", email);
      return res.status(400).json({ message: "Invalid credentials - password wrong" });
    }

    // generate JWT
    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(" Login successful for:", email);

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(" Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "userId name email role");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

module.exports = { signup, login,getUsers };

