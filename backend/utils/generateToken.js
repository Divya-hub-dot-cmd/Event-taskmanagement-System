// utils/generateToken.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET 

const generateToken = (user) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
  return jwt.sign(
    { userId: user.userId, role: user.role },
    process.env.JWT_SECRET,
    
    { expiresIn: "5h" }
  );
};



module.exports = generateToken;
