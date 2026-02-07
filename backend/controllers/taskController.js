// controllers/taskController.js
const Task = require("../models/Task");
const Subtask = require("../models/Subtask");
const TaskAssignee = require("../models/TaskAssignee");
const Counter = require("../models/Counter");
const { logActivity } = require("../utils/activityHelper");
const User = require("../models/User");

// ---------------- HELPERS ----------------
function normalizeStatus(raw) {
  if (!raw) return "";
  const s = String(raw).toLowerCase().replace(/_/g, " ").trim();
  if (s === "pending") return "not started";
  if (s === "not started") return "not started";
  if (s.includes("progress")) return "in progress";
  if (s === "completed") return "completed";
  if (s === "delayed") return "delayed";
  return s;
}

function calculateProgressFromChecklist(checklist) {
  if (!Array.isArray(checklist) || checklist.length === 0) return 0;
  const done = checklist.filter((c) => !!c.completed).length;
  return Math.round((done / checklist.length) * 100);
}

async function calculateTaskProgress(taskId) {
  const subtasks = await Subtask.find({ taskId });
  if (subtasks.length > 0) {
    const done = subtasks.filter((s) => normalizeStatus(s.status) === "completed").length;
    return Math.round((done / subtasks.length) * 100);
  }
  const task = await Task.findOne({ taskId });
  if (!task || !Array.isArray(task.checklist)) return 0;
  return calculateProgressFromChecklist(task.checklist);
}

// ---------------- CREATE ----------------
const createTask = async (req, res, next) => {
  try {
    if (!["organizer", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    let {
      title,
      description,
      category,
      type,
      priority,
      due_date,
      assigned_to = [],
      checklist = [],
      recurrence = {},
      attachments = [],
    } = req.body;

    const taskCounter = await Counter.findOneAndUpdate(
      { id: "taskId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const taskId = `TASK${String(taskCounter.seq).padStart(6, "0")}`;

    const progress = calculateProgressFromChecklist(checklist);

    const task = await Task.create({
      taskId,
      title,
      description,
      category,
      type,
      priority,
      due_date,
      recurrence,
      created_by: req.user.userId,
      assigned_to,
      checklist,
      attachments,
      progress,
    });

    await logActivity(taskId, req.user.userId, req.user.role, "task_created", { title });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    next(err);
  }
};

// ---------------- GET ALL ----------------
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

// ---------------- GET DETAILS ----------------

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findOne({ taskId }).lean();
    if (!task) return res.status(404).json({ message: "Task not found" });

    // fetch creator
    let creator = null;
    if (task.created_by) {
      creator = await User.findOne({ userId: task.created_by }).select("userId name email role");
    }

    // fetch assignees
    const assigneesRaw = await TaskAssignee.find({ taskId });
    const assigneeIds = assigneesRaw.map((a) => a.assignee_id);
    const users = await User.find({ userId: { $in: assigneeIds } }).select("userId name email role");

    const assignees = assigneesRaw.map((a) => {
      const user = users.find((u) => u.userId === a.assignee_id);
      return {
        ...a.toObject(),
        user: user
          ? { userId: user.userId, name: user.name, email: user.email, role: user.role }
          : null,
      };
    });

    // fetch subtasks
    const subtasks = await Subtask.find({ taskId });

    res.json({
      task: {
        ...task,
        created_by: creator,
        checklist: task.checklist || [],
        attachments: task.attachments || [],
      },
      assignees,
      subtasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- UPDATE ----------------
const updateTask = async (req, res, next) => {
  try {
    if (!["organizer", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { taskId } = req.params;
    let updates = { ...req.body };

    if (updates.checklist) {
      updates.progress = calculateProgressFromChecklist(updates.checklist);
    } else {
      updates.progress = await calculateTaskProgress(taskId);
    }

    if (updates.progress === 0) updates.status = "not started";
    else if (updates.progress < 100) updates.status = "in progress";
    else updates.status = "completed";

    const updatedTask = await Task.findOneAndUpdate({ taskId }, updates, { new: true });
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    await logActivity(updatedTask.taskId, req.user.userId, req.user.role, "task_updated", {
      updatedFields: updates,
    });

    res.json({ message: "Task updated", updatedTask });
  } catch (err) {
    next(err);
  }
};

// ---------------- STATUS ----------------
const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const normStatus = normalizeStatus(req.body.status);

    if (["staff", "vendor"].includes(req.user.role)) {
      const assigned = await TaskAssignee.findOne({ taskId, assignee_id: req.user.userId });
      if (!assigned) return res.status(403).json({ message: "Not assigned to this task." });
    } else if (!["organizer", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const task = await Task.findOneAndUpdate({ taskId }, { status: normStatus }, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (normStatus === "completed") {
      await TaskAssignee.updateMany({ taskId }, { progress: "completed" });
      task.progress = 100;
      await task.save({ validateBeforeSave: false });
    }

    await logActivity(task.taskId, req.user.userId, req.user.role, "task_status_updated", {
      newStatus: normStatus,
    });

    res.json({ message: "Task status updated", task });
  } catch (err) {
    next(err);
  }
};

// ---------------- DELETE ----------------
const deleteTask = async (req, res, next) => {
  try {
    if (!["organizer", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { taskId } = req.params;
    const deletedTask = await Task.findOneAndDelete({ taskId });
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });

    await Subtask.deleteMany({ taskId });
    await TaskAssignee.deleteMany({ taskId });

    await logActivity(taskId, req.user.userId, req.user.role, "task_deleted", {
      title: deletedTask.title,
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

// ---------------- DASHBOARD ----------------
const getKanbanView = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    const grouped = { notStarted: [], inProgress: [], completed: [], delayed: [] };
    tasks.forEach((t) => {
      const s = normalizeStatus(t.status);
      if (s === "not started") grouped.notStarted.push(t);
      else if (s === "in progress") grouped.inProgress.push(t);
      else if (s === "completed") grouped.completed.push(t);
      else if (s === "delayed") grouped.delayed.push(t);
    });
    res.json({ kanban: grouped });
  } catch (err) {
    next(err);
  }
};

const getTasksByDate = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ due_date: 1 });
    res.json({ calendar: tasks });
  } catch (err) {
    next(err);
  }
};

const getFilteredTasks = async (req, res, next) => {
  try {
    const { priority, category, status } = req.query;
    const filter = {};
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const tasks = await Task.find(filter);
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  getTaskById,
  updateTaskStatus,
  deleteTask,
  getKanbanView,
  getTasksByDate,
  getFilteredTasks,
};
