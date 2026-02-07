const mongoose = require("mongoose");
const taskAssigneeSchema = new mongoose.Schema({
  taskId: { type: String, ref: "Task", required: true },  
  assignee_id: { type: String, ref: "User", required: true },
  role: { type: String, enum: ["staff", "vendor", "contractor"], required: true },
  progress: { type:String, enum: ["pending","in_progress","completed","delayed"], default:"pending"}
}, { timestamps: true });
module.exports = mongoose.model("TaskAssignee", taskAssigneeSchema);