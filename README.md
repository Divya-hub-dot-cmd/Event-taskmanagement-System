# Event Task Management System

A full-stack role-based task management system designed for real-world event operations.  
Supports organizers, staff, vendors, and contractors with strict permissions, subtasks, activity tracking, and multiple task views.

---

## ✨ Features

- JWT-based authentication & authorization
- Role-based access control (Organizer, Staff, Vendor, Contractor)
- Kanban board (Not Started → In Progress → Completed → Delayed)
- Calendar view with task scheduling
- Task & subtask management
- Assigned users can update their own work status
- Activity logs & audit trail
- Comments with attachments
- Secure REST APIs

---

## 🛠 Tech Stack

### Frontend
- React (Create React App)
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## 📸 Screenshots

Screenshots are available in the `/screenshots` folder:

screenshots/
├── kanban.png
├── calendar.png
└── task-details.png


---

## ⚙️ Setup Instructions

### Backend

```bash
cd backend
npm install
Create a .env file inside the backend folder:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
Run backend:

npm start
Backend runs at:

http://localhost:5000
Frontend
cd frontend
npm install
npm start
Frontend runs at:

http://localhost:3000
🎯 Use Case
Designed for event management scenarios where multiple teams handle logistics, inventory, technical setup, and post-event activities with strict accountability and role-based permissions.

👩‍💻 Author
Dhivya Velumani
Event Task Management System – Portfolio Project


---

---

## 🔌 API Endpoints

All APIs are protected using JWT unless stated otherwise.

---

### 🔐 Authentication
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/auth/signup | Register a new user |
| POST | /api/auth/login | Login and receive JWT |
| GET | /api/auth | Get all users |

---

### 📋 Tasks
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/tasks | Create a new task |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:taskId | Get task by ID |
| PUT | /api/tasks/:taskId | Update task |
| DELETE | /api/tasks/:taskId | Delete task |
| PUT | /api/tasks/:taskId/status | Update task status |

---

### 📊 Dashboard Views
| Method | Endpoint | Description |
|------|---------|-------------|
| GET | /api/tasks/dashboard/kanban | Get Kanban board view |
| GET | /api/tasks/dashboard/calendar | Get calendar view |
| GET | /api/tasks/dashboard/list | Get filtered task list |

---

### 👥 Task Assignments
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/tasks/:taskId/assign | Assign users to a task |
| PUT | /api/tasks/assignee/:assigneeId/progress | Update assigned user work status |

---

### 🧩 Subtasks
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/subtasks/:taskId | Create subtask |
| GET | /api/subtasks/task/:taskId | Get subtasks by task |
| PUT | /api/subtasks/:subtaskId | Update subtask |
| PUT | /api/subtasks/:subtaskId/status | Update own subtask status |
| DELETE | /api/subtasks/:subtaskId | Delete subtask |

---

### 💬 Comments
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/comments/:taskId | Add comment (with file upload) |
| GET | /api/comments/:taskId | Get comments by task |
| PUT | /api/comments/:commentId | Update comment |
| DELETE | /api/comments/:commentId | Delete comment |

---

### 📝 Activity Logs
| Method | Endpoint | Description |
|------|---------|-------------|
| GET | /api/activity/:taskId | Get activity logs for task |



##  Commit it to GitHub

After pasting and saving:

```bash
git add README.md
git commit -m "Add complete project documentation"
git push
