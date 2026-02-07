import React, { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const data = await login(form); // backend response

    console.log("Login data:", data);

    const token = data.token;
    const user = data.user;

    if (!token || !user) {
      throw new Error("Invalid login response");
    }

    // ✅ STORE FULL USER DATA (THIS FIXES PROFILE)
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        userId: user.userId,
        name: user.name,
        email: user.email,          // ✅ THIS WAS MISSING
        role: (user.role || "staff").toLowerCase(),
      })
    );

    toast.success("Login successful");
    navigate("/kanban");
  } catch (err) {
    console.error("Login error:", err);
    toast.error("Login failed");
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

