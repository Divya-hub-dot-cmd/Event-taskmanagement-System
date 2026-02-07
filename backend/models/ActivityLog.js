const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    logId: { type: String, required: true, unique: true }, // auto-increment counter
    taskId: { type: String, ref: "Task", required: true },
    userId: { type: String, ref: "User", required: true }, // ✅ auto-increment userId
    role: { type: String, enum: ["staff", "vendor", "organizer", "admin"], required: true },
    action: { type: String, required: true },
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
