import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeaderUserMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  return (
    <div className="relative">
      {/* USER BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {user.name?.[0]}
        </div>
        <span className="font-medium">
          {user.name} ({user.role})
        </span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded z-50">
          <div
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            👤 Profile
          </div>

          <div
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            ⚙️ Settings
          </div>

          <div
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
          >
            🚪 Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderUserMenu;
