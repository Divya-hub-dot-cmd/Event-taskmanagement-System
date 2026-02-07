// src/components/Layout/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiColumns, FiCalendar, FiList, FiPlus } from "react-icons/fi";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/kanban", label: "Kanban", icon: <FiColumns /> },
    { path: "/calendar", label: "Calendar", icon: <FiCalendar /> },
    { path: "/tasks", label: "Task List", icon: <FiList /> }, // ✅ FIXED
    { path: "/tasks/create", label: "Create Task", icon: <FiPlus /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-6 text-2xl font-bold text-blue-600 border-b">
        Task Manager
      </div>

      <nav className="mt-4 flex-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all
                ${
                  isActive
                    ? "border-l-4 border-blue-600 bg-blue-50 text-blue-600 font-semibold"
                    : "border-l-4 border-transparent"
                }
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 text-xs text-gray-500 border-t">
        © 2025 Event Task Manager
      </div>
    </aside>
  );
}

export default Sidebar;
