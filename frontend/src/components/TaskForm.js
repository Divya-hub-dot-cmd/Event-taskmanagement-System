import React, { useState, useEffect } from "react";
import { createTask } from "../services/taskService";
import { createSubtask } from "../services/subtaskService"; // 👈 new
import { getUsers } from "../services/authService";

function TaskForm({ onCreated, mode = "task", parentId = null }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    priority: "",
    due_date: "",
    recurrence: "",
    assigned_to: [],
    checklist: [],
    attachments: [],
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleAssignee = (userId) => {
    setForm((prev) => {
      if (prev.assigned_to.includes(userId)) {
        return { ...prev, assigned_to: prev.assigned_to.filter((id) => id !== userId) };
      }
      return { ...prev, assigned_to: [...prev.assigned_to, userId] };
    });
  };

  const addChecklistItem = () => {
    setForm({ ...form, checklist: [...form.checklist, { item: "", completed: false }] });
  };

  const updateChecklistItem = (index, value) => {
    const updated = [...form.checklist];
    updated[index].item = value;
    setForm({ ...form, checklist: updated });
  };

  const removeChecklistItem = (index) => {
    const updated = form.checklist.filter((_, i) => i !== index);
    setForm({ ...form, checklist: updated });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
    }));
    setForm({ ...form, attachments: [...form.attachments, ...files] });
  };

  const removeAttachment = (index) => {
    const updated = form.attachments.filter((_, i) => i !== index);
    setForm({ ...form, attachments: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res;
      if (mode === "task") {
        res = await createTask(form);
      } else {
        res = await createSubtask(parentId, form);
      }

      if (onCreated) onCreated(res);

      setForm({
        title: "",
        description: "",
        category: "",
        type: "",
        priority: "",
        due_date: "",
        recurrence: "",
        assigned_to: [],
        checklist: [],
        attachments: [],
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {mode === "task" ? "Create New Task" : "Create Subtask"}
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder={mode === "task" ? "Task Title" : "Subtask Title"}
        value={form.title}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder={mode === "task" ? "Task Description" : "Subtask Description"}
        value={form.description}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
      />

      {/* Show category/type/recurrence ONLY for tasks */}
      {mode === "task" && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="pre_show">Pre Show</option>
              <option value="during_show">During Show</option>
              <option value="post_show">Post Show</option>
            </select>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="booth_setup">Booth Setup</option>
              <option value="inventory">Inventory</option>
              <option value="vendor">Vendor</option>
              <option value="marketing">Marketing</option>
              <option value="logistics">Logistics</option>
              <option value="finance">Finance</option>
            </select>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="recurrence"
            value={form.recurrence}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              Select Recurrence
            </option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </>
      )}

      {/* Assignees */}
      <div>
        <p className="font-semibold mb-2">Assign To:</p>
        <div className="flex flex-wrap gap-4">
          {users.map((user) => (
            <div
              key={user.userId}
              onClick={() => toggleAssignee(user.userId)}
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border ${
                form.assigned_to.includes(user.userId)
                  ? "bg-blue-100 border-blue-500"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}`}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span>{user.name}</span>
              <span className="text-sm text-gray-500">({user.role})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div>
        <p className="font-semibold mb-2">Checklist:</p>
        {form.checklist.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item.item}
              onChange={(e) => updateChecklistItem(index, e.target.value)}
              placeholder="Checklist item"
              className="flex-1 border px-3 py-2 rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeChecklistItem(index)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addChecklistItem}
          className="px-3 py-2 bg-green-500 text-white rounded-lg"
        >
          + Add Item
        </button>
      </div>

      {/* Attachments */}
      <div>
        <p className="font-semibold mb-2">Attachments:</p>
        <input type="file" multiple onChange={handleFileChange} />
        <div className="mt-2 flex flex-wrap gap-3">
          {form.attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
            >
              <span className="truncate">{file.fileName}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
      >
        {loading
          ? mode === "task"
            ? "Creating Task..."
            : "Creating Subtask..."
          : mode === "task"
          ? "Create Task"
          : "Create Subtask"}
      </button>
    </form>
  );
}

export default TaskForm;
