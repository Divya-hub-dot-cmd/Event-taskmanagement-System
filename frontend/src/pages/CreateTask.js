// src/pages/CreateTask.js
import React from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { createTask } from "../services/taskService";

const CreateTask = () => {
  const navigate = useNavigate();

  const handleCreate = async (taskData) => {
    try {
      await createTask(taskData); // backend already supports assignees
      alert("Task created successfully!");
      navigate("/list");
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      alert("Failed to create task.");
    }
  };

  return <TaskForm onSubmit={handleCreate} buttonText="Create Task" />;
};

export default CreateTask;
