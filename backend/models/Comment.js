const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    commentId: { type: String, required: true, unique: true }, // auto-increment counter
    taskId: { type: String, ref: "Task", required: true },
    userId: { type: String, ref: "User", required: true }, // ✅ use auto-incremented userId
    role: { type: String, enum: ["staff", "vendor", "organizer", "admin"], required: true },
    comment: { type: String, required: true },
    mentions: [{ type: String, ref: "User" }], // array of userIds
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
