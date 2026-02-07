const express = require("express");
const router = express.Router();
const protected = require("../middlewares/protected");
const upload = require("../middlewares/upload");
const commentController = require("../controllers/commentController");

// ADD COMMENT
router.post(
  "/:taskId",
  protected,
  upload.array("files", 5),
  commentController.addComment
);

// GET COMMENTS BY TASK
router.get("/:taskId", protected, commentController.getCommentsByTask);

// UPDATE COMMENT
router.put("/:commentId", protected, commentController.updateComment);

// DELETE COMMENT
router.delete("/:commentId", protected, commentController.deleteComment);

module.exports = router;
