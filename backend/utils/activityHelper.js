const Counter = require("../models/Counter");
const ActivityLog = require("../models/ActivityLog");

async function logActivity({ taskId, userId, role, action, details }) {
  try {
    // 🔹 Generate unique logId
    const logCounter = await Counter.findOneAndUpdate(
      { id: "logId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const logId = `LOG${String(logCounter.seq).padStart(6, "0")}`;

    // 🔹 Save ActivityLog
    const log = await ActivityLog.create({
      logId,
      taskId,
      userId,
      role,
      action,
      details,
    });

    return log;
  } catch (err) {
    console.error("Failed to log activity:", err.message);
    return null;
  }
}

module.exports = { logActivity };
