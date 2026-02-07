const express = require("express");
const router = express.Router();

const protected = require("../middlewares/protected");

const {
  createSubtask,
  assignSubtask,
  updateSubtask,
  updateMySubtaskStatus,
  getSubtasksByTask,
  deleteSubtask,
} = require("../controllers/subTaskController");

// ---------------- CREATE ----------------
router.post("/:taskId", protected, createSubtask);

// ---------------- GET ----------------
router.get("/task/:taskId", protected, getSubtasksByTask);

// ---------------- EDIT (ORG / ADMIN) ----------------
router.put("/:subtaskId", protected, updateSubtask);

// ---------------- STATUS UPDATE (STAFF / VENDOR) ✅ FIX ----------------
router.put(
  "/:subtaskId/status",
  protected,
  updateMySubtaskStatus
);

// ---------------- DELETE ----------------
router.delete("/:subtaskId", protected, deleteSubtask);

module.exports = router;
