import { useState } from "react";
import toast from "react-hot-toast";

const SubtaskForm = ({ taskId, users = [], onCreate, currentUser }) => {
  console.log("USERS IN SUBTASK FORM:", users);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleAdd = () => {
    if (currentUser?.role !== "organizer") {
      toast.error("Only organizers can create subtasks!");
      return;
    }

    if (!title.trim()) {
      toast.error("Subtask title required");
      return;
    }

    onCreate({
      taskId,
      title,
      assigned_to: assignedTo ? [assignedTo] : [],
    });

    toast.success("Subtask created successfully!");
    setTitle("");
    setAssignedTo("");
  };

  return (
    <div className="flex gap-2 mt-4 items-center">
      <input
        type="text"
        placeholder="Subtask title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded flex-1"
      />

      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Unassigned</option>
        {users.map((u) => (
          <option key={u.userId} value={u.userId}>
            {u.name} ({u.role})
          </option>
        ))}
      </select>

      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Subtask
      </button>
    </div>
  );
};

export default SubtaskForm;



