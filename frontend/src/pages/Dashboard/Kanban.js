import React, { useEffect, useState } from "react";
import TaskCard from "../../components/Task/TaskCard";
import TaskDetails from "./TaskDetails";
import { getKanbanView, updateTaskStatus } from "../../services/taskService";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

function Kanban() {
  const [tasks, setTasks] = useState({
    notStarted: [],
    inProgress: [],
    done: [],
    delayed: [],
  });
  const [selectedTask, setSelectedTask] = useState(null);

  // Load user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = storedUser || { role: "guest", userId: null };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getKanbanView();
        console.log("API Response:", response);

        setTasks({
          notStarted: response.kanban?.notStarted || [],
          inProgress: response.kanban?.inProgress || [],
          done: response.kanban?.completed || [],
          delayed: response.kanban?.delayed || [],
        });
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { key: "notStarted", title: "Not Started", color: "bg-gray-200" },
    { key: "inProgress", title: "In Progress", color: "bg-blue-200" },
    { key: "done", title: "Completed", color: "bg-green-200" },
    { key: "delayed", title: "Delayed", color: "bg-red-200" },
  ];

  // Handle Drag and Drop
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceTasks = Array.from(tasks[sourceCol]);
    const destTasks = Array.from(tasks[destCol]);

    const [movedTask] = sourceTasks.splice(source.index, 1);

    // Role-based restriction
    if (user.role === "staff" || user.role === "vendor") {
      const isAssigned = movedTask.assigned_to?.includes(user.userId);
      if (!isAssigned) {
        alert(" You can only move tasks assigned to you.");
        return;
      }
    }

    if (sourceCol === destCol) {
      sourceTasks.splice(destination.index, 0, movedTask);
      setTasks((prev) => ({
        ...prev,
        [sourceCol]: sourceTasks,
      }));
    } else {
      destTasks.splice(destination.index, 0, movedTask);
      setTasks((prev) => ({
        ...prev,
        [sourceCol]: sourceTasks,
        [destCol]: destTasks,
      }));

      try {
        let newStatus = "not started";
        if (destCol === "inProgress") newStatus = "in progress";
        else if (destCol === "done") newStatus = "completed";
        else if (destCol === "delayed") newStatus = "delayed";

        await updateTaskStatus(movedTask.taskId, newStatus);
        console.log(`Task ${movedTask.taskId} moved to ${newStatus}`);
      } catch (err) {
        console.error("Error updating task status:", err);
        alert("Failed to update task status.");
      }
    }
  };

  return (
    <div className="p-6 relative grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left Side - Kanban Board */}
      <div className="col-span-3">
        <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {columns.map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col"
                  >
                    {/* Column Header */}
                    <h2
                      className={`text-lg font-semibold text-center py-2 rounded ${col.color}`}
                    >
                      {col.title}
                    </h2>

                    {/* Column Tasks */}
                    <div className="mt-2 space-y-3 min-h-[100px]">
                      {tasks[col.key]?.length > 0 ? (
                        tasks[col.key].map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="cursor-pointer"
                              >
                                {/* Drag handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-1 bg-gray-200 rounded mb-1 text-xs text-center cursor-move"
                                >
                                  ⠿
                                </div>

                                {/* Clickable card */}
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Clicked Task:", task);
                                    setSelectedTask(task);
                                  }}
                                >
                                  <TaskCard task={task} />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center">
                          No tasks
                        </p>
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Right Side - Task Details */}
      <div className="col-span-1">
        <TaskDetails task={selectedTask} />
      </div>
    </div>
  );
}

export default Kanban;

