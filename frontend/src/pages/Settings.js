import React from "react";

const Settings = () => {
  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      <p className="text-gray-600 mb-4">
        More settings will be available soon.
      </p>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="text-red-600 hover:underline"
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;
