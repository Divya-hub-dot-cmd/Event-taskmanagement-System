const express = require("express");
const router = express.Router();

const protected = require("../middlewares/protected");
const { updateProgress } = require("../controllers/assigneeController");

// Contractor / Vendor / Staff update THEIR work status
router.patch(
  "/:assigneeId/progress",
  protected,
  updateProgress
);

module.exports = router;
