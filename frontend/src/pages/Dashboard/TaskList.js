import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllTasks, deleteTask } from "../../services/taskService";

const TaskList = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- LOAD TASKS ----------------
  const loadTasks = async () => {
    try {
      const res = await getAllTasks();
      const taskData = res.tasks || res || [];
      setAllTasks(taskData);
      setTasks(taskData);
    } catch (err) {
      console.error("Error loading tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ---------------- DELETE TASK ----------------
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(taskId);
      const updated = allTasks.filter((t) => t.taskId !== taskId);
      setAllTasks(updated);
      setTasks(updated);
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  // ---------------- SEARCH ----------------
  // This will now be triggered from GLOBAL Header
  window.handleTaskSearch = (query) => {
    if (!query.trim()) {
      setTasks(allTasks);
    } else {
      setTasks(
        allTasks.filter((t) =>
          t.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>

      {loading ? (
        <p className="text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-600">No tasks available</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task.taskId}
              className="bg-white p-4 rounded-lg shadow-md border"
            >
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>

              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Status:</span> {task.status} |{" "}
                <span className="font-medium">Priority:</span> {task.priority}
              </p>

              <div className="mt-3 flex gap-3">
                <Link
                  to={`/tasks/${task.taskId}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>

                <Link
                  to={`/tasks/${task.taskId}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(task.taskId)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
