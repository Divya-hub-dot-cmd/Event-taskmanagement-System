const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const subtaskRoutes = require("./routes/subtaskRoutes");
const commentRoutes = require("./routes/commentRoutes");
const assigneeRoutes = require("./routes/assigneeRoutes");
const activityRoutes = require("./routes/activityRoutes");

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // React app
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));  
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/subtasks", subtaskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/assignees", assigneeRoutes);
app.use("/api/activity", activityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
