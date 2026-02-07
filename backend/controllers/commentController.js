const Comment = require("../models/Comment");
const ActivityLog = require("../models/ActivityLog");
const Counter = require("../models/Counter");
const { logActivity } = require("../utils/activityHelper");


const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { comment, mentions } = req.body;

    // Handle file upload if exists
    let files = [];
    if (req.files) {
      files = req.files.map(file => file.path);
    }

    // 🔹 Generate auto-increment commentId
    const counter = await Counter.findOneAndUpdate(
      { id: "commentId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const commentId = `CMT${String(counter.seq).padStart(6, "0")}`;

    // 🔹 Save Comment
    const newComment = await Comment.create({
      commentId,
      taskId,
      userId: req.user.userId,  // ✅ from token
      role: req.user.role,
      comment,
      mentions: mentions || [],
      attachments: files,
    });

    // 🔹 Save Activity Log
    await logActivity({
      taskId,
      userId: req.user.userId,
      role: req.user.role,
      action: "comment_added",
      details: `Comment: ${comment}`,
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;

    const existing = await Comment.findOne({ commentId });
    if (!existing) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (existing.userId !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    existing.comment = comment;
    await existing.save();

    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: "Failed to update comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findOne({ commentId });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      comment.userId !== req.user.userId &&
      !["organizer", "admin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Comment.deleteOne({ commentId });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};




// Get all comments for a task
const getCommentsByTask = async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {addComment, getCommentsByTask,

  getCommentsByTask,
  updateComment,
  deleteComment,
};

