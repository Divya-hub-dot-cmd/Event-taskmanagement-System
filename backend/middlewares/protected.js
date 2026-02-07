const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protected = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userId: decoded.userId }).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      _id: user._id,
      userId: user.userId,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = protected;
