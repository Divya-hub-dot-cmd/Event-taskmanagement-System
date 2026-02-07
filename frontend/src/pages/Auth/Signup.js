import React, { useState } from "react";
import { signup } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "organizer", // default role
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true);
  try {
    await signup(form);
    navigate("/login");
  } catch (err) {
    setError("Signup failed");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
            value={form.name}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
            value={form.email}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
            value={form.password}
            required
          />
          <select
            name="role"
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
            value={form.role}
          >
            <option value="organizer">Organizer</option>
<option value="admin">Admin</option>
<option value="staff">Staff</option>
<option value="vendor">Vendor</option>
<option value="contractor">Contractor</option>

          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
