// controllers/assigneeController.js
const Task = require("../models/Task");
const TaskAssignee = require("../models/TaskAssignee");

// ---------------- ASSIGN USERS ----------------
const assignUsers = async (req, res) => {
  try {
    const { assignees } = req.body; // [{ assignee_id, role }]
    const { taskId } = req.params;

    if (!assignees || !Array.isArray(assignees)) {
      return res.status(400).json({ error: "Assignees array is required" });
    }

    const task = await Task.findOne({ taskId });
    if (!task) return res.status(404).json({ error: "Task not found" });

    const createdAssignees = [];
    const skipped = [];

    for (const a of assignees) {
      const exists = await TaskAssignee.findOne({ taskId, assignee_id: a.assignee_id });
      if (exists) {
        skipped.push(a.assignee_id);
        continue;
      }

      const taskAssignee = new TaskAssignee({
        taskId,
        assignee_id: a.assignee_id,
        role: a.role,
        progress: "not started",
      });

      await taskAssignee.save();
      createdAssignees.push(taskAssignee);

      if (!task.assigned_to.includes(a.assignee_id)) {
        task.assigned_to.push(a.assignee_id);
      }
    }

    await task.save();

    res.json({
      message: "Users assigned successfully",
      assigned: createdAssignees,
      skipped: skipped.length ? `Skipped already assigned: ${skipped.join(", ")}` : null,
      updatedTask: task,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- UPDATE PROGRESS ----------------
// ---------------- UPDATE MY TASK PROGRESS ----------------
const updateProgress = async (req, res) => {
  try {
    const { assigneeId } = req.params;
    const { progress } = req.body;
    const { userId, role } = req.user;

    // Allowed roles
    if (!["staff", "vendor", "contractor"].includes(role)) {
      return res.status(403).json({ error: "Role cannot update progress" });
    }

    const ALLOWED_PROGRESS = ["not started", "in progress", "completed", "delayed"];
    if (!ALLOWED_PROGRESS.includes(progress)) {
      return res.status(400).json({ error: "Invalid progress status" });
    }

    // Find assignment
    const assignee = await TaskAssignee.findById(assigneeId);
    if (!assignee) {
      return res.status(404).json({ error: "Task assignment not found" });
    }

    // 🔥 KEY CHECK: only assigned user can update
    if (String(assignee.assignee_id) !== String(userId)) {
      return res.status(403).json({ error: "You can update only your own work status" });
    }

    assignee.progress = progress;
    assignee.last_updated = Date.now();
    await assignee.save();

    res.json({
      message: "Work status updated successfully",
      assignee,
    });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { assignUsers, updateProgress };
