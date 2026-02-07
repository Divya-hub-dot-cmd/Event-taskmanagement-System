import api from "../api/api";

// ---------------- CREATE ----------------
export const createSubtask = async ({ taskId, title, assigned_to }) => {
  console.log(" createSubtask called with:", { taskId, title, assigned_to });
  console.log(" Using baseURL:", api.defaults.baseURL);

  const res = await api.post(`/subtasks/${taskId}`, { title, assigned_to });
  console.log(" createSubtask response:", res.data);
  return res.data;
};

// ---------------- GET BY TASK ----------------
export const getSubtasksByTask = async (taskId) => {
  console.log(" getSubtasksByTask called with:", taskId);
  console.log(" Using baseURL:", api.defaults.baseURL);

  const res = await api.get(`/subtasks/task/${taskId}`);
  console.log(" getSubtasksByTask response:", res.data);
  return res.data;
};
export const updateSubtask = (subtaskId, data) =>
  api.put(`/subtasks/${subtaskId}`, data);


// ---------------- UPDATE STATUS ----------------
export const updateSubtaskStatus = async (subtaskId, data) => {
  const res = await api.put(`/subtasks/${subtaskId}/status`, data);
  return res.data;
};


// ---------------- ASSIGN ----------------
export const assignSubtask = async (subtaskId, { assignees }) => {
  console.log(" assignSubtask called with:", { subtaskId, assignees });
  console.log(" Using baseURL:", api.defaults.baseURL);

  const res = await api.put(`/subtasks/${subtaskId}/assign`, { assignees });
  console.log(" assignSubtask response:", res.data);
  return res.data;
};

// ---------------- DELETE ----------------
export const deleteSubtask = async (subtaskId) => {
  console.log(" deleteSubtask called with:", subtaskId);
  console.log(" Using baseURL:", api.defaults.baseURL);

  const res = await api.delete(`/subtasks/${subtaskId}`);
  console.log(" deleteSubtask response:", res.data);
  return res.data;
};
