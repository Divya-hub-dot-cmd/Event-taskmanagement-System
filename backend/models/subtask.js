const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  subtaskId: { type: String, required: true, unique: true },
  taskId: { type: String, required: true },
  title: { type: String, required: true },

  status: {
  type: String,
  enum: ["pending", "in_progress", "completed"],
  default: "pending",
},

  assigned_to: [{ type: String }]
});

module.exports =
  mongoose.models.Subtask || mongoose.model("Subtask", subtaskSchema);
