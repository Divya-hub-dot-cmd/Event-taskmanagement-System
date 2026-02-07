import React from "react";
import { Calendar, Tag, Layers } from "lucide-react";
import { Link } from "react-router-dom";

function TaskCard({ task }) {
  return (
    <Link to={`/tasks/${task.taskId}`} className="block">
      <div
        className="bg-white shadow rounded-lg p-4 border border-gray-200 
                   hover:shadow-md transition cursor-pointer
                   w-full overflow-hidden"
      >
        {/* Title */}
        <h3
          className="text-md font-semibold text-gray-800 mb-2
                     break-words whitespace-normal line-clamp-2"
        >
          {task.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm text-gray-600 mb-3
                     break-all whitespace-normal line-clamp-2"
        >
          {task.description}
        </p>

        {/* Metadata */}
        <div className="space-y-2 text-sm overflow-hidden">
          {/* Category & Type */}
          <div className="flex items-start gap-2 text-gray-700 break-words">
            <Layers size={16} className="text-gray-500 shrink-0 mt-0.5" />
            <span className="capitalize break-words">
              {task.category?.replace("_", " ")} • {task.type}
            </span>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-gray-500 shrink-0" />
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium break-words ${
                task.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {task.priority}
            </span>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={16} className="text-gray-500 shrink-0" />
            <span className="break-words">
              {new Date(task.due_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TaskCard;
