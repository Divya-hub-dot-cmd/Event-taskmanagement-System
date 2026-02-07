const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId:{type:String,required:true,unique:true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type:String,required:true},
  role: { type: String, enum: ["organizer","admin", "staff", "vendor", "contractor"], required: true },
  avatar_url: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
