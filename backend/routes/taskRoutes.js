// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  updateTask,
  getTaskById,
  updateTaskStatus,
  deleteTask,
  getKanbanView,
  getTasksByDate,
  getFilteredTasks,
} = require("../controllers/taskController");
const { assignUsers, updateProgress } = require("../controllers/assigneeController");
const protected = require("../middlewares/protected");

// 🔹 Dashboard views
router.get("/dashboard/kanban", protected, getKanbanView);
router.get("/dashboard/calendar", protected, getTasksByDate);
router.get("/dashboard/list", protected, getFilteredTasks);

// 🔹 Task CRUD
router.post("/", protected, createTask);
router.get("/", protected, getAllTasks);

router.put("/:taskId", protected, updateTask);
router.delete("/:taskId", protected, deleteTask);

// 🔹 Task-specific
router.put("/:taskId/status", protected, updateTaskStatus);
router.post("/:taskId/assign", protected, assignUsers);
router.put("/assignee/:assigneeId/progress", protected, updateProgress);

// 🔹 Must always be LAST
router.get("/:taskId", protected, getTaskById);

module.exports = router;
