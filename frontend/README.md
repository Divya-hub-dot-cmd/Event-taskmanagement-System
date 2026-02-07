# Event Task Management System

A full-stack role-based task management application designed for event operations.  
The system supports organizers, staff, vendors, and contractors with controlled permissions, Kanban workflow, calendar planning, and detailed activity tracking.

---

## 🔥 Key Features

- Role-based authentication using JWT
- User roles: Organizer, Staff, Vendor, Contractor
- Task & Subtask management
- Kanban board (Not Started → In Progress → Completed → Delayed)
- Calendar-based task scheduling
- Task assignment with progress tracking
- Subtask status control (only assigned users can update)
- Comment system with file attachments
- Activity log for full audit trail
- Secure backend APIs with middleware-based authorization

---

## 👥 Role Capabilities

| Role        | Permissions |
|------------|-------------|
| Organizer  | Create tasks, assign users, manage subtasks, view all logs |
| Staff      | Update assigned task/subtask status, add comments |
| Vendor     | Update assigned task/subtask status, add comments |
| Contractor | Update assigned task/subtask status, add comments |

---

## 🛠 Tech Stack

### Frontend
- React (Create React App)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## 📸 Application Screens

- Kanban Board (task workflow)
- Calendar View (monthly planning)
- Task Detail Page (subtasks, comments, activity logs)

> Screenshots are available in the `/screenshots` folder.

---

## ⚙️ Installation & Setup

### Backend
```bash
cd backend
npm install
npm start
Create .env file:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

Frontend
cd frontend
npm install
npm start


Frontend runs at:
http://localhost:3000

Backend runs at:
http://localhost:5000

🎯 Use Case

This project is designed for real-world event management scenarios where multiple teams must coordinate logistics, inventory, technical setup, and post-event activities with strict role-based access and clear accountability.

👩‍💻 Author

Dhivya Velumani
Event Task Management System – Portfolio Project


---

## 4️⃣ Create screenshots folder (once)

In project root:



/screenshots


Put images:
- `kanban.png`
- `calendar.png`
- `task-details.png`

These **do not go in README text**, just reference them.

---

## 5️⃣ Commit to GitHub (correctly)

```bash
git add README.md screenshots
git commit -m "Add professional project README"
git push