const express = require("express");
const router = express.Router();

const protected = require("../middlewares/protected");
const activityController = require("../controllers/activityController");

router.get(
  "/:taskId",
  protected,
  activityController.getActivityLogs
);

module.exports = router;
