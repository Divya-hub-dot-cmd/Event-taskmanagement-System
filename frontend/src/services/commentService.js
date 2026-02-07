import api from "../api/api";

export const addComment = async (taskId, formData) => {
  const res = await api.post(`/comments/${taskId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const deleteComment = async (commentId) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};


export const getCommentsByTask = async (taskId) => {
  const res = await api.get(`/comments/${taskId}`);
  return res.data;
};
