// src/pages/EditTask.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask } from "../services/taskService";

function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    priority: "Medium",
    due_date: "",
  });

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getTaskById(taskId);

        if (res.task) {
          setFormData({
            title: res.task.title || "",
            description: res.task.description || "",
            category: res.task.category || "",
            type: res.task.type || "",
            priority: res.task.priority || "Medium",
            due_date: res.task.due_date
              ? res.task.due_date.split("T")[0]
              : "",
          });
        }
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Task not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updateTask(taskId, formData);
      alert("Task updated successfully!");
      navigate("/tasks", { replace: true });
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border p-2 rounded"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            className="w-full border p-2 rounded"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            name="category"
            className="w-full border p-2 rounded"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block font-medium">Type</label>
          <input
            type="text"
            name="type"
            className="w-full border p-2 rounded"
            value={formData.type}
            onChange={handleChange}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block font-medium">Priority</label>
          <select
            name="priority"
            className="w-full border p-2 rounded"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block font-medium">Due Date</label>
          <input
            type="date"
            name="due_date"
            className="w-full border p-2 rounded"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTask;
