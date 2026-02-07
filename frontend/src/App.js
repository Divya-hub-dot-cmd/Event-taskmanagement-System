import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./pages/Auth/RequireAuth";


import Layout from "./components/Layout/Layout";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import Kanban from "./pages/Dashboard/Kanban";
import TaskList from "./pages/Dashboard/TaskList";
import TaskDetails from "./pages/Dashboard/TaskDetails";
import EditTask from "./pages/EditTask";
import CreateTask from "./pages/CreateTask";
import Calendar from "./pages/Dashboard/Calendar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN FIRST */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* AUTH GUARD */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/create" element={<CreateTask />} />
            <Route path="/tasks/:taskId" element={<TaskDetails />} />
            <Route path="/tasks/:taskId/edit" element={<EditTask />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
