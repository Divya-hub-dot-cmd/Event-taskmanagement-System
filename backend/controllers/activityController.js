const ActivityLog = require("../models/ActivityLog");

const getActivityLogs = async (req, res) => {
  try {
    const { taskId } = req.params;

    const allowedRoles = ["admin", "organizer", "contractor", "vendor"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await ActivityLog.find({ taskId })
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    res.status(500).json({ message: "Failed to fetch activity logs" });
  }
};

module.exports = {
  getActivityLogs
};
