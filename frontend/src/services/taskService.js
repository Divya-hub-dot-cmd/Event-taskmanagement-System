// src/services/taskService.js
import api from "../api/api";

//  Create task
export const createTask = async (data) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/tasks", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

//  Assign users to an existing task
export const assignUsers = async (taskId, assignees) => {
  const res = await api.post(`/tasks/${taskId}/assign`, { assignees });
  return res.data;
};

//  Update task
export const updateTask = async (taskId, data) => {
  const res = await api.put(`/tasks/${taskId}`, data);
  return res.data;
};

//  Delete task
export const deleteTask = async (taskId) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};

//  Get all tasks (always returns array)
export const getAllTasks = async () => {
  const res = await api.get("/tasks");
  return res.data.tasks || [];  // 🔹 normalize to array
};

//  Get single task
export const getTaskById = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}`);
  return res.data;
};

//  Kanban view
export const getKanbanView = async () => {
  const res = await api.get("/tasks/dashboard/kanban");
  return res.data;
};

//  Update status
export const updateTaskStatus = async (taskId, status) => {
  const res = await api.put(`/tasks/${taskId}/status`, { status });
  return res.data;
};
