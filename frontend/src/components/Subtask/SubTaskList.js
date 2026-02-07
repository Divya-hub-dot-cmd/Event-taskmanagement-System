import React, { useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

const SubTaskList = ({
  subtasks = [],
  users = [],
  currentUser,
  onAssignChange,
  onStatusChange,
  onDelete,
  onUpdateTitle,
}) => {
  const role = currentUser?.role;
  const userId = currentUser?.userId;

  // ✅ ONE STATE — not inside map
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const startEdit = (subtask) => {
    setEditingId(subtask.subtaskId);
    setEditedTitle(subtask.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedTitle("");
  };

  const saveEdit = (subtaskId) => {
    onUpdateTitle(subtaskId, { title: editedTitle });
    cancelEdit();
  };

  return (
    <div className="space-y-3">
      {subtasks.map((s) => {
        const isAssigned = s.assigned_to?.includes(userId);
        const isOrganizer = role === "organizer" || role === "admin";
        const isEditing = editingId === s.subtaskId;

        return (
          <div
            key={s.subtaskId}
            className="border rounded p-4 flex justify-between items-center"
          >
            {/* LEFT */}
            <div className="flex-1">
              {isEditing ? (
                <input
                  className="border p-1 rounded w-full"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                <strong>{s.title}</strong>
              )}

              <p className="text-xs text-gray-500 mt-1">
                Status: {STATUS_LABELS[s.status] || "Pending"}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {/* STAFF STATUS UPDATE */}
              {!isOrganizer && isAssigned && s.status !== "completed" && (
                <button
                  className="bg-yellow-100 px-3 py-1 rounded text-sm"
                  onClick={() =>
                    onStatusChange(
                      s.subtaskId,
                      s.status === "pending"
                        ? "in_progress"
                        : "completed"
                    )
                  }
                >
                  Move to{" "}
                  {s.status === "pending" ? "In Progress" : "Completed"}
                </button>
              )}

              {/* ASSIGN — ORGANIZER */}
              {isOrganizer && (
                <select
                  value={s.assigned_to?.[0] || ""}
                  onChange={(e) =>
                    onAssignChange(s.subtaskId, {
                      assigned_to: e.target.value ? [e.target.value] : [],
                    })
                  }
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              )}

              {/* EDIT — ORGANIZER */}
              {isOrganizer &&
                (isEditing ? (
                  <>
                    <Save
                      className="cursor-pointer text-green-600"
                      onClick={() => saveEdit(s.subtaskId)}
                    />
                    <X
                      className="cursor-pointer"
                      onClick={cancelEdit}
                    />
                  </>
                ) : (
                  <Pencil
                    className="cursor-pointer"
                    onClick={() => startEdit(s)}
                  />
                ))}

              {/* DELETE — ORGANIZER */}
              {isOrganizer && (
                <Trash2
                  className="cursor-pointer text-red-600"
                  onClick={() => onDelete(s.subtaskId)}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubTaskList;
