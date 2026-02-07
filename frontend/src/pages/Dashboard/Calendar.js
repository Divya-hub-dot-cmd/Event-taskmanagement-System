import React, { useEffect, useState } from "react";
import { getAllTasks } from "../../services/taskService";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadTasks = async () => {
      const data = await getAllTasks();

      if (["staff", "vendor"].includes(currentUser.role)) {
        setTasks(
          data.filter((t) =>
            t.assigned_to?.includes(currentUser.userId)
          )
        );
      } else {
        setTasks(data);
      }
    };

    loadTasks();
  }, [currentUser]);

  // Month helpers
  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Group tasks by date
  const taskMap = {};
  tasks.forEach((task) => {
    if (!task.due_date) return;
    const date = new Date(task.due_date).toISOString().split("T")[0];
    taskMap[date] = taskMap[date] || [];
    taskMap[date].push(task);
  });

  const statusColor = (status) => {
    if (status === "completed") return "bg-green-100 text-green-800";
    if (status === "in progress") return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const changeMonth = (direction) => {
    if (direction === "prev") {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else {
        setMonth((m) => m - 1);
      }
    } else {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else {
        setMonth((m) => m + 1);
      }
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeMonth("prev")}
          className="px-3 py-1 border rounded"
        >
          ◀
        </button>

        <h2 className="text-2xl font-bold">
          {monthName} {year}
        </h2>

        <button
          onClick={() => changeMonth("next")}
          className="px-3 py-1 border rounded"
        >
          ▶
        </button>
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          const dayTasks = taskMap[dateKey] || [];

          return (
            <div
              key={dateKey}
              className="bg-white p-3 rounded-lg shadow min-h-[120px]"
            >
              <div className="font-semibold text-sm mb-2">{day}</div>

              {dayTasks.map((task) => (
                <div
                  key={task.taskId}
                  onClick={() => navigate(`/tasks/${task.taskId}`)}
                  className={`text-xs p-2 rounded mb-1 cursor-pointer ${statusColor(
                    task.status
                  )}`}
                >
                  {task.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

