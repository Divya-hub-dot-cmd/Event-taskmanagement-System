import React from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <p>No user data</p>;

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      <div className="space-y-3">
        <div>
          <p className="text-gray-500">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{user.email || "—"}</p>
        </div>

        <div>
          <p className="text-gray-500">Role</p>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;

