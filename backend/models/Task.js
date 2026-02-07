const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["pre_show", "during_show", "post_show"],
      required: true,
    },
    type: {
      type: String,
      enum: ["booth_setup", "inventory", "vendor", "marketing", "logistics", "finance"],
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    due_date: { type: Date },

    status: {
      type: String,
      enum: ["not started", "in progress", "completed", "delayed"],
      default: "not started",
    },

    progress: { type: Number, default: 0 },
    recurrence: {
  type: Object,
  default: {}
},


    checklist: [
      {
        item: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    attachments: [{ fileName: String, fileUrl: String }],

    assigned_to: [{ type: String, ref: "User" }],
    created_by: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);
