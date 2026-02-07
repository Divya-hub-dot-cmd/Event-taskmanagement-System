const Subtask = require("../models/Subtask");
const Task = require("../models/Task");
const TaskAssignee = require("../models/TaskAssignee");
const User = require("../models/User");
const Counter = require("../models/Counter");
const Comment = require("../models/Comment");
const { logActivity } = require("../utils/activityHelper");

// Roles allowed to update status
const STATUS_UPDATERS = ["staff", "vendor", "contractor"];

const STATUS_FLOW = {
  pending: "in_progress",
  in_progress: "completed",
};

// ---------------- CREATE SUBTASK ----------------
const createSubtask = async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({ message: "Only organizers can create subtasks" });
    }

    const { taskId } = req.params;
    const { title, assigned_to = [] } = req.body;

    if (!taskId || !title) {
      return res.status(400).json({ message: "Task ID and title are required" });
    }

    const counter = await Counter.findOneAndUpdate(
      { id: "subtaskId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const subtaskId = `SUBTASK${String(counter.seq).padStart(6, "0")}`;

    const subtask = await Subtask.create({
      subtaskId,
      taskId,
      title,
      assigned_to,
      status: "pending",
    });

    await logActivity({
      taskId,
      userId: req.user.userId,
      role: req.user.role,
      action: "subtask_created",
      details: title,
    });

    res.status(201).json(subtask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE SUBTASK (EDIT) ----------------
const updateSubtask = async (req, res) => {
  try {
    if (!["organizer", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { subtaskId } = req.params;
    const { title, assigned_to } = req.body;

    const subtask = await Subtask.findOne({ subtaskId });
    if (!subtask) return res.status(404).json({ message: "Not found" });

    if (title) subtask.title = title;
    if (Array.isArray(assigned_to)) subtask.assigned_to = assigned_to;

    await subtask.save();

    res.json(subtask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE MY SUBTASK STATUS ----------------
const updateMySubtaskStatus = async (req, res) => {
  try {
    const { subtaskId } = req.params;
    const { status } = req.body;
    const { userId, role } = req.user;

    if (!STATUS_UPDATERS.includes(role)) {
      return res.status(403).json({ message: "Role cannot update status" });
    }

    const subtask = await Subtask.findOne({ subtaskId });
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });

    if (!subtask.assigned_to.includes(userId)) {
      return res.status(403).json({ message: "Not assigned to this subtask" });
    }

    const allowedNext = STATUS_FLOW[subtask.status];
    if (allowedNext !== status) {
      return res.status(400).json({
        message: `Invalid status change: ${subtask.status} → ${status}`,
      });
    }

    subtask.status = status;
    await subtask.save();

    // 🔹 Auto-comment
    const counter = await Counter.findOneAndUpdate(
      { id: "commentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    await Comment.create({
      commentId: `CMT${String(counter.seq).padStart(6, "0")}`,
      taskId: subtask.taskId,
      userId,
      role,
      comment: `Status updated to ${status.replace("_", " ")}`,
    });

    // 🔹 Activity log
    await logActivity({
      taskId: subtask.taskId,
      userId,
      role,
      action: "subtask_status_updated",
      details: `${subtask.title} → ${status}`,
    });

    res.json(subtask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET SUBTASKS ----------------
const getSubtasksByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const subtasks = await Subtask.find({ taskId });
    res.json(subtasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE SUBTASK ----------------
const deleteSubtask = async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({ message: "Only organizers can delete" });
    }

    const { subtaskId } = req.params;
    await Subtask.findOneAndDelete({ subtaskId });

    res.json({ message: "Subtask deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSubtask,
  updateSubtask,
  updateMySubtaskStatus,
  getSubtasksByTask,
  deleteSubtask,
};
