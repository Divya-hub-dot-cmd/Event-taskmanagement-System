import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createSubtask,
  getSubtasksByTask,
  updateSubtaskStatus,
  updateSubtask,
} from "../../services/subtaskService";

import { getUsers } from "../../services/authService";
import { getTaskById } from "../../services/taskService";

import {
  addComment,
  getCommentsByTask,
  deleteComment,
} from "../../services/commentService";

import { getActivityLogs } from "../../services/activityService";

import SubtaskList from "../../components/Subtask/SubTaskList";
import SubtaskForm from "../../components/Subtask/SubtaskForm";
import CommentForm from "../../components/Task/CommentForm";
import CommentList from "../../components/Task/CommentList";
import ActivityTimeline from "../../components/Task/ActivityTimeLine";

/* -------- Safe user loader -------- */
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const TaskDetails = () => {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);

  const currentUser = getCurrentUser();

  /* -------- FETCH TASK -------- */
  const fetchTask = useCallback(async () => {
    try {
      const res = await getTaskById(taskId);
      if (res?.task) setTask(res.task);
    } catch {
      toast.error("Failed to load task");
    }
  }, [taskId]);

  /* -------- FETCH SUBTASKS -------- */
  const fetchSubtasks = useCallback(async () => {
    const data = await getSubtasksByTask(taskId);
    setSubtasks(Array.isArray(data) ? data : []);
  }, [taskId]);

  /* -------- FETCH USERS -------- */
  const fetchUsers = useCallback(async () => {
    const data = await getUsers();
    setUsers(Array.isArray(data) ? data : []);
  }, []);

  /* -------- FETCH COMMENTS -------- */
  const fetchComments = useCallback(async () => {
    const data = await getCommentsByTask(taskId);
    setComments(Array.isArray(data) ? data : []);
  }, [taskId]);

  /* -------- FETCH ACTIVITIES -------- */
  const fetchActivities = useCallback(async () => {
    const data = await getActivityLogs(taskId);
    setActivities(Array.isArray(data) ? data : []);
  }, [taskId]);

  /* -------- INITIAL LOAD -------- */
  useEffect(() => {
    fetchTask();
    fetchSubtasks();
    fetchUsers();
    fetchComments();
    fetchActivities();
  }, [
    fetchTask,
    fetchSubtasks,
    fetchUsers,
    fetchComments,
    fetchActivities,
  ]);

  /* -------- HANDLERS -------- */

  const handleStatusChange = async (subtaskId, status, comment) => {
  try {
    await updateSubtaskStatus(subtaskId, { status, comment });
    fetchSubtasks();
    fetchComments();
    fetchActivities();
  } catch (err) {
    toast.error("Failed to update progress");
  }
};

  const handleUpdate = async (subtaskId, data) => {
    try {
      await updateSubtask(subtaskId, data);
      toast.success("Subtask updated");
      fetchSubtasks();
      fetchActivities();
    } catch {
      toast.error("Failed to update subtask");
    }
  };

  const handleAddComment = async (formData) => {
    try {
      await addComment(taskId, formData);
      toast.success("Comment added");
      fetchComments();
      fetchActivities();
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteComment(commentId);
      toast.success("Comment deleted");
      fetchComments();
      fetchActivities();
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  /* -------- GUARD -------- */
  if (!task) {
    return (
      <div className="p-6 bg-white rounded shadow text-gray-500">
        Loading task details…
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold">{task.title}</h2>

      {/* -------- SUBTASKS -------- */}
      <SubtaskList
        subtasks={subtasks}
        users={users}
        currentUser={currentUser}
        onStatusChange={handleStatusChange}
        onAssignChange={handleUpdate}
      />

      <SubtaskForm
        taskId={taskId}
        users={users}
        currentUser={currentUser}
        onCreate={async (data) => {
          try {
            await createSubtask({ taskId, ...data });
            toast.success("Subtask created");
            fetchSubtasks();
            fetchActivities();
          } catch {
            toast.error("Failed to create subtask");
          }
        }}
      />

      {/* -------- COMMENTS -------- */}
      <CommentForm taskId={taskId} onSubmit={handleAddComment} />

      <CommentList
        comments={comments}
        users={users}
        currentUser={currentUser}
        onDelete={handleDeleteComment}
      />

      {/* -------- ACTIVITY -------- */}
      {activities.length > 0 && (
  <ActivityTimeline logs={activities} />
)}

    </div>
  );
};

export default TaskDetails;
