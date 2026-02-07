import api from "../api/api";

export const getActivityLogs = async (taskId) => {
  const res = await api.get(`/activity/${taskId}`);
  return res.data;
};
